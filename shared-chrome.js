(function () {
  function normalisePath(pathname) {
    const cleanPath = pathname
      .replace(/\/index(?:\.html)?$/, "/")
      .replace(/\.html$/, "")
      .replace(/\/+$/, "");
    return cleanPath || "/";
  }

  const currentPath = normalisePath(location.pathname);
  document.querySelectorAll('header a, #mobileMenu a').forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#")) return;
    const targetPath = normalisePath(new URL(href, location.origin).pathname);
    if (targetPath === currentPath && targetPath !== "/") link.setAttribute("aria-current", "page");
    if (currentPath.startsWith("/insights/") && targetPath === "/insights") {
      link.setAttribute("aria-current", "page");
    }
  });
})();
