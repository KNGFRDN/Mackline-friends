/* animations.js — scroll reveals and stat counters */
(function(){
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Fade-up reveal on scroll */
  var revealItems = document.querySelectorAll(".reveal");
  if(revealItems.length){
    if(reduced || !("IntersectionObserver" in window)){
      revealItems.forEach(function(el){ el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { threshold:.15, rootMargin:"0px 0px -60px 0px" });
      revealItems.forEach(function(el){ io.observe(el); });
    }
  }

  /* Animated counters */
  var counters = document.querySelectorAll("[data-count]");
  if(counters.length){
    var animate = function(el){
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if(reduced){
        el.textContent = target + suffix;
        return;
      }
      var duration = 1400;
      var start = null;
      function step(ts){
        if(start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if(progress < 1){ requestAnimationFrame(step); }
        else { el.textContent = target + suffix; }
      }
      requestAnimationFrame(step);
    };

    if(!("IntersectionObserver" in window)){
      counters.forEach(animate);
    } else {
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            animate(entry.target);
            cio.unobserve(entry.target);
          }
        });
      }, { threshold:.5 });
      counters.forEach(function(el){ cio.observe(el); });
    }
  }

})();
