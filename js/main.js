(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var button = item.querySelector(".faq-question");
    var answer = item.querySelector(".faq-answer");

    button.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";

      faqItems.forEach(function (other) {
        other.setAttribute("data-open", "false");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      if (!isOpen) {
        item.setAttribute("data-open", "true");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".player-card, .gallery-item, .faq-item, .signup-copy, .signup-form, .contact-info, .contact-form"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Net mesh divider (generated crosshatch) ---------- */
  var meshGroup = document.querySelector(".net-mesh .mesh-lines");
  if (meshGroup) {
    var svgNS = "http://www.w3.org/2000/svg";
    var width = 1440, height = 60, step = 40;
    for (var x = -height; x < width + height; x += step) {
      var l1 = document.createElementNS(svgNS, "line");
      l1.setAttribute("x1", x);
      l1.setAttribute("y1", 0);
      l1.setAttribute("x2", x + height);
      l1.setAttribute("y2", height);
      meshGroup.appendChild(l1);

      var l2 = document.createElementNS(svgNS, "line");
      l2.setAttribute("x1", x + height);
      l2.setAttribute("y1", 0);
      l2.setAttribute("x2", x);
      l2.setAttribute("y2", height);
      meshGroup.appendChild(l2);
    }
    meshGroup.querySelectorAll("line").forEach(function (line) {
      line.setAttribute("stroke", "#ffffff");
      line.setAttribute("stroke-width", "1");
    });
  }

  /* ---------- Signup form (placeholder submit) ---------- */
  var signupForm = document.getElementById("signupForm");
  var signupSuccess = document.getElementById("signupSuccess");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      signupSuccess.classList.add("show");
      signupForm.reset();
    });
  }

  /* ---------- Contact form (placeholder submit) ---------- */
  var contactForm = document.getElementById("contactForm");
  var contactSuccess = document.getElementById("contactSuccess");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactSuccess.classList.add("show");
      contactForm.reset();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 10 ? "0 8px 24px rgba(0,0,0,0.35)" : "none";
    });
  }

  /* ---------- Divider balls: bounce off walls + get batted by the cursor ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ballEls = document.querySelectorAll(".divider-ball--physics");

  if (!reduceMotion && ballEls.length) {
    var pointer = { x: -9999, y: -9999 };
    var hitRadius = 26;
    var hitCooldown = 0.4;
    var hitBoost = 1.18;
    var maxSpeed = 260;

    window.addEventListener("pointermove", function (e) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    });
    document.addEventListener("mouseleave", function () {
      pointer.x = -9999;
      pointer.y = -9999;
    });

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    var balls = [];
    ballEls.forEach(function (ball, i) {
      var track = ball.parentElement;
      var radius = (ball.offsetWidth || 24) / 2;
      var dir = i % 2 === 0 ? 1 : -1;
      balls.push({
        track: track,
        ball: ball,
        radius: radius,
        rect: { left: 0, top: 0 },
        width: 0,
        height: 0,
        x: radius + 30 + Math.random() * 60,
        y: radius + 15 + Math.random() * 30,
        vx: dir * (85 + Math.random() * 35),
        vy: (Math.random() * 2 - 1) * 22,
        cooldown: 0
      });
    });

    function measure() {
      balls.forEach(function (b) {
        var r = b.track.getBoundingClientRect();
        b.rect = r;
        b.width = r.width;
        b.height = r.height;
      });
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    var lastTime = null;

    function tick(now) {
      if (lastTime === null) lastTime = now;
      var dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      balls.forEach(function (b) {
        var w = b.width;
        var h = b.height;
        if (!w || !h) return;

        b.x += b.vx * dt;
        b.y += b.vy * dt;

        if (b.x < b.radius) { b.x = b.radius; b.vx = Math.abs(b.vx); }
        if (b.x > w - b.radius) { b.x = w - b.radius; b.vx = -Math.abs(b.vx); }
        if (b.y < b.radius) { b.y = b.radius; b.vy = Math.abs(b.vy); }
        if (b.y > h - b.radius) { b.y = h - b.radius; b.vy = -Math.abs(b.vy); }

        if (b.cooldown > 0) {
          b.cooldown -= dt;
        } else {
          var rect = b.rect;
          var ballCx = rect.left + b.x;
          var ballCy = rect.top + b.y;
          var dx = ballCx - pointer.x;
          var dy = ballCy - pointer.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < hitRadius && dist > 0.01) {
            var nx = dx / dist;
            var ny = dy / dist;
            var speed = Math.min((Math.sqrt(b.vx * b.vx + b.vy * b.vy) || 90) * hitBoost, maxSpeed);
            b.vx = nx * speed;
            b.vy = ny * speed;
            b.x = clamp(ballCx + nx * hitRadius - rect.left, b.radius, w - b.radius);
            b.y = clamp(ballCy + ny * hitRadius - rect.top, b.radius, h - b.radius);
            b.cooldown = hitCooldown;
          }
        }

        b.ball.style.transform =
          "translate3d(" + (b.x - b.radius) + "px," + (b.y - b.radius) + "px,0)";
      });

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }
})();
