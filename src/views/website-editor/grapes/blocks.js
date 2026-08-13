export function registerBlocks(editor) {
  const blocks = [
    ["website-header", "Header导航", "官网模块"],
    ["website-banner", "Banner", "官网模块"],
    ["website-about", "关于我们", "官网模块"],
    ["website-products", "产品列表", "官网模块"],
    ["website-services", "服务优势", "官网模块"],
    ["website-cases", "案例展示", "官网模块"],
    ["website-news", "新闻列表", "官网模块"],
    ["website-testimonials", "客户评价", "官网模块"],
    ["website-contact", "联系我们", "官网模块"],
    ["website-footer", "Footer", "官网模块"],
  ];

  blocks.forEach(([type, label, category]) => {
    editor.BlockManager.add(type, {
      label,
      category,
      content: { type },
    });
  });

  editor.BlockManager.add("text", {
    label: "文字",
    category: "基础",
    content: "<p>双击编辑文字内容</p>",
  });

  editor.BlockManager.add("image", {
    label: "图片",
    category: "基础",
    content: { type: "image" },
  });

  editor.BlockManager.add("button", {
    label: "按钮",
    category: "基础",
    content: "<a class='site-button'>了解更多</a>",
  });
}
