#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const insights = require("../content/insights");

const root = path.resolve(__dirname, "..");
const siteUrl = "https://www.i-spy.uk";
const checkOnly = process.argv.includes("--check");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function imageById(article, id) {
  return article.images.find((image) => image.id === id);
}

function plainText(value = "") {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function calculatedReadingTime(article) {
  const words = article.body.flatMap((block) => {
    if (block.type === "p" || block.type === "blockquote") return plainText(block.html).split(" ");
    if (block.type === "h2") return block.text.split(" ");
    if (block.type === "ul") return block.items.flatMap((item) => item.split(" "));
    return [];
  }).filter(Boolean).length;
  return `${Math.max(3, Math.ceil(words / 200))} min read`;
}

function titleClass(title, baseClass = "") {
  return [baseClass, title.length >= 32 ? `${baseClass || "title"}--long` : ""].filter(Boolean).join(" ");
}

function imageMarkup(image, options = {}) {
  if (!image) return "";
  const loading = options.loading || "lazy";
  const priority = options.fetchPriority ? ` fetchpriority="${options.fetchPriority}"` : "";
  const sizes = options.sizes ? ` sizes="${escapeHtml(options.sizes)}"` : "";
  const describedBy = options.describedBy ? ` aria-describedby="${escapeHtml(options.describedBy)}"` : "";
  const decoding = options.decoding || "async";
  return `<img${options.className ? ` class="${options.className}"` : ""} src="${escapeHtml(image.src)}" width="${image.width}" height="${image.height}" alt="${escapeHtml(image.alt)}" loading="${loading}"${priority}${sizes}${describedBy} decoding="${decoding}">`;
}

function header(activeInsights = true) {
  return `<header><div class="container"><div class="header-content">
<a href="/#hero" class="site-wordmark"><img src="/assets/ispy-logo-header-navy.svg" alt="i-SPY home" width="618" height="179"></a><nav aria-label="Main navigation"><ul>
<li><a href="/products.html">How We Help</a></li>
<li><a href="/about.html">About</a></li>
<li><a href="/testimonials.html">Testimonials</a></li>
<li><a href="/insights/"${activeInsights ? ' aria-current="page"' : ""}>Insights</a></li>
<li><a href="/diagnostic.html">Brand Check</a></li>
<li><a href="/faqs.html">FAQs</a></li>
<li><a href="#contact">Contact</a></li>
</ul></nav><button class="hamburger" id="hamburger" aria-label="Open navigation" aria-expanded="false" aria-controls="mobileMenu"><span class="line line-1"></span><span class="line line-2"></span><span class="line line-3"></span></button>
</div></div></header><nav class="mobile-menu" id="mobileMenu" aria-label="Mobile navigation"><a href="/products.html">How We Help</a><a href="/about.html">About</a><a href="/testimonials.html">Testimonials</a><a href="/insights/"${activeInsights ? ' aria-current="page"' : ""}>Insights</a><a href="/diagnostic.html">Brand Check</a><a href="/faqs.html">FAQs</a><a href="#contact">Contact</a></nav>`;
}

function footer() {
  return `<footer id="contact"><div class="container"><div class="footer-content">
<div class="footer-tagline-wrapper"><h2 class="footer-tagline">Fancy a chat?</h2></div>
<a class="download-btn footer-cta" href="mailto:michael@i-spy.uk?subject=Arrange%20a%20call">Arrange a call</a>
<address class="footer-contact-primary"><a href="tel:+447590410269">+44 (0) 7590 410 269</a><a href="mailto:michael@i-spy.uk">michael@i-spy.uk</a><a href="https://wa.me/447590410269" target="_blank" rel="noopener noreferrer" aria-label="Contact Michael through WhatsApp (opens in a new tab)">WhatsApp</a></address>
<div class="footer-brand"><a class="site-wordmark site-wordmark--footer" href="/#hero"><img src="/assets/ispy-logo-footer-white.svg" alt="i-Spy home" width="618" height="179"></a></div>
<div class="footer-meta"><p class="footer-copyright">© i-Spy 2026</p><nav class="footer-legal-nav" aria-label="Policies"><a href="/privacy-notice.html">Privacy notice</a><a href="/sustainability.html">Sustainability</a><a href="/ai-use-policy.html">AI use policy</a></nav></div>
<p class="footer-company-disclosure">i-Spy is a trading name of I Spy With My Little Eye Ltd, registered in England and Wales. Company number 16767948.</p>
</div></div></footer><script src="/shared-chrome.js?v=20260722"></script><script src="/script.js?v=20260722"></script><script src="/insights.js?v=20260722"></script>`;
}

function documentShell({ title, description, canonical, type = "website", jsonLd = "", body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${escapeHtml(description)}">
<title>${escapeHtml(title)}</title>
<link rel="canonical" href="${escapeHtml(canonical)}">
<meta property="og:type" content="${type}">
<meta property="og:url" content="${escapeHtml(canonical)}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0A1929">
<link rel="icon" type="image/svg+xml" href="/assets/ispy-orb-live-master.svg?v=7">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=7">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=7">
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/shared-chrome.css">
<link rel="stylesheet" href="/concept-one-final.css">
<link rel="stylesheet" href="/concept-one-completion.css">
<link rel="stylesheet" href="/insights.css?v=20260722b">
${jsonLd}
</head>
<body class="insights-page">
${body}
</body>
</html>
`;
}

function listingCard(article, index) {
  const image = article.listingImage ? imageById(article, article.listingImage) : null;
  return `<article class="insight-card${image ? " insight-card--image" : " insight-card--type"}">
${image ? `<a class="insight-card-image${image.listingFit === "contain" ? " insight-card-image--contain" : ""}" href="/insights/${article.slug}/" tabindex="-1" aria-hidden="true">${imageMarkup(image, { loading: index === 0 ? "eager" : "lazy", fetchPriority: index === 0 ? "high" : "auto", decoding: index === 0 ? "sync" : "async", sizes: index === 0 ? "(max-width: 62rem) 100vw, 57vw" : "(max-width: 48rem) 100vw, 50vw" })}<span class="image-load-fallback">Image unavailable</span></a>` : ""}
<div class="insight-card-content"><p class="insight-meta"><span>${escapeHtml(article.category)}</span><span>${escapeHtml(article.readingTime)}</span></p>
<h2 class="${titleClass(article.title, "card-title")}"><a href="/insights/${article.slug}/">${escapeHtml(article.title)}</a></h2>
<p class="insight-summary">${escapeHtml(article.standfirst)}</p>
<a class="insight-link" href="/insights/${article.slug}/" aria-label="Read ${escapeHtml(article.title)}">Read insight</a></div>
</article>`;
}

function listingPage() {
  const ordered = [...insights].sort((a, b) => a.listingOrder - b.listingOrder);
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "i-Spy Insights",
    itemListElement: ordered.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/insights/${article.slug}/`,
      name: article.title
    }))
  };
  return documentShell({
    title: "Insights | i-Spy",
    description: "Observations on brand, business and the world around us.",
    canonical: `${siteUrl}/insights/`,
    jsonLd: `<script type="application/ld+json">${JSON.stringify(itemList)}</script>`,
    body: `${header()}<main><section class="insights-hero"><div class="container"><div class="editorial-width"><h1>Insights</h1><p>Observations on brand, business and the world around us.</p></div></div></section>
<section class="insights-listing" aria-label="All Insights"><div class="container"><div class="insight-grid">${ordered.map(listingCard).join("\n")}</div></div></section></main>${footer()}`
  });
}

