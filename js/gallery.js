/* gallery.js — filtering and lightbox for the gallery page */
(function(){
  "use strict";

  var grid = document.querySelector("#gallery-grid");
  if(!grid) return;

  var filters = document.querySelectorAll(".gfilter");
  var items = Array.prototype.slice.call(grid.querySelectorAll(".g-item"));

  filters.forEach(function(btn){
    btn.addEventListener("click", function(){
      filters.forEach(function(b){ b.classList.remove("active"); });
      btn.classList.add("active");
      var category = btn.getAttribute("data-filter");
      items.forEach(function(item){
        var match = category === "all" || item.getAttribute("data-category") === category;
        item.classList.toggle("hide", !match);
      });
    });
  });

  /* Lightbox */
  var lightbox = document.querySelector("#lightbox");
  var lbImage = document.querySelector("#lightbox-image");
  var lbCaption = document.querySelector("#lightbox-caption");
  var closeBtn = document.querySelector("#lightbox-close");
  var prevBtn = document.querySelector("#lightbox-prev");
  var nextBtn = document.querySelector("#lightbox-next");
  var currentIndex = 0;
  var lastFocused = null;

  function visibleItems(){
    return items.filter(function(item){ return !item.classList.contains("hide"); });
  }

  function openLightbox(index){
    var visible = visibleItems();
    if(!visible.length) return;
    currentIndex = index;
    var item = visible[currentIndex];
    var img = item.querySelector("img");
    lbImage.src = img.getAttribute("src");
    lbImage.alt = img.getAttribute("alt") || "";
    lbCaption.textContent = item.getAttribute("data-caption") || img.getAttribute("alt") || "";
    lastFocused = document.activeElement;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    closeBtn.focus();
    document.body.style.overflow = "hidden";
  }

  function closeLightbox(){
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if(lastFocused) lastFocused.focus();
  }

  function step(dir){
    var visible = visibleItems();
    if(!visible.length) return;
    currentIndex = (currentIndex + dir + visible.length) % visible.length;
    openLightbox(currentIndex);
  }

  items.forEach(function(item, i){
    item.addEventListener("click", function(){
      var visible = visibleItems();
      openLightbox(visible.indexOf(item));
    });
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("keydown", function(e){
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        var visible = visibleItems();
        openLightbox(visible.indexOf(item));
      }
    });
  });

  if(closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if(prevBtn) prevBtn.addEventListener("click", function(){ step(-1); });
  if(nextBtn) nextBtn.addEventListener("click", function(){ step(1); });

  if(lightbox){
    lightbox.addEventListener("click", function(e){
      if(e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function(e){
      if(!lightbox.classList.contains("open")) return;
      if(e.key === "Escape") closeLightbox();
      if(e.key === "ArrowLeft") step(-1);
      if(e.key === "ArrowRight") step(1);
    });

    /* basic touch swipe */
    var touchStartX = 0;
    lightbox.addEventListener("touchstart", function(e){
      touchStartX = e.changedTouches[0].screenX;
    }, { passive:true });
    lightbox.addEventListener("touchend", function(e){
      var diff = e.changedTouches[0].screenX - touchStartX;
      if(Math.abs(diff) > 50){ step(diff > 0 ? -1 : 1); }
    }, { passive:true });
  }

})();
