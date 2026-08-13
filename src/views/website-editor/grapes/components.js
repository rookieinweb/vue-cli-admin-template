const baseStyle = `
  .site-section{box-sizing:border-box;padding:72px 64px;font-family:Inter,Arial,'Microsoft YaHei',sans-serif;color:#102033;background:#fff;}
  .site-container{max-width:1160px;margin:0 auto;}
  .site-eyebrow{margin:0 0 10px;color:#2563eb;font-size:13px;font-weight:700;letter-spacing:0;text-transform:uppercase;}
  .site-title{margin:0;color:#0f172a;font-size:40px;line-height:1.18;font-weight:800;}
  .site-subtitle{margin:14px 0 0;color:#64748b;font-size:16px;line-height:1.8;}
  .site-button{display:inline-flex;align-items:center;justify-content:center;height:42px;padding:0 18px;border-radius:8px;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;}
  .site-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:28px;}
  .site-card{padding:22px;border:1px solid #dbe3ef;border-radius:8px;background:#fff;box-shadow:0 12px 28px rgba(15,23,42,.06);}
  .site-card h3{margin:0 0 10px;color:#0f172a;font-size:18px;}
  .site-card p{margin:0;color:#64748b;line-height:1.7;}
  @media(max-width:720px){.site-section{padding:48px 22px}.site-title{font-size:30px}.site-grid{grid-template-columns:1fr}.site-header__nav{display:none}.site-banner__inner{grid-template-columns:1fr!important}.site-about__inner{grid-template-columns:1fr!important}.site-contact__inner{grid-template-columns:1fr!important}}
`;

function sectionComponent(type, html, extra = {}) {
  return {
    model: {
      defaults: {
        tagName: "section",
        attributes: { "data-module": type },
        classes: ["site-section", type],
        components: html,
        styles: baseStyle,
        droppable: true,
        editable: true,
        copyable: true,
        ...extra,
      },
    },
  };
}