function renderBodyBlock(article, block) {
  if (block.type === "p") return `<p>${block.html}</p>`;
  if (block.type === "h2") return `<h2>${escapeHtml(block.text)}</h2>`;
  if (block.type === "ul") return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  if (block.type === "blockquote") return `<blockquote><p>${block.html}</p></blockquote>`;
  if (block.type === "comparison") {
    const images = block.images.map((id) => imageById(article, id)).filter(Boolean);
    const captionId = `caption-${article.slug}-comparison`;
    return `<figure class="article-comparison"><div class="article-comparison-grid">${images.map((image) => imageMarkup(image, { describedBy: captionId, sizes: "(max-width: 48rem) calc(100vw - 3rem), 35rem" })).join("")}</div><figcaption class="article-caption" id="${captionId}">${escapeHtml(block.caption)}</figcaption></figure>`;
  }
  if (block.type === "inset") {
    const image = imageById(article, block.image);
    if (!image) return "";
    return figureMarkup(article, image, "article-inset");
  }
  if (block.type === "image") {
    const image = imageById(article, block.image);
    if (!image) return "";
    return figureMarkup(article, image, "article-feature");
  }
  // A missing supplied image is deliberately omitted rather than replaced.
  if (block.type === "missing-image") return "";
  throw new Error(`Unknown block type: ${block.type}`);
}

