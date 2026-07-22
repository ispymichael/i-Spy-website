/**
 * Reusable i-Spy Insights interactions.
 * Keeps image failure states explicit and progressively enhances large documents.
 */
(function () {
  "use strict";

  document.querySelectorAll(".insight-card-image img, .related-card-image img").forEach(function (image) {
    const container = image.parentElement;

    function showFailure() {
      container.classList.add("image-load-failed");
    }

    image.addEventListener("error", showFailure);
    if (image.complete && image.naturalWidth === 0) showFailure();
  });

  const dialog = document.getElementById("imageLightbox");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const dialogImage = dialog.querySelector("img");
  const dialogCaption = dialog.querySelector(".image-lightbox-caption");
  const closeButton = dialog.querySelector("[data-lightbox-close]");
  let activeTrigger = null;

  document.querySelectorAll("[data-image-enlarge]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      const sourceImage = trigger.querySelector("img");
      if (!sourceImage) return;

      event.preventDefault();
      activeTrigger = trigger;
      dialogImage.src = sourceImage.currentSrc || sourceImage.src;
      dialogImage.alt = sourceImage.alt;

      const caption = trigger.closest("figure").querySelector("figcaption");
      dialogCaption.textContent = caption ? caption.textContent : "";
      dialogCaption.hidden = !dialogCaption.textContent;

      dialog.showModal();
      closeButton.focus();
    });
  });

  closeButton.addEventListener("click", function () {
    dialog.close();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", function () {
    if (activeTrigger) activeTrigger.focus();
    activeTrigger = null;
  });
})();
