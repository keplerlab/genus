import sketch from "sketch";
import fileSystem from './fileSystem';
import utils from './utils';
import CONFIG from './config';

// documentation: https://developer.sketchapp.com/reference/api/

// Configuration parameters
var default_asset_export_format = CONFIG.sketch.exportFormat;
var use_id_for_name = CONFIG.sketch.use_id_for_asset_name;
var embedSvgConf = CONFIG.sketch.embedSvg;
var cssFileName = CONFIG.sketch.cssFileName ;
var htmlFileName = CONFIG.sketch.htmlFileName ;
var imageFolder = CONFIG.sketch.imageFolder ; 
var imageScalesString = CONFIG.sketch.imageScalesString ;
var imageScales = CONFIG.sketch.imageScales ;

var utils_obj = new utils();
var fileSystem_obj = new fileSystem(context) ; 
/**
 * Exporter for sketch to HTML.
 *
 * @param {*} context
 */
function Exporter(context) 
{

    var context = context;
	var doc = require('sketch/dom').getSelectedDocument()
    var selection = doc ? doc.selectedLayers : nil;
    var selectedArtboards = getSelectedArtboards();
    var embedSvg = false;
    var exportFolder = null;

    this.getSelection = function() 
    {
        return selection;
    }

    /**
     * getter method for selected artboards.
     *
     * @returns {Array<Object>}
     */
    this.getSelectedArtboards = function()
    {
        return selectedArtboards;
    }

    function forEachLayer(group, func) 
    {
        var layers = group.layers;
        for (var i = 0; i < layers.length; i++) {
            func(layers[i]);
        }
    };


    /**
     * Checks if layer marked for export
     *
     * @returns true if No of exportable formats greater that 1 else false
     */
    function layerMarkedForExport(layer) 
    {
        if(layer.markedForExport != undefined )
        {
            return layer.markedForExport ; 
        }
        else
        {
            var formats = layer.exportFormats;
            layer.markedForExport = formats.length > 0;
            return layer.markedForExport
        } 

    }


    /**
     * Get the array of selected artboards in sketch file
     *
     * @returns {Array} list of artboards selected
     */
    function getSelectedArtboards() 
    {

        // Using Set so that selected artboards are not repeated and unique
        let artboardSet = new Set()
        var artboards = [];
        for (var i = 0; i < selection.length ; i++) 
        {
			var layer = selection.layers[i];
			var artboard = undefined ;
			// return artboard if selection is an artboard itself
            if (layer.type == "Artboard") 
            {
				artboard = layer ;
			}
			// else return parent artboard of layer 
            else 
            {
				artboard = layer.getParentArtboard();
			}
			// Make sure artboard is not undefined and is unique using sets
            if (artboard != undefined && !artboardSet.has(artboard.id)) 
            {
                artboardSet.add(artboard.id)
                artboards.push(artboard);
            }
        }

        return artboards;
    }

    var exportedLayers = {};

    /**
     * Method to generate html given the artboard.
     *
     * @param {*} artboard
     * @returns {String} html corresponding to artboard
     */
    function generateHTML(artboard) 
    {
        // Create new array to save layers for export for each artboard
        exportedLayers[artboard] = [];

        // Get HTML & CSS for children
        var childrenHtml = generateHTMLForChildren(artboard, "\t\t\t");

        // Generate HTML
        var html = generateHTMLHeader(artboard);
        html += childrenHtml;
        html += generateHTMLFooter();

        return html;
    }

    /**
     * Method to generate CSS for the artboard.
     *
     * @param {*} artboard
     * @returns {String} css for the artboard
     */
    function generateCSS(artboard) 
    {
        // Generate CSS
        var css = "/* Generated by Genus plugin */\n";
        css += "\n"

        css += "/* Boiler plate CSS \n"
        css += "sk-ab is css style applied to full art board\n"
        css += "sk-asset is common css property applied to every css style generated by genus plugin \n"
        css += "*/ \n"
        css += "\n";
        css += generateBoilerPlateCSS();
        css += "\n";

        css += "/* Specific to " + artboard.name + " */\n";
        css += generateCSSForArtboard(artboard);
        css += "\n";

        exportedLayers[artboard].forEach(function(layer) {
            css += generateCSSForLayer(layer);
        });

        css = css.replace(/\n.+(undefined|null).+\n/gi, '\n');

        return css;
    }

    /**
     * Generates the <head> html content for the artboard
     *
     * @param {*} artboard
     * @returns {String} content for <head> tag
     */
    function generateHTMLHeader(artboard) 
    {

        var html = "<html>\n";
        html += "\t<head>\n";
        html += "\t\t<link href='" + cssFileName + "' rel='stylesheet'>\n";
        html += "\t\t<meta charset=\"utf-8\"/>\n"
        html += "\t</head>\n";
        html += "\t<body style=\"margin:0px;\">\n";
        html += "\t <div style=\"width: " + Math.round(artboard.frame.width) + "px; height: 100%; position:relative; margin:auto;\"> \n";
        html += "\t\t<div class='sk-ab sk-" + utils_obj.cleanString(artboard.name) + "'>\n";

        return html;
    }

    /**
     * Generates the closing tags for head, html and the div's inside the body
     *
     * @param {*} artboard
     * @returns {String} html string for closing the html head, body and div tag
     */
    function generateHTMLFooter() 
    {
        var html = "\t\t</div>\n";
        html += "\t</div>\n";
        html += "\t</body>\n";
        html += "</html>";

        return html;
    }

    /**
     * Generates the closing tags for head, html and the div's inside the body
     *
     * @returns {String} html string for closing the html head, body and div tag
     */
    function checkIfLayerExportedAsImage(layer)
    {
        // If layer is marked as exportable in sketch export it should be
        // exported as an image
        var condition1 = layerMarkedForExport(layer) 

        // If Layer is of type Group and that group has any element that has
        // mask then export whole group as an image
        var condition2 = (layer.type == "Group" && utils_obj.isMaskLayerInGroup(layer))

        // Export any layer as an image which is not of type text or group
        // e.g. Shape, Image, Symbols etc.
        var condition3 = (layer.type != "Text" && layer.type != "Group")

        // Export layer as an image if any of these three conditions are met 
        return  condition1 ||  condition2 || condition3
    }
	 /**
     * Main recursive function for generate html for any layer
     *
     * @returns {String} html 
     */
    function generateHTMLForChildren(group, tabs) 
    {
        var html = "";

        forEachLayer(group, function(layer) 
        {
            if (!layer.sketchObject.isVisible()) 
            {
                return;
            }

            layer.layerName = utils_obj.generateLayerName(layer) ;
			
            var openTag = tabs + "<div class='sk-asset sk-" + layer.layerName + "'>";
			var closeTag = "</div>\n";

            // This if condition should execute only if we want a layer to be exported as image
            if (checkIfLayerExportedAsImage(layer)) 
            {
                exportedLayers[layer.getParentArtboard()].push(layer);
                var embedCode = "";
                html += openTag + embedCode + closeTag;
            }
            // If layer is group...
            else if (layer.type == "Group") 
            {
                var childrenHtml = generateHTMLForChildren(layer, tabs + "\t");

                // If group is not empty, write it and its children to HTML
                if (childrenHtml != "") 
                {
                    html += openTag + "\n";
                    html += childrenHtml;
                    html += tabs + closeTag;

                    // This layer needs to be exported to HTML
                    exportedLayers[layer.getParentArtboard()].push(layer);
                }
            }
            // If layer is text export text
            else if (layer.type == "Text") 
            {
                layer = preprocessingTextLayer(layer);
				html += openTag + generateHTMLTextForMultiText(layer) + closeTag;
                exportedLayers[layer.getParentArtboard()].push(layer);
            } 
            else 
            {
                console.log("Unhandled layer type encountered, Skipping export of layer ...")
            }

        });

        return html;
    }


	/**
     * Reprocesses and extracts data for Multiple style text using MacOS Attributed strings 
     * for text layers 
     *
     * @param {*} Text layer for which the html needs to be generated
     * @param {*} tabs used for indentation of generated html text
     * @returns layer with preprocessing done
     */
	function preprocessingTextLayer(layer, tabs)
	{
        // Following code extracts multiple text styles from text using MacOS api, Sketch api does not support
        // Multiple text styles in a layer 

        // TODO : Mark all functions that are not part of sketch javascript api

        /* layer.sketchObject.attributedStringValue(), NSMakeRange(0, attrStr.length()),MOPointer.alloc().init()
        * is not part of official sketch javascript api 
        */
		const attrStr = layer.sketchObject.attributedStringValue()
		const string_text = attrStr.string()
		let limitRange = NSMakeRange(0, attrStr.length())
		let effectiveRange = MOPointer.alloc().init()

		const fonts = []
		const font_colors = []
		const stringStartIndices = []
		const stringLengths = []

		let effectiveRange2 = MOPointer.alloc().init()

        while (limitRange.length > 0) 
        {
            // attribute_atIndex_longestEffectiveRange_inRange is not part of official sketch javascript api 
			fonts.push(attrStr.attribute_atIndex_longestEffectiveRange_inRange(
				NSFontAttributeName,
				limitRange.location,
				effectiveRange,
				limitRange
			))

			var attributes = attrStr.attributesAtIndex_longestEffectiveRange_inRange(
				limitRange.location,
				effectiveRange2,
				limitRange
			)
            if (attributes != null) 
            {
                // attributes.MSAttributedStringColorAttribute.hexValue is not part of official sketch javascript api 
				font_colors.push(attributes.MSAttributedStringColorAttribute.hexValue())
			}

			stringStartIndices.push(effectiveRange.value().location)
			stringLengths.push(effectiveRange.value().length)

            // NSMakeRange, NSMaxRange is not part of official sketch javascript api 
			limitRange = NSMakeRange(
				NSMaxRange(effectiveRange.value()),
				NSMaxRange(limitRange) - NSMaxRange(effectiveRange.value())
			)
		}


		const text_span_array = []
        for (var i = 0; i < fonts.length; i++) 
        {
			var text_span = new Object();

			var font = fonts[i];
			var font_color = font_colors[i];

            /* NSFontManager.sharedFontManager().weightOfFont_ , layer.sketchObject.font()
            * is not part of official sketch javascript api 
            */
            let weightIndex = NSFontManager.sharedFontManager().weightOfFont_(layer.sketchObject.font());
            var fontName = font.fontName();
			var fontFamilyName = font.familyName();
            var fontSize = font.pointSize();
            let weight = utils_obj.appKitWeightToCSSWeight(weightIndex, fontName);
			var sub_string = string_text.substr(stringStartIndices[i], stringLengths[i]);
			sub_string = sub_string.replace(/(?:\r\n|\r|\n)/g, '<br>');

			text_span.text = sub_string
			text_span.fontFamilyName = fontFamilyName
			text_span.weight = weight
			text_span.fontSize = fontSize
			text_span.font_color = font_color
			text_span_array.push(text_span)
		}

		layer["tspan"] = text_span_array;
		var spanArray = layer.tspan;
		var spanLength = text_span_array.length;
		//console.log("spanLength: "+ spanLength);

		layer["tspanObject"] = text_span_array;
		
		return layer ; 
	}
    /**
     * Exports images for all the layers to a specified destination, calls exportImages internally
     *
     * @param {*} layers list of layers to be exported
     * @param {*} exportPath the path where the images need to be exported
     */
    function exportImages(layers, exportPath) 
    {
        layers.forEach(function(layer) {
            exportImageForLayer(layer, exportPath + imageFolder, default_asset_export_format, imageScales);
        });
    }

    /**
     * Export images to a specified destination for a particular layer
     *
     * @param {*} layer layer to be exported
     * @param {*} exportPath export path
     * @param {*} imageFormat image format of exported images
     * @param {*} imageScales scale of images to be exported (e.g 2x, 3x)
     */
    function exportImageForLayer(layer, exportPath, imageFormat, imageScales) 
    {
        const options = {
            scales: imageScalesString,
            formats: default_asset_export_format
        }
        options['output'] = exportPath
        options["use-id-for-name"] = use_id_for_name
        options.trimmed = false
        sketch.export(layer, options)

        for (var index in imageScales) {
            var scale = imageScales[index];
            if (scale > 1) {
                var appendName = utils_obj.nameForScale(scale);
                var srcName = exportPath + layer.id + appendName + "." + imageFormat;
                var dstName = exportPath + layer.layerName + appendName + "." + imageFormat;
                fileSystem_obj.renameFile(srcName, dstName);

            } else {
                var srcName = exportPath + layer.id + "." + imageFormat;
                var dstName = exportPath + layer.layerName + "." + imageFormat;
                fileSystem_obj.renameFile(srcName, dstName);

            }
        }

    }

    /**
     * Generates html when there is multiple texts for the Sketch layer type "Text"
     *
     * @param {*} Sketch layer of type "Text"
     * @returns {String} Returns collection of spans as string to be used exported in html
     */
    function generateHTMLTextForMultiText(layer) 
    {
        var str = "";
        var spanArray = layer.tspan;
        var spanLength = spanArray.length;
		
        for (var i = 0; i < spanLength; i++) 
        {
            var openTag = '<span class="span' + (i + 1) + '">';
            var closeTag = "</span>";

            var spanElement = spanArray[i];
            var spanText = spanElement.text;
            if (spanText === undefined) 
            {
                str += openTag + "" + closeTag;
            } else 
            {
                str += openTag + spanText + closeTag;
            }

        }
        return str;
    }



    /**
     * Generate border css style when border style is applied in the layer
     *
     * @param {*} style border style property from sketch
     * @returns {String} css for border radius
     */
    function getBorderCss(style) 
    {
        var borderCss = "";
        var border_applied_counter = 0;
        if (style.borders != undefined) 
        {
            for (var k = 0; k < style.borders.length; k++) 
            {
                if (style.borders[k].enabled) 
                {
                    border_applied_counter += 1;
                    if (border_applied_counter == 1) 
                    {
                        borderCss += "\tborder: ";

                    } else if (border_applied_counter > 1) 
                    {
                        borderCss += " , ";
                    }
                    borderCss += getBorderString(style.borders[k]);

                }
            }
            if (border_applied_counter > 0)
                borderCss += " ;\n";
        }

        return borderCss;
    }

	/**
     * Generate border string given border value
     *
     * @param {*} style border style property from sketch
     * @returns {String} css for border radius
     */
    function getBorderString(border) 
    {

        var borderCssString = ""
        if (border.thickness != undefined) 
        {
            borderCssString += border.thickness + "px ";
        }

        if (border.color != undefined && border.fillType == "Color") 
        {
            borderCssString += border.color;
        }


        return borderCssString;

    }


    /**
     * Generates css when shadow style is applied in the layer
     *
     * @param {*} style style object for the shadow
     * @returns {String} css for the shadow style
     */
    function getShadowCss(style) 
    {
        var shadowCss = "";
        var shadow_applied_counter = 0;
        if (style.shadows != undefined) 
        {
            for (var k = 0; k < style.shadows.length; k++) 
            {
                if (style.shadows[k].enabled) 
                {
                    shadow_applied_counter += 1;
                    if (shadow_applied_counter == 1) {
                        shadowCss += "\ttext-shadow: ";

                    } else if (shadow_applied_counter > 1) 
                    {
                        shadowCss += " , ";
                    }
                    shadowCss += getShadowString(style.shadows[k]);

                }
            }
            if (shadow_applied_counter > 0)
                shadowCss += " ;\n";
        }

        return shadowCss;
    }

	/**
	 * Generates css string for shadow property 
	 *
	 * @param {*} shadow object
	 * @returns {String} css for the shadow style
	 */
    function getShadowString(shadow) 
    {

        var shadowCssString = ""
        // h-shadow v-shadow blur-radius color|none|initial|inherit;
        if (shadow.x != undefined) 
        {
            shadowCssString += shadow.x + "px ";
        }
        if (shadow.y != undefined) 
        {
            shadowCssString += shadow.y + "px ";
        }
        if (shadow.blur != undefined) 
        {
            shadowCssString += shadow.x + "px ";
        }
        if (shadow.color != undefined) 
        {
            shadowCssString += shadow.color;
        }

        return shadowCssString;

    }


    /**
     * Generates CSS for the layer. 
     * This gives absolute position for left and top, width and height, font styles, opacity etc.
     *
     * @param {*} layer layer for which the css needs to be generated
     * @returns {String} css for the layer
     */
    function generateCSSForLayer(layer) 
    {
        // Variable to store actual image size of image layer
        var nsImageSize = undefined

        // Set css name 
        var css = ".sk-asset.sk-" + layer.layerName + " {\n";
        
        if(checkIfLayerExportedAsImage(layer))
        {
        /* Sketch api often returns wrong width and height for an image. 
         * e.g. In case of layer has shadow or mask property, to prevent bugs due to this
         * Width and height or any image is programmatically extracted from actual exported image using
         * unofficial Mac api , NSImage.alloc().initWithData, buffer.toNSData() and nsImage.size() functions are not 
         * part of official sketch javascript api 
         */

            const options = {
                formats: 'png',
                output: false
            }
            options.trimmed = false
            const buffer = sketch.export(layer, options)
            var nsImageForBuffer = buffer.toNSData()
            let nsImage = NSImage.alloc().initWithData(nsImageForBuffer)
            nsImageSize = nsImage.size()

            
            var image_full_path = imageFolder + layer.layerName + "." + default_asset_export_format;
            css += "\tbackground-image: url(\"" + image_full_path + "\");\n";
            var diffWidth = (layer.frame.width - nsImageSize.width)/2
            var diffHeight = (layer.frame.height - nsImageSize.height)/2
            css += "\tleft: " + Math.round(layer.frame.x + diffWidth) + "px;\n";
            css += "\ttop: " + Math.round(layer.frame.y + diffHeight) + "px;\n";
            css += "\twidth: " + Math.round(nsImageSize.width) + "px;\n";
            css += "\theight: " + Math.round(nsImageSize.height) + "px;\n";

        } 
        else 
        {
        /* For layer type not image get width height from official sketch javascript api
         */
            css += "\tleft: " + Math.round(layer.frame.x) + "px;\n";
            css += "\ttop: " + Math.round(layer.frame.y) + "px;\n";
            css += "\twidth: " + Math.round(layer.frame.width) + "px;\n";
            css += "\theight: " + Math.round(layer.frame.height) + "px;\n";
        }

        css += "}\n";
        css += "\n";

        /* If assets are exported at different scaled resolution, Following code will return different css properties 
        * for different resolution devices, e.g. For desktop good resolution screen image picked could be 2x instead of 1x resolution
        */
        if(checkIfLayerExportedAsImage(layer))
        {
 
            for (var index in imageScales) 
            {
                var scale = imageScales[index];
                if (scale > 1) 
                {
                    var appendName = utils_obj.nameForScale(scale);

                    css += "@media only screen and (min--moz-device-pixel-ratio: " + scale + "),\n" +
                        "only screen and (-o-min-device-pixel-ratio: " + scale + "/1),\n" +
                        "only screen and (-webkit-min-device-pixel-ratio: " + scale + "),\n" +
                        "only screen and (min-device-pixel-ratio: " + scale + ") {\n";

                    css += "\t.sk-asset.sk-" + layer.layerName + " {\n";
                    var image_full_path =  imageFolder + layer.layerName + appendName + "." + default_asset_export_format;
                    css += "\t\tbackground-image: url(\"" + image_full_path + "\");\n";
                    css += "\t\tbackground-size: " + Math.round(nsImageSize.width) + "px " + Math.round(nsImageSize.height) + "px;\n";
                    css += "\t}\n";
                    css += "}\n";
                }
            }
		} 
        else if (layer.type == "Text") 
        {
			css += generateCSSForTextLayer(layer)
		}
   	return css;
	
	}

    /**
     * Generates CSS for the layer of type text. 
     *
     * @param {*} Text layer for which the css needs to be generated
     * @returns {String} css for the layer
     */
	function generateCSSForTextLayer(layer)
	{
        // For text without multitext span length should be 1 
        var spanLength = 0;
        if (layer.tspan != undefined) 
        {
			var spanArray = layer.tspan;
            if (spanArray.length != undefined) 
            {
				spanLength = spanArray.length;
			}
        }

		var css = ""
		css += ".sk-asset.sk-" + layer.layerName + " {\n";
		css += "\tfont-family: \"" + layer.style.fontFamily + "\" ;\n";
        css += "\tfont-stretch: \"" + layer.style.fontStretch + "\" ;\n";
        // Refer to this solution on sketch forum https://sketchplugins.com/d/193-how-to-get-font-weight/3 
		css += "\tfont-weight: " + utils_obj.appKitWeightToCSSWeight(layer.style.fontWeight, layer.style.fontVariant) + " ;\n";
		css += "\tfont-style: " + layer.style.fontStyle + " ;\n";

        if (layer.style.textTransform == "uppercase") 
        {
			css += "\ttext-transform: uppercase" + ";\n";
		}

        if (layer.style.kerning > 0) 
        {
			css += "\tletter-spacing: " + layer.style.kerning + ";\n";
        }

       
        if ((layer.style.verticalAlignment != undefined) && (spanLength == 1))
        {
            css += "\tdisplay: table;\n"
        }

		// If fills only first fill is applied
        if (layer.style.fills.length > 0) 
        {
			css += "\tcolor: " + layer.style.fills[0].color + " ;\n";
        } 
        else 
        {
			css += "\tcolor: " + layer.style.textColor + " ;\n";
		}
		css += "\tfont-size: " + Math.round(layer.style.fontSize) + ".0px ;\n";
		css += "\tline-height: " + Math.round(layer.style.lineHeight) + ".0px ;\n";
		css += "\topacity: " + layer.style.opacity + " ;\n";
		css += "\ttext-align: " + layer.style.alignment + " ;\n";
		css += "\tfont-kerning: " + layer.style.kerning + " ;\n";
		css += getShadowCss(layer.style)
		css += getBorderCss(layer.style)
		css += "}\n";
		css += "\n";


        for (var i = 0; i < spanLength; i++) 
        {
			var spanCss = ""
			spanCss += ".sk-asset.sk-" + layer.layerName + " .span" + (i + 1) + " {\n";

			var spanElement = spanArray[i];
            if (!(spanElement.fontFamilyName === undefined)) 
            {
				spanCss += "\tfont-family: \"" + spanElement.fontFamilyName + "\" ;\n";
			}

            if (!(spanElement.weight === undefined)) 
            {
				spanCss += "\tfont-weight: " + spanElement.weight + " ;\n";
            }

            if ((layer.style.verticalAlignment != undefined) && (spanLength == 1))
            {
                spanCss += "\tdisplay: table-cell;\n"
                if (layer.style.verticalAlignment == "top")
                    spanCss += "\tvertical-align: top;\n"
                else if (layer.style.verticalAlignment == "center")
                    spanCss += "\tvertical-align: middle;\n"
                else if (layer.style.verticalAlignment == "bottom")
                    spanCss += "\tvertical-align: bottom;\n"
            }

            if (!(spanElement.font_color === undefined)) 
            {
                if (layer.style.fills.length > 0) 
                {
					spanCss += "\tcolor: " + layer.style.fills[0].color + " ;\n";
                } 
                else 
                {
					spanCss += "\tcolor: #" + spanElement.font_color + " ;\n";
				}
			}

            if (!(spanElement.fontSize === undefined)) 
            {
				spanCss += "\tfont-size: " + Math.round(spanElement.fontSize) + ".0px ;\n";
			}

			spanCss += "}\n";
			spanCss += "\n";
			css += spanCss;

		}
        return css ;
        
    }
    
    /**
     * Generates page level css
     *
     * @returns {String} global css for the page
     */
    function generateBoilerPlateCSS() 
    {
        
        var css = ".sk-ab {\n" +
            "\tposition: relative;\n" +
            "\toverflow: hidden;\n" +
            "}\n";

        css += "\n";

        css += ".sk-asset {\n" +
            "\tposition: absolute;\n" +
            "\tbackground-repeat: no-repeat;\n" +
            "}\n";

        return css;
    }


    /**
     * Generates CSS for the artboard div
     *
     * @param {*} artboard
     * @returns {String} css for artboard div
     */
    function generateCSSForArtboard(artboard) 
    {

        var css = ".sk-ab.sk-" + utils_obj.cleanString(artboard.name) + " {\n";

        if (artboard.sketchObject.hasBackgroundColor) 
        {
            css += "\tbackground-color: " + artboard.background.color + ";\n";
        }

        css += "\twidth: " + Math.round(artboard.frame.width) + "px;\n";
        css += "\theight: " + Math.round(artboard.frame.height) + "px;\n";

        css += "}\n";

        return css;
    }

    /**
     * Run sequence of steps
     *  1. creates folder for exporting
     *  2. generates html and css
     *  3. save text to apt files
     *  4. export images for layers
     *
     * @param {*} folder where the results need to be exported
     */
    this.run = function(folder) 
    {
        exportFolder = folder;
        selectedArtboards.forEach(function(artboard) 
        {

            var exportPath = exportFolder + utils_obj.cleanString(artboard.name) + "/";

            // Delete any previously generated folders
            fileSystem_obj.deleteFile(exportPath);
            fileSystem_obj.createFolder(exportPath);

            var htmlPath = exportPath + htmlFileName;

            fileSystem_obj.saveTextToFile(htmlPath, generateHTML(artboard));
            var cssPath = exportPath + cssFileName ;
            fileSystem_obj.saveTextToFile(cssPath, generateCSS(artboard));
            
            if (!embedSvg) 
            {
                fileSystem_obj.createFolder(exportPath + imageFolder);
                exportImages(exportedLayers[artboard], exportPath);

            }

        });


    }
}


