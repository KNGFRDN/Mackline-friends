/* main.js — navigation, mobile menu, contact form */
(function(){
  "use strict";

  /* Sticky header shrink on scroll */
  var header = document.querySelector(".site-header");
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 24){ header.classList.add("scrolled"); }
    else{ header.classList.remove("scrolled"); }
  }
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();

  /* Mobile nav */
  var toggle = document.querySelector(".hamburger");
  var mobileNav = document.querySelector(".mobile-nav");
  if(toggle && mobileNav){
    toggle.addEventListener("click", function(){
      var open = mobileNav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        mobileNav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Contact form validation (frontend-only, no backend configured) */
  var form = document.querySelector("#contact-form");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var valid = true;
      var fields = form.querySelectorAll("[data-required]");
      fields.forEach(function(field){
        var input = field.querySelector("input, textarea");
        var value = input.value.trim();
        var ok = value.length > 0;
        if(input.type === "email" && ok){
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }
        field.classList.toggle("invalid", !ok);
        if(!ok) valid = false;
      });

      var status = document.querySelector("#form-status");
      if(valid){
        status.textContent = "Message sent. We'll get back to you within a few days.";
        status.classList.add("show");
        form.reset();
      } else {
        status.classList.remove("show");
      }
    });

    form.querySelectorAll("input, textarea").forEach(function(input){
      input.addEventListener("input", function(){
        var field = input.closest("[data-required]");
        if(field) field.classList.remove("invalid");
      });
    });
  }

})();