function figureMarkup(article, image, className) {
  const captionId = image.caption ? `caption-${article.slug}-${image.id}` : "";
  const imageHtml = imageMarkup(image, {
    describedBy: captionId,
    sizes: className === "article-inset" ? "(max-width: 48rem) calc(100vw - 3rem), 39rem" : "(max-width: 48rem) calc(100vw - 3rem), 45rem"
  });
  const media = image.enlargeable
    ? `<a class="image-enlarge" href="${escapeHtml(image.src)}" target="_blank" rel="noopener" data-image-enlarge aria-label="${escapeHtml(image.enlargeLabel || `Enlarge ${image.alt}`)}">${imageHtml}<span class="image-enlarge-label" aria-hidden="true">View larger</span></a>`
    : imageHtml;
  return `<figure class="${className}">${media}${image.caption ? `<figcaption class="article-caption" id="${captionId}">${escapeHtml(image.caption)}</figcaption>` : ""}</figure>`;
}

function relatedCard(article) {
  const image = article.listingImage ? imageById(article, article.listingImage) : null;
  return `<article class="related-card${image ? " related-card--image" : " related-card--type"}">${image ? `<a class="related-card-image${image.listingFit === "contain" ? " related-card-image--contain" : ""}" href="/insights/${article.slug}/" tabindex="-1" aria-hidden="true">${imageMarkup(image, { sizes: "(max-width: 48rem) 100vw, 30rem" })}<span class="image-load-fallback">Image unavailable</span></a>` : ""}<div class="related-card-content"><p class="insight-meta"><span>${escapeHtml(article.category)}</span><span>${escapeHtml(article.readingTime)}</span></p><h3 class="${titleClass(article.title, "related-title")}"><a href="/insights/${article.slug}/">${escapeHtml(article.title)}</a></h3><p>${escapeHtml(article.standfirst)}</p><a class="insight-link" href="/insights/${article.slug}/" aria-label="Read ${escapeHtml(article.title)}">Read insight</a></div></article>`;
}

function relatedArticles(article) {
  const explicit = (article.related || [])
    .map((slug) => insights.find((item) => item.slug === slug))
    .filter(Boolean);
  const explicitSlugs = new Set(explicit.map((item) => item.slug));
  const inferred = insights
    .filter((item) => item.slug !== article.slug && !explicitSlugs.has(item.slug))
    .map((item) => ({
      item,
      score: (item.category === article.category ? 10 : 0) + item.tags.filter((tag) => article.tags.includes(tag)).length
    }))
    .sort((a, b) => b.score - a.score || a.item.listingOrder - b.item.listingOrder)
    .map(({ item }) => item);
  return [...explicit, ...inferred].slice(0, 2);
}

