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
    styleManager: {
      appendTo: options.styleContainer,
      sectors: [
        {
          name: "尺寸",
          open: true,
          properties: ["width", "min-height", "padding", "margin"],
        },
        {
          name: "文字",
          open: false,
          properties: ["font-size", "font-weight", "color", "line-height", "text-align"],
        },
        {
          name: "装饰",
          open: false,
          properties: ["background-color", "border-radius", "box-shadow"],
        },
      ],
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

  return editor;
}
