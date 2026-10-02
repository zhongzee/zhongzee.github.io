let language = 'en';
let filter = 'all';
let publications = [];
const bios = {
  en: [
    'I am a PhD researcher at <strong>Central South University</strong>, advised by Prof. <strong>Jun Long</strong> and academically mentored by Prof. <a href="https://xiusu.github.io/" target="_blank" rel="noopener">Xiu Su</a>. My research focuses on <strong>knowledge enhancement for multimodal foundation models and the safe, controllable operation of AI agents</strong>.',
    'My work connects knowledge injection and open-world semantic alignment with controllable knowledge editing and agent action safety. In AI for Science, I explore how large models and search mechanisms can help design scientific models for medical diagnosis and extreme-climate forecasting.',
    'Building on these foundations, I am pursuing <strong>self-evolving multi-agent systems for open-ended scientific discovery</strong>, with interests in world models and embodied intelligence. I aim to develop systems that continually acquire knowledge, improve through interaction and collaboration, and make reliable decisions in medicine, embodied environments, and science.'
  ],
  zh: [
    '我是<strong>中南大学计算机学院博士研究生吴忠泽</strong>，师从<strong>龙军教授</strong>，学术指导导师为<a href="https://xiusu.github.io/" target="_blank" rel="noopener">苏修教授</a>。研究聚焦<strong>多模态大模型知识增强与智能体安全可控</strong>，面向医学健康、具身交互与自主科学发现，探索具备持续学习、协同进化与安全决策能力的新一代智能系统。',
    '围绕知识注入、开放世界多模态语义对齐和医学视觉问答形成系列成果，入选 <strong>AAAI 2026 Oral、ACM MM 2025 Oral</strong>，并发表于 ICML；视觉语言大模型知识可控编辑与智能体行动安全成果分别发表于 <strong>CVPR 2026</strong>、录用于 <strong>NeurIPS 2026</strong>。大模型驱动的医学模型自动设计与物理知识约束的极端气候预测成果发表于 <strong>npj Digital Medicine</strong> 和 <strong>npj Climate and Atmospheric Science</strong>。',
    '在上述研究基础上，我进一步关注<strong>面向开放式科学发现的自主进化多智能体系统</strong>，探索世界模型、知识可控更新与多智能体协作反馈的结合，使智能系统能够从科学证据和环境交互中持续提升能力，将多模态认知、安全行动与科学模型自主设计连接起来。'
  ]
};
function element(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined) e.textContent = text;
  return e;
}
function paperLink(url, label) {
  const a = element('a', '', label); a.href = url; a.target = '_blank'; a.rel = 'noopener'; return a;
}
function renderPapers() {
  const container = document.querySelector('#papers'); container.replaceChildren();
  const rows = publications.filter(p => filter === 'all' || p.topic === filter);
  document.querySelector('#paper-count').textContent = language === 'zh' ? `${rows.length} 篇论文` : `${rows.length} papers`;
  for (const p of rows) {
    const article = element('article', 'paper'); article.dataset.paperId = p.id;
    const venue = element('div', 'paper-venue', p.venue);
    venue.append(element('span', 'year', p.year)); article.append(venue);
    const body = element('div', 'paper-content');
    const h = element('h3', '', p.url ? undefined : p.title);
    if (p.url) h.append(paperLink(p.url, p.title)); body.append(h);
    const authors = element('p', 'authors');
    const parts = p.authors.split('Zhongze Wu');
    authors.append(document.createTextNode(parts[0]), element('strong', '', 'Zhongze Wu'), document.createTextNode(parts[1] || ''));
    body.append(authors);
    const meta = element('div', 'paper-meta');
    if (p.oral) meta.append(element('span', 'badge oral', 'Oral'));
    meta.append(element('span', 'status', language === 'zh' ? p.roleZh : p.roleEn));
    if (p.accepted) meta.append(element('span', 'badge', language === 'zh' ? '已录用' : 'Accepted'));
    body.append(meta, element('p', 'paper-summary', language === 'zh' ? p.summaryZh : p.summaryEn));
    if (p.url) {
      const links = element('div', 'paper-links');
      if (p.url) links.append(paperLink(p.url, language === 'zh' ? '论文' : 'Paper'));
      body.append(links);
    }
    article.append(body); container.append(article);
  }
}
document.querySelector('#language').addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-en]').forEach(e => e.textContent = e.dataset[language]);
  document.querySelectorAll('[data-i18n]').forEach((e, i) => e.innerHTML = bios[language][i]);
  const toggle = document.querySelector('#language'); toggle.textContent = language === 'zh' ? 'EN' : '中文';
  toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文'); renderPapers();
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); }); renderPapers();
}));
fetch('papers.json').then(r => { if (!r.ok) throw new Error('Publication data unavailable'); return r.json(); }).then(data => { publications = data; renderPapers(); }).catch(() => {
  document.querySelector('#papers').textContent = language === 'zh' ? '论文列表暂时加载失败，请刷新页面。' : 'The publication list could not load. Please refresh the page.';
});
