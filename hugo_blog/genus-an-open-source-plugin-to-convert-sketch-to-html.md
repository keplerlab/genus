---
title: Genus - An open source Sketch plugin to export HTML
date: 2020-06-08T06:21:12.000+00:00
author:
image_webp: uploads/2020/06/genus-hero-banner_webp.png
image: uploads/2020/06/genus-hero-banner.png
description: This post talks about how to use Genus, a Sketch plugin which exports artboards into HTML.
draft: false
---
# Genus - An open source plugin to convert Sketch to HTML
Many a times, there is a need to quickly prototype web pages. It is easy for designers to flesh them out in vector based UX toolkits like [Sketch](https://www.sketch.com/), [Adobe XD](https://www.adobe.com/in/products/xd.html), [Figma](https://www.figma.com/) and the likes. And it really helps if we can directly export a design from a design tool into HTML, to accelerate the process.

Genus, is an open source plugin made for Sketch which enables one to quickly export an HTML version of your design.

## Why make a Sketch plugin
In spite of many competing platforms like - [Adobe XD](https://www.adobe.com/in/products/xd.html), [Figma](https://www.figma.com/), [Invision Studio](https://www.invisionapp.com/studio), [Framer X](https://www.framer.com/) - to name a few, and Sketch being Mac OS only, it still has one of the largest and oldest userbase, with a lot of companies and its designers already invested in it. It makes a good platform to target in the beginning. Also the developer ecosystem for Sketch is quite mature.

## Why use Genus
There are other plugins available offering similar functionality  which are paid and/or non-open source. Why still use Genus might be a question one could have. Genus, being open source gives an opportunity to customize the HTML and CSS output which could be useful to pair it with existing design system libraries, low code generators, etc which might be used in your projects. Also, it being no longer a black box, one can know its inner workings. Last but not the least, its free!

## How to install Genus
1. Make sure you have Sketch installed in your Mac OS machine.
1. Click on [Genus Github zip download](https://github.com/keplerlab/genus/archive/master.zip) to get the compressed repo.
1. Unzip the downloaded file.
1. Double click on Genus.sketchplugin to install the plugin.

## How to use Genus
1. Open your design made in Sketch (Alternatively, we have provided a test Sketch file in the zip file under testing>sketch>genus-test-cases.sketch).

    ![Open Sketch design]({{< baseurl >}}uploads/2020/06/01-open-design-in-sketch.png)

1. Select the artboard(s) you want to export as HTML.

    ![Select artboard]({{< baseurl >}}uploads/2020/06/02-select-artboard-to-export.png)

1. Go to the menu bar, Plugins>Genus>Export.

    ![Go to Genus export]({{< baseurl >}}uploads/2020/06/03-go-to-genus-export.png)

1. After processing, the HTML and associated assets are exported to the same location as the Sketch file. The path is also mentioned in the dialog box.

    ![Exported HTML at Sketch location]({{< baseurl >}}uploads/2020/06/04-html-exported-in-sketch-location.png)

1. Once exported, you can go the exported location and you will find folder(s) named after the name of your artboards(s) selected for export.

    ![Go to export location]({{< baseurl >}}uploads/2020/06/06-go-to-exported-location.png)

1. Open a folder and open index.html to see the result in your browser.

    ![Open html in browser]({{< baseurl >}}uploads/2020/06/06-open-index_html-to-see-result.png)


## Tips for creating Sketch designs which can be helpful to create logical HTML output
1. Naming each layer logically can greatly help in inspecting the generated HTML and trace back problems.
1. Grouping logical entities can help you create nested divs.
1. If the intent is to export groups as png, make a group exportable.

## Troubleshooting exported HTML
1. If there are any missing fonts notification which comes up on the top right of the Sketch application, please install them.
1. In case fonts are not rendered properly in the browser, you might want to import the fonts in CSS. This can be done by: 
    1. Adding Google fonts as per required like the following statement `@import url('https://fonts.googleapis.com/css?family=Roboto:500,900|PT+Serif:400|Open+Sans:400');` (this is for the fonts used in genus-test-cases.sketch sample file).
    1. Copying font files to a font folder and importing them can also make it work.
1. In some rare cases font weight rendered by html and sketch could be different. In those cases you might want to check correct font weight from sketch file and plugin into css. 