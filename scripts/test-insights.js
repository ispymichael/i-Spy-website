#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const insights = require("../content/insights");

const root = path.resolve(__dirname, "..");
let failures = 0;

function check(condition, message) {
  if (condition) return;
  failures += 1;
  console.error(`FAIL: ${message}`);
}

function read(relative) {
  const file = path.join(root, relative);
  check(fs.existsSync(file), `${relative} exists`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function section(html, className) {
  const match = html.match(new RegExp(`<section class="${className}"[\\s\\S]*?</section>`));
  return match ? match[0] : "";
}

const listing = read("insights/index.html");
const contentSource = read("content/insights.js");
const generatorSource = read("scripts/build-insights.js");
const insightsCss = read("insights.css");
const siteScript = read("script.js");
const listingHero = section(listing, "insights-hero");

check(listing.includes("Observations on brand, business and the world around us."), "listing intro is correct");
check((listingHero.match(/<h1>/g) || []).length === 1, "Insights index header contains one H1");
check(listingHero.includes("<h1>Insights</h1>"), "Insights index H1 is Insights");
check(!listingHero.includes("i-Spy Insights"), "Insights index has no redundant i-Spy Insights label");
check(!listingHero.includes("section-label"), "Insights index has no redundant section-label markup");
check(!listing.includes("<time"), "listing has no visible dates");
check(!listing.match(/\bBy (i-Spy|Michael Skipper)\b/i), "listing has no authorship");
check(!contentSource.includes("sources:"), "public article data contains no source lists");
check(generatorSource.includes("article.didYouKnow.length < 1 || article.didYouKnow.length > 3"), "Did You Know validation supports one to three facts");
check(listing.includes('/assets/ispy-logo-header-navy.svg'), "Insights use the approved main-site header wordmark");
check(listing.includes('<h2 class="footer-tagline">Ready to chat?</h2>'), "Insights use the approved main-site footer proposition");
check(listing.includes('footer-contact-primary'), "Insights use the approved contact-first footer hierarchy");
check(listing.includes('https://wa.me/447590410269'), "Insights footer includes the approved WhatsApp contact");
check(listing.includes('/assets/ispy-logo-footer-white.svg'), "Insights footer uses the approved white wordmark asset");
check(listing.includes('aria-label="Policies"'), "Insights footer includes the approved policy navigation");
check(listing.includes('Company number 16767948.'), "Insights footer includes the approved company disclosure");
check(listing.includes('<body id="top" class="insights-page">'), "Insights index exposes one valid top target");
check(listing.includes('<a class="footer-back-to-top" href="#top">Back to top <span aria-hidden="true">↑</span></a>'), "Insights footer includes the accessible Back to top control");
check((listing.match(/class="footer-back-to-top"/g) || []).length === 1, "Insights footer contains one Back to top control");
check(listing.indexOf('/concept-one-completion.css') < listing.indexOf('/insights.css'), "Insights refinements load after the approved main-site design layers");
check(insightsCss.includes('--insights-accent-rule: 1px'), "Insights use the main-site fine-rule weight");
check(!insightsCss.match(/border-(?:top|left):\s*0\.(?:3|35)rem\s+solid\s+var\(--pink\)/), "Insights contain no legacy heavy pink rules");
check(insightsCss.match(/\.insights-page\s*{[\s\S]*?padding-top:\s*0;/), "Insights share the main-site header flow without legacy body offset");
check(insightsCss.match(/\.insight-card-image--contain\s*{[\s\S]*?width:\s*100%;/), "contained listing images cannot force mobile overflow");
check(insightsCss.match(/\.insights-hero \.editorial-width\s*{[\s\S]*?max-width:\s*67rem;[\s\S]*?margin-inline:\s*0;/), "Insights listing header uses the approved internal-page width and alignment");
check(!insightsCss.match(/\.insights-hero h1\s*{/), "Insights title inherits the shared secondary-page typography");
check(!insightsCss.match(/\.insights-hero p:last-child\s*{/), "Insights supporting copy inherits the shared secondary-page typography");
check(insightsCss.match(/\.insight-card\.insight-card--type \.card-title a,[\s\S]*?\.related-card\.related-card--type h3 a\s*{[\s\S]*?color:\s*var\(--white\);[\s\S]*?transition:\s*color 180ms ease;/), "headlines remain visible and transition cleanly on navy Insight cards");
check(insightsCss.match(/\.insight-card\.insight-card--type \.insight-link,[\s\S]*?\.related-card\.related-card--type \.insight-link\s*{[\s\S]*?color:\s*var\(--white\);/), "Read insight links remain visible on navy cards");
check(insightsCss.match(/\.insight-card\.insight-card--type \.card-title a:focus-visible,[\s\S]*?color:\s*var\(--pink\);/), "text-only Insight headlines turn magenta on keyboard focus");
check(insightsCss.match(/\.insight-card\.insight-card--type:hover \.card-title a,[\s\S]*?color:\s*var\(--pink\);/), "text-only Insight headlines turn magenta on hover");
check(siteScript.includes('orb.src = "/assets/ispy-orb-live-master.svg"'), "sticky-header orb uses a root-safe asset path on nested Insight routes");

const firstCard = listing.match(/<article class="insight-card[\s\S]*?<\/article>/)?.[0] || "";
check(firstCard.includes("levis-stadium-covered.jpg"), "leading listing card contains the intended Levi’s image");
check(firstCard.includes('loading="eager"'), "leading listing image loads eagerly");
check(firstCard.includes('fetchpriority="high"'), "leading listing image has high fetch priority");
check(firstCard.includes("image-load-fallback"), "listing images include an explicit failure state");

const typeCards = [...listing.matchAll(/<article class="insight-card insight-card--type">([\s\S]*?)<\/article>/g)].map((match) => match[0]);
check(typeCards.some((card) => card.includes("Values are better as verbs")), "Values uses the typographic card treatment");
check(typeCards.some((card) => card.includes("Gen Z isn’t rejecting AI")), "Gen Z uses the typographic card treatment");
check(typeCards.every((card) => /<h2[^>]*><a href="\/insights\/[^"]+\/">/.test(card)), "text-only Insight title links retain valid route hrefs");

insights.forEach((article) => {
  const relative = `insights/${article.slug}/index.html`;
  const html = read(relative);
  const related = section(html, "related-insights");
  const factCount = (html.match(/<aside class="did-you-know"[\s\S]*?<\/aside>/)?.[0].match(/<li>/g) || []).length;

  check(html.includes(`>${article.title}</h1>`), `${article.slug} has its title`);
  check((html.match(/id="top"/g) || []).length === 1, `${article.slug} exposes one valid top target`);
  check(html.includes('<a class="footer-back-to-top" href="#top">Back to top <span aria-hidden="true">↑</span></a>'), `${article.slug} includes the accessible Back to top control`);
  check((html.match(/class="footer-back-to-top"/g) || []).length === 1, `${article.slug} contains one Back to top control`);
  check(html.includes(article.standfirst), `${article.slug} has its standfirst`);
  check(html.includes(article.readingTime), `${article.slug} has its recalculated reading time`);
  check(html.includes(`href="https://www.i-spy.uk/insights/${article.slug}/"`), `${article.slug} has its canonical URL`);
  check(html.includes('"@type":"Article"'), `${article.slug} has Article structured data`);
  check(html.includes(`"dateModified":"${article.modifiedDate}"`), `${article.slug} has its genuine technical modification date`);
  check(!html.includes("<time"), `${article.slug} has no visible date element`);
  check(!html.match(/\bBy (i-Spy|Michael Skipper)\b/i), `${article.slug} has no visible authorship`);
  check(!html.includes('class="article-sources"'), `${article.slug} has no public Sources component`);
  check(!html.includes(">Sources</h2>"), `${article.slug} has no visible Sources heading`);
  check(factCount >= 1 && factCount <= 3, `${article.slug} renders one to three Did You Know facts`);
  check((related.match(/<article class="related-card/g) || []).length === 2, `${article.slug} has two related Insights`);
  check(!related.includes(`href="/insights/${article.slug}/"`), `${article.slug} is excluded from its related module`);
  check(related.includes("related-card-content"), `${article.slug} uses the reusable related-card structure`);
  article.images.forEach((image) => {
    check(fs.existsSync(path.join(root, image.src)), `${article.slug} image exists: ${image.src}`);
    check(html.includes(`width="${image.width}" height="${image.height}"`), `${article.slug} gives ${image.id} stable dimensions`);
  });
});

const sitemap = read("sitemap.xml");
check(sitemap.includes('/privacy-notice'), "sitemap preserves the clean Privacy notice URL");
check(sitemap.includes('/sustainability'), "sitemap preserves the clean Sustainability URL");
check(sitemap.includes('/ai-use-policy'), "sitemap preserves the clean AI use policy URL");
check(sitemap.includes('/how-we-help'), "sitemap contains the descriptive How We Help URL");
check(sitemap.includes('/brand-check'), "sitemap contains the descriptive Brand Check URL");
check(sitemap.includes('/brand-guide'), "sitemap contains the descriptive brand guide URL");
check(!sitemap.match(/<loc>[^<]*\.html<\/loc>/), "sitemap contains no legacy HTML page URLs");
insights.forEach((article) => {
  check(sitemap.includes(`/insights/${article.slug}/`), `sitemap contains ${article.slug}`);
  check(sitemap.includes(`<lastmod>${article.modifiedDate}</lastmod>`), `sitemap uses the current technical batch date for ${article.slug}`);
});

const applePhilosophyPath = "/images/insights/apple-marketing-philosophy/apple-marketing-philosophy-1977.jpg";
const appleArticle = read("insights/people-do-judge-a-book-by-its-cover/index.html");
const aiArticle = read("insights/gen-z-ai-questioning-the-deal/index.html");
const levisArticle = read("insights/levis-gillette-attention-recognition/index.html");
const salesArticle = read("insights/sales-starts-before-the-pitch/index.html");
const originArticle = read("insights/your-origin-story-is-a-brand-asset/index.html");
const originMain = originArticle.match(/<article class="article">[\s\S]*?<\/article>/)?.[0] || "";

check(appleArticle.includes(applePhilosophyPath), "Apple article contains its complete document image");
check(appleArticle.includes("data-image-enlarge"), "Apple document has an enlargement control");
check(appleArticle.includes('id="imageLightbox"'), "Apple document has an accessible dialog target");
check(appleArticle.includes("Enlarge the Apple Marketing Philosophy document"), "Apple enlargement has a meaningful accessible label");
check(!originMain.includes(applePhilosophyPath), "origin-story article body does not contain the Apple philosophy document");
check(!aiArticle.includes("<figure"), "Gen Z and AI article contains no generic imagery");
check((originArticle.match(/<figure class="article-inset">/g) || []).length === 3, "origin-story article contains three consistently treated brand images");
check(originArticle.includes("Nike co-founder Phil Knight with a display of early Nike shoes."), "Nike caption identifies Phil Knight accurately");
check(originArticle.includes("Steve Jobs, John Sculley and Steve Wozniak introduce the Apple IIc in 1984."), "Apple IIc caption identifies the visible people");
check(originArticle.includes("Richard Branson with a model Virgin Atlantic aircraft"), "Virgin caption identifies Richard Branson");
check(salesArticle.includes("McGraw-Hill’s 1958 “Man in the Chair” advertisement."), "McGraw-Hill caption uses the approved wording");
check(salesArticle.includes('class="article-caption"'), "feature images use the shared caption system");
check(salesArticle.includes("<blockquote>"), "sales article retains semantic quote formatting");

const levisPosition = levisArticle.indexOf("levis-stadium-covered.jpg");
const gillettePosition = levisArticle.indexOf("gillette-stadium-foam.jpg");
check(levisPosition !== -1 && gillettePosition !== -1 && levisPosition < gillettePosition, "Levi’s appears first in the comparison order");
check(levisArticle.includes('class="article-comparison-grid"'), "Levi’s and Gillette use the reusable comparison layout");
check(levisArticle.includes("Levi’s carried the covered-logo idea into its social identity."), "Levi’s social-profile image remains secondary and captioned");

check(listing.includes("card-title--long"), "listing applies the reusable long-title treatment");
check(levisArticle.includes("article-title--long"), "long article titles use the reusable fluid treatment");
check(read("insights.js").includes("dialog.showModal"), "Insights interaction script progressively enhances image enlargement");

if (failures) process.exit(1);
console.log(`Passed definitive Insights checks for ${insights.length} articles and the listing page.`);
