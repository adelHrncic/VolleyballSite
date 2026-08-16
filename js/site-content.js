(function () {
  "use strict";

  var dataUrl = "/api/content";

  function setText(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setInputPlaceholder(selector, value) {
    if (!value) return;
    var el = document.querySelector(selector);
    if (el) el.placeholder = value;
  }

  function setHeroVideo(url) {
    var video = document.getElementById("heroVideo");
    if (!video) return;
    if (url) {
      video.src = url;
      video.load();
    } else {
      video.removeAttribute("src");
    }
  }

  function populateTeamMembers(members) {
    var cards = document.querySelectorAll(".player-card");
    if (!members || !cards.length) return;
    members.forEach(function (member, index) {
      var card = cards[index];
      if (!card) return;
      var nameEl = card.querySelector(".player-name");
      var roleEl = card.querySelector(".player-role");
      var bioEl = card.querySelector(".player-bio");
      var photoEl = card.querySelector(".player-photo");
      var placeholderEl = photoEl ? photoEl.querySelector("span") : null;

      if (nameEl) nameEl.textContent = member.name || "[ Player Name ]";
      if (roleEl) roleEl.textContent = member.role || "[ Position / No. ]";
      if (bioEl) bioEl.textContent = member.bio || "[ Mini bio placeholder text goes here. ]";
      if (photoEl) {
        if (member.photo) {
          photoEl.style.backgroundImage = "linear-gradient(rgba(5,9,20,0.18), rgba(5,9,20,0.25)), url('" + member.photo + "')";
          photoEl.style.backgroundSize = "cover";
          photoEl.style.backgroundPosition = "center";
          photoEl.style.backgroundRepeat = "no-repeat";
          if (placeholderEl) placeholderEl.style.display = "none";
        } else {
          photoEl.style.backgroundImage = "";
          photoEl.style.backgroundSize = "";
          photoEl.style.backgroundPosition = "";
          photoEl.style.backgroundRepeat = "";
          if (placeholderEl) placeholderEl.style.display = "block";
        }
      }
    });
  }

  function populateGallery(images) {
    var items = document.querySelectorAll(".gallery-item");
    if (!images || !items.length) return;
    images.forEach(function (image, index) {
      var item = items[index];
      if (!item) return;
      if (image && image.src) {
        item.style.backgroundImage = "linear-gradient(rgba(5,9,20,0.18), rgba(5,9,20,0.28)), url('" + image.src + "')";
        item.style.backgroundSize = "cover";
        item.style.backgroundPosition = "center";
      }
      var label = item.querySelector("span");
      if (label && image && image.alt) label.textContent = image.alt;
    });
  }

  function populateFaq(items) {
    var faqItems = document.querySelectorAll(".faq-item");
    if (!items || !faqItems.length) return;
    items.forEach(function (item, index) {
      var entry = faqItems[index];
      if (!entry) return;
      var question = entry.querySelector(".faq-question span");
      var answer = entry.querySelector(".faq-answer p");
      if (question) question.innerHTML = '<i class="volleyball faq-ball" aria-hidden="true"></i>' + (item.question || "[ Question placeholder ]");
      if (answer) answer.textContent = item.answer || "[ Answer placeholder text goes here. ]";
    });
  }

  function populateSocials(items) {
    var socialRow = document.querySelector(".social-row");
    if (!socialRow || !items || !items.length) return;
    socialRow.innerHTML = items.map(function (item) {
      return '<a href="' + (item.url || "#") + '" class="social-pill" target="_blank" rel="noreferrer">' + (item.label || "Social") + '</a>';
    }).join("");
  }

  function applyData(data) {
    setText(".brand-name", data.brandName);
    setText(".hero-kicker", data.heroKicker);
    setText(".hero-title span:first-child", data.heroTitleLine1);
    setText(".hero-title span:last-child", data.heroTitleLine2);
    setText(".hero-tagline", data.heroTagline);
    setHeroVideo(data.heroVideoUrl);

    setText(".signup-copy .section-title", data.signupTitle);
    setText(".signup-copy .section-desc", data.signupDescription);
    setText("#signupSuccess", data.signupSuccess);

    setText(".about .section-title", data.aboutTitle);
    setText(".about .section-desc", data.aboutDescription);

    setText(".gallery .section-title", data.galleryTitle);
    setText(".gallery .section-desc", data.galleryDescription);

    setText(".faq .section-title", data.faqTitle);
    setText(".faq .section-desc", data.faqIntro);

    setText(".contact .section-title", data.contactTitle);
    setText(".contact .section-desc", data.contactDescription);

    setText(".info-value:nth-of-type(1)", data.email);
    setText(".info-value:nth-of-type(2)", data.phone);
    setText(".info-value:nth-of-type(3)", data.homeCourt);
    setText(".info-value:nth-of-type(4)", data.practice);

    setText(".footer-name", data.footerName);
    setText(".footer-copy", data.footerCopy);

    setInputPlaceholder("#signupName", data.signupName || "[ Your Name ]");
    setInputPlaceholder("#signupEmail", data.signupEmail || "[ Your Email ]");
    setInputPlaceholder("#contactName", data.contactName || "[ Your Name ]");
    setInputPlaceholder("#contactEmail", data.contactEmail || "[ Your Email ]");
    setInputPlaceholder("#contactMsg", data.contactMessage || "[ Your Message ]");

    populateTeamMembers(data.teamMembers);
    populateGallery(data.galleryImages);
    populateFaq(data.faqItems);
    populateSocials(data.socials);
  }

  fetch(dataUrl, { credentials: "same-origin" })
    .then(function (response) {
      if (!response.ok) throw new Error("Unable to load content");
      return response.json();
    })
    .then(applyData)
    .catch(function () {
      console.warn("Using fallback content. Add the admin content flow to customize the site.");
    });
})();
