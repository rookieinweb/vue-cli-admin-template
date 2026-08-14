import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { registerBlocks } from "./blocks";
import { registerComponents } from "./components";

export function initWebsiteEditor(options) {
  const editor = grapesjs.init({
    container: options.container,
    height: "100%",
    width: "auto",
    storageManager: false,
    blockManager: {
      appendTo: options.blocksContainer,
    },
    parser: {
      optionsHtml: {
        allowUnsafeAttr: true,
      },
    },
    styleManager: {
      appendTo: options.styleContainer,

  componentFirst:true,
      sectors:[
        {
        name:"布局",
        open:false,
        properties:[
          "width",
          "min-height",
          "padding",
          "margin",
          "display",
          "justify-content",
          "align-items"
        ]
        },

        {
        name:"文字",
        open:false,
        properties:[
          "font-size",
          "font-weight",
          "color",
          "line-height",
          "text-align"
        ]
        },

        {
        name:"背景",
        open:false,
        properties:[
          "background-color",
          "background-image",
          "background-size"
        ]
        },

        {
        name:"边框",
        open:false,
        properties:[
          "border-radius",
          "border",
          "box-shadow"
        ]
        }
      ]
    },
    selectorManager: { appendTo: null },
    traitManager: { appendTo: null },
    panels: { defaults: [] },
    deviceManager: {
      devices: [
        { name: "Desktop", width: "" },
        { name: "Mobile", width: "390px", widthMedia: "480px" },
      ],
    },
    canvas: {
      styles: [
        "https://unpkg.com/normalize.css@8.0.1/normalize.css",
      ],
    },
  });

  registerComponents(editor);
  registerBlocks(editor);
  editor.on('load',()=>{
    console.log('style===================================',editor.BlockManager.getBlocksByCategory())
  })
  return editor;
}