/**
 * This method uses exported function to perform sketch 2 html export, and is also exposed to other modules for use.
 *
 * @param {*} context sketch context
 * @returns
 */
function exportFullHTML(context) 
{

    sketch.UI.message("Genus Plugin processing your artboard 🙌");

    try 
    {

        var exporter = new Exporter(context);
        var selectedArtboards = exporter.getSelectedArtboards();
        if (selectedArtboards == undefined || selectedArtboards.length < 1) 
        {
            var errorMsg = "Please select the artboards you want to export to HTML." 
            var errorMsgTitle = "Genus Plugin Error: No Artboard Selected" 
            utils_obj.alertError(errorMsg, errorMsgTitle);
            return;
        }


        // Use the filesystem class to generate directory path
        var currentDirectoryPath = fileSystem_obj.getCurrentFilePath();
        var exportPath = currentDirectoryPath + "/";

        exporter.run(exportPath);

        var alertMessage = "Export finished ☺️, Export location: " + currentDirectoryPath;
        sketch.UI.message(alertMessage);
        utils_obj.alert(alertMessage, "genus");

    } 
    catch (e) 
    {
        if (e != nil) 
        { // Nil error means plugin was exited
            log(e);
            var msg = "Oops Something went wrong: You may want to an raise issue on github, Copy paste following message:\n "
            utils_obj.alertError( msg + e );
        }
    }
}


export default exportFullHTML;