function articlePage(article) {
  const related = relatedArticles(article);
  const leadImage = article.listingImage ? imageById(article, article.listingImage) : article.images[0];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publicationDate,
    dateModified: article.modifiedDate,
    mainEntityOfPage: `${siteUrl}/insights/${article.slug}/`,
    publisher: { "@type": "Organization", name: "i-Spy", url: siteUrl },
    keywords: article.tags.join(", ")
  };
  if (leadImage) schema.image = `${siteUrl}${leadImage.src}`;

  const didYouKnow = `<aside class="did-you-know" aria-labelledby="did-you-know-title"><p class="section-label">A little extra</p><h2 id="did-you-know-title">Did you know?</h2><ol>${article.didYouKnow.map((fact) => `<li>${typeof fact === "string" ? escapeHtml(fact) : fact.html}</li>`).join("")}</ol></aside>`;
  const lightbox = article.images.some((image) => image.enlargeable) ? `<dialog class="image-lightbox" id="imageLightbox" aria-labelledby="imageLightboxTitle"><div class="image-lightbox-panel"><div class="image-lightbox-header"><h2 id="imageLightboxTitle">Enlarged image</h2><button class="image-lightbox-close" type="button" data-lightbox-close>Close</button></div><img src="" alt=""><p class="image-lightbox-caption"></p></div></dialog>` : "";
  const relatedSection = `<section class="related-insights" aria-labelledby="related-title"><div class="container"><div class="related-heading"><p class="section-label">Continue reading</p><h2 id="related-title">Related Insights</h2></div><div class="related-grid">${related.map(relatedCard).join("")}</div><p class="all-insights-link"><a class="insight-link" href="/insights/">View all Insights</a></p></div></section>`;

  return documentShell({
    title: article.metaTitle,
    description: article.metaDescription,
    canonical: `${siteUrl}/insights/${article.slug}/`,
    type: "article",
    jsonLd: `<script type="application/ld+json">${JSON.stringify(schema)}</script>`,
    body: `${header()}<main><article class="article"><header class="article-hero"><div class="container"><div class="article-heading"><a class="article-breadcrumb" href="/insights/">Insights</a><p class="insight-meta"><span>${escapeHtml(article.category)}</span><span>${escapeHtml(article.readingTime)}</span></p><h1 class="${titleClass(article.title, "article-title")}">${escapeHtml(article.title)}</h1><p class="article-intro">${escapeHtml(article.standfirst)}</p></div></div></header><div class="container"><div class="article-body">${article.body.map((block) => renderBodyBlock(article, block)).join("\n")}${didYouKnow}<p class="article-back"><a class="insight-link" href="/insights/">Back to all Insights</a></p></div></div></article>${relatedSection}</main>${lightbox}${footer()}`
  });
}

function sitemap() {
  const pages = ["/", "/products.html", "/about.html", "/testimonials.html", "/insights/", "/diagnostic.html", "/faqs.html", "/brand-faqs.html", "/book.html", "/privacy-notice.html", "/sustainability.html", "/ai-use-policy.html"];
  const pageEntries = pages.map((route) => `  <url><loc>${siteUrl}${route}</loc><lastmod>2026-07-22</lastmod></url>`);
  const insightEntries = insights.map((article) => `  <url><loc>${siteUrl}/insights/${article.slug}/</loc><lastmod>${article.modifiedDate}</lastmod></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageEntries, ...insightEntries].join("\n")}\n</urlset>\n`;
}

function outputs() {
  const files = new Map();
  const index = listingPage();
  files.set(path.join(root, "insights", "index.html"), index);
  // Keep the legacy URL working while declaring /insights/ as canonical.
  files.set(path.join(root, "insights.html"), index);
  insights.forEach((article) => files.set(path.join(root, "insights", article.slug, "index.html"), articlePage(article)));
  files.set(path.join(root, "sitemap.xml"), sitemap());
  return files;
}

function validateCollection() {
  const required = ["title", "standfirst", "slug", "category", "tags", "readingTime", "metaTitle", "metaDescription", "publicationDate", "modifiedDate", "body", "didYouKnow"];
  const slugs = new Set();
  insights.forEach((article) => {
    required.forEach((field) => {
      if (!article[field] || (Array.isArray(article[field]) && !article[field].length)) throw new Error(`${article.slug || "Insight"} is missing ${field}`);
    });
    if (slugs.has(article.slug)) throw new Error(`Duplicate Insight slug: ${article.slug}`);
    if (article.readingTime !== calculatedReadingTime(article)) throw new Error(`${article.slug} reading time should be ${calculatedReadingTime(article)}`);
    if (article.didYouKnow.length < 1 || article.didYouKnow.length > 3) throw new Error(`${article.slug} must contain one to three Did You Know facts`);
    slugs.add(article.slug);
  });
  insights.forEach((article) => (article.related || []).forEach((slug) => {
    if (!slugs.has(slug)) throw new Error(`${article.slug} links to unknown related Insight: ${slug}`);
  }));
}

validateCollection();
const generated = outputs();
if (checkOnly) {
  let stale = false;
  generated.forEach((content, file) => {
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content) {
      console.error(`Generated file is stale: ${path.relative(root, file)}`);
      stale = true;
    }
  });
  if (stale) process.exit(1);
  console.log(`Checked ${generated.size} generated files.`);
} else {
  generated.forEach((content, file) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    console.log(`Generated ${path.relative(root, file)}`);
  });
}
