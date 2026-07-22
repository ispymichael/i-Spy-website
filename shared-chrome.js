(function () {
  const currentPage = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll('header a, #mobileMenu a').forEach(function (link) {
    const page = link.getAttribute("href").split("#")[0] || "index.html";
    if (page === currentPage && page !== "index.html") link.setAttribute("aria-current", "page");
    if (["recognition-before-conversation.html", "recognition-not-decoration.html", "sweep-the-shed.html"].includes(currentPage) && page === "insights.html") {
      link.setAttribute("aria-current", "page");
    }
  });
})();
