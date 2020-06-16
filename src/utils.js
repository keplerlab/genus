import sketch from "sketch";
/**
 *Various common utility functions are implemented here
 *
 * @class utils
 */

class utils 
{
    constructor(context) 
    {
        this.context = context;
    }

    /**
     * Method to return css weight given numerical weight number returned by sketch api
     * Refer to this link https://sketchplugins.com/d/193-how-to-get-font-weight/3 
     * @param {*} weight returned by sketch api
     * @returns weight in integer
     */
    appKitWeightToCSSWeight(weight, fontName) 
    {
        //console.log("weightIndex", weight)
        //console.log("fontName", fontName)

        /**   For font name to font weight mapping check links 
         *  https://docs.microsoft.com/en-us/typography/opentype/spec/os2#usweightclass
         *  https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
         */
        if(fontName != undefined)
        {
            fontName = fontName.toLowerCase();
            if(fontName.includes("thin") || fontName.includes("hairline"))
                return 100
            else if(fontName.includes("extra light") || fontName.includes("ultra light"))
                return 200
            else if(fontName.includes("light"))
                return 300
            else if(fontName.includes("regular") || fontName.includes("normal"))
                return 400
            else if(fontName.includes("medium"))
                return 500
            else if(fontName.includes("semi bold") || fontName.includes("demi bold"))
                return 600
            else if(fontName.includes("bold") )
                return 700
            else if(fontName.includes("extra bold") || fontName.includes("ultra bold"))
                return 800
            else if(fontName.includes("black") || fontName.includes("heavy"))
                return 900
            else if(fontName.includes("extra black") || fontName.includes("ultra black"))
                return 950
        }
        //console.log("weight calculated by this index")
        return [100, 100, 100, 200, 300, 400, 500, 500, 600, 700, 800, 900, 900, 900, 900, 900][weight]
    }

    /**
     * Method to run arbitrary command line
     *
     * @param {*} cmd command that needs to be run 
     * @param {*} path for command 
     * @returns None
     */
    runCommand(cmd, path) 
    {
        /* NSTask.alloc().init(), task.setLaunchPath, task.setArguments and task.launch()
        * are not part of official sketch javascript api 
        */
        var task = NSTask.alloc().init()
        task.setLaunchPath("/bin/bash");
        task.setArguments(cmd);
        task.launch();
    }

    /**
     * Method to display alert error with sound 
     *
     * @param {*} msg for error
     * @param {*} title for error message
     * @returns None
     */
    alertError(msg, title) 
    {
        title = title || "Genus Plugin Error:";
        this.alert(msg, title);
        this.runCommand(['-c', 'afplay /System/Library/Sounds/Basso.aiff']);
    }

    /**
     * Method to display alert 
     *
     * @param {*} msg for error
     * @param {*} title for error message
     * @returns None
     */
    alert(msg, title) 
    {
        /* NSApplication.sharedApplication and app.displayDialog_withTitle functions
        * are not part of official sketch javascript api 
        */
        title = title || "Genus";
        var app = NSApplication.sharedApplication()
        app.displayDialog_withTitle(msg, title);
    }

    /**
     * Convert color to hex string representation of color 
     *
     * @param {*} color value
     * @returns string hex value of color 
     */
    hexColor(color) 
    {
        console.log("color",color)
        var r = color.red() * 255;
        var g = color.green() * 255;
        var b = color.blue() * 255;
        return ("#" + r.toString(16) + g.toString(16) + b.toString(16)).toUpperCase();
    }

    /**
     * Utility function for generating append string for scaled images
     *
     * @param {*} scale value
     * @returns string 
     */
    nameForScale(scale) 
    {
        return (scale > 1) ? "@" + scale + "x" : "";
    }

    /**
     * Generate string name for layer name with layer name and id so that name 
     * is unique 
     *
     * @param {*} sketch layer
     * @returns string 
     */
    generateLayerName(layer) 
    {
        const layerExportName = this.cleanString(layer.name) + "-" + layer.id
        return layerExportName;
    }

    /**
     * Utility function for removing/replace unwanted chars from string
     *
     * @param {*} input string
     * @returns output cleaned string 
     */
    cleanString(str) 
    {
        str = str.replace(/\//g, "-");
        str = str.replace(/[^\w\s]/gi, '');
        return str.replace(/\W+/g, "-");
    }

    /**
     * Checks if there is mask layer in the group
     *
     * @param {*} group sketch group
     * @returns {Boolean} true if mask present and false otherwise
     */
    isMaskLayerInGroup(group) 
    {
        if(group.isMaskLayerInGroup != undefined)
        {
            return group.isMaskLayerInGroup
        }
        else
        {
            var maskPresent = false;
            var layers = group.layers;
            var maskLayers = [];
            for (var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                if (layer.sketchObject.isMasked())
                    maskPresent = true
    
            }
            group.isMaskLayerInGroup = maskPresent ;
            return  group.isMaskLayerInGroup ;

        }
    }

}

export default utils;