export function registerComponents(editor) {
  editor.DomComponents.addType("website-header", sectionComponent("website-header", `
    <div class="site-container site-header__inner" style="display:flex;align-items:center;justify-content:space-between;gap:24px;">
      <strong class="js-title" style="font-size:22px;color:#0f172a;">企业品牌</strong>
      <nav class="site-header__nav" style="display:flex;gap:22px;color:#475569;font-weight:600;">
        <a>首页</a><a>产品</a><a>案例</a><a>新闻</a><a>联系</a>
      </nav>
      <a class="site-button js-button">立即咨询</a>
    </div>
  `));

  editor.DomComponents.addType("website-banner", sectionComponent("website-banner", `
    <div class="site-container site-banner__inner" style="display:grid;grid-template-columns:1.05fr .95fr;align-items:center;gap:42px;min-height:520px;">
      <div>
        <p class="site-eyebrow">Company Website</p>
        <h1 class="site-title js-title" style="font-size:54px;">科技改变未来</h1>
        <p class="site-subtitle js-subtitle">用专业产品与服务，为企业打造稳定、高效、可持续增长的数字化官网。</p>
        <a class="site-button js-button" style="margin-top:26px;">了解方案</a>
      </div>
      <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" style="width:100%;border-radius:8px;display:block;box-shadow:0 24px 60px rgba(15,23,42,.18);" />
    </div>
  `, { background: "#ffffff", height: "520px" }));

  editor.DomComponents.addType("website-about", sectionComponent("website-about", `
    <div class="site-container site-about__inner" style="display:grid;grid-template-columns:.9fr 1.1fr;gap:38px;align-items:center;">
      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80" style="width:100%;border-radius:8px;display:block;" />
      <div>
        <p class="site-eyebrow">About Us</p>
        <h2 class="site-title js-title">关于我们</h2>
        <p class="site-subtitle js-subtitle">我们专注于企业数字化建设，提供官网、业务系统和品牌增长的一体化解决方案。</p>
      </div>
    </div>
  `));

  editor.DomComponents.addType("website-products", sectionComponent("website-products", `
    <div class="site-container">
      <p class="site-eyebrow">Products</p>
      <h2 class="site-title js-title">产品列表</h2>
      <p class="site-subtitle js-subtitle">展示核心产品能力，帮助客户快速理解价值。</p>
      <div class="site-grid">
        <div class="site-card"><h3>产品一</h3><p>稳定可靠的基础能力。</p></div>
        <div class="site-card"><h3>产品二</h3><p>灵活适配多场景使用。</p></div>
        <div class="site-card"><h3>产品三</h3><p>持续升级，长期服务。</p></div>
      </div>
    </div>
  `));

  editor.DomComponents.addType("website-services", sectionComponent("website-services", `
    <div class="site-container">
      <p class="site-eyebrow">Services</p>
      <h2 class="site-title js-title">服务优势</h2>
      <p class="site-subtitle js-subtitle">从咨询、设计、开发到交付，提供完整服务链路。</p>
      <div class="site-grid">
        <div class="site-card"><h3>快速交付</h3><p>标准流程降低沟通成本。</p></div>
        <div class="site-card"><h3>专业设计</h3><p>兼顾品牌表达和转化效率。</p></div>
        <div class="site-card"><h3>持续维护</h3><p>上线后继续保障稳定运行。</p></div>
      </div>
    </div>
  `));

  editor.DomComponents.addType("website-cases", sectionComponent("website-cases", `
    <div class="site-container">
      <p class="site-eyebrow">Cases</p>
      <h2 class="site-title js-title">案例展示</h2>
      <p class="site-subtitle js-subtitle">沉淀行业经验，为客户提供可复制的成功路径。</p>
      <div class="site-grid">
        <div class="site-card"><h3>制造行业官网</h3><p>提升品牌可信度。</p></div>
        <div class="site-card"><h3>教育机构官网</h3><p>优化咨询转化。</p></div>
        <div class="site-card"><h3>SaaS 产品官网</h3><p>强化产品卖点。</p></div>
      </div>
    </div>
  `));

  editor.DomComponents.addType("website-news", sectionComponent("website-news", `
    <div class="site-container">
      <p class="site-eyebrow">News</p>
      <h2 class="site-title js-title">新闻列表</h2>
      <p class="site-subtitle js-subtitle">发布企业动态、行业观点和产品更新。</p>
      <div class="site-grid">
        <div class="site-card"><h3>企业动态</h3><p>最新品牌与业务进展。</p></div>
        <div class="site-card"><h3>行业观点</h3><p>分享市场趋势洞察。</p></div>
        <div class="site-card"><h3>产品更新</h3><p>记录能力升级节奏。</p></div>
      </div>
    </div>
  `));

  editor.DomComponents.addType("website-testimonials", sectionComponent("website-testimonials", `
    <div class="site-container">
      <p class="site-eyebrow">Testimonials</p>
      <h2 class="site-title js-title">客户评价</h2>
      <p class="site-subtitle js-subtitle">真实反馈建立信任，让潜在客户更快做出决策。</p>
      <div class="site-grid">
        <div class="site-card"><h3>张总</h3><p>页面专业，转化效果明显提升。</p></div>
        <div class="site-card"><h3>李经理</h3><p>交付速度快，沟通响应及时。</p></div>
        <div class="site-card"><h3>王老师</h3><p>后台配置灵活，维护很方便。</p></div>
      </div>
    </div>
  `));

  editor.DomComponents.addType("website-contact", sectionComponent("website-contact", `
    <div class="site-container site-contact__inner" style="display:grid;grid-template-columns:1fr 1fr;gap:28px;">
      <div>
        <p class="site-eyebrow">Contact</p>
        <h2 class="site-title js-title">联系我们</h2>
        <p class="site-subtitle js-subtitle">留下需求，我们会尽快安排顾问与您沟通。</p>
      </div>
      <div class="site-card"><h3>联系方式</h3><p>电话：400-000-0000<br/>邮箱：hello@example.com<br/>地址：上海市企业服务中心</p></div>
    </div>
  `));

  editor.DomComponents.addType("website-footer", sectionComponent("website-footer", `
    <div class="site-container" style="display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;">
      <div>
        <strong class="js-title" style="font-size:20px;color:#fff;">企业品牌</strong>
        <p class="js-subtitle" style="margin:10px 0 0;color:#cbd5e1;">专注企业数字化官网建设</p>
      </div>
      <p style="margin:0;color:#cbd5e1;">© 2026 Company. All rights reserved.</p>
    </div>
  `, { styles: `${baseStyle}.website-footer{background:#0f172a;color:#fff;}` }));
}
