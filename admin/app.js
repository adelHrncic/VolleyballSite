(function () {
  "use strict";

  var STORAGE_KEY = "volleyballSiteContent";
  var defaultData = {
    brandName: "[ TEAM NAME ]",
    heroKicker: "// [ LEAGUE PLACEHOLDER ] • EST. [ YYYY ]",
    heroTitleLine1: "[ TEAM ]",
    heroTitleLine2: "[ NAME ]",
    heroTagline: "[ Tagline placeholder goes here ]",
    heroVideoUrl: "",
    signupTitle: "[ Join The Newsletter ]",
    signupDescription: "[ Newsletter signup description placeholder — updates on games, tryouts and events. ]",
    signupSuccess: "[ Placeholder success message ]",
    aboutTitle: "[ About Us ]",
    aboutDescription: "[ About us paragraph placeholder — team history, mission, and values go here. ]",
    galleryTitle: "[ Gallery ]",
    galleryDescription: "[ Gallery description placeholder — photos from matches, training and events. ]",
    faqTitle: "[ FAQs ]",
    faqIntro: "[ FAQ intro placeholder text. ]",
    faqItems: [
      { question: "[ Question placeholder one? ]", answer: "[ Answer placeholder text goes here. ]" },
      { question: "[ Question placeholder two? ]", answer: "[ Answer placeholder text goes here. ]" },
      { question: "[ Question placeholder three? ]", answer: "[ Answer placeholder text goes here. ]" },
      { question: "[ Question placeholder four? ]", answer: "[ Answer placeholder text goes here. ]" },
      { question: "[ Question placeholder five? ]", answer: "[ Answer placeholder text goes here. ]" }
    ],
    contactTitle: "[ Contact ]",
    contactDescription: "[ Contact intro placeholder text. ]",
    email: "[ email@placeholder.com ]",
    phone: "[ (000) 000-0000 ]",
    homeCourt: "[ Venue / Address Placeholder ]",
    practice: "[ Days / Times Placeholder ]",
    socials: [
      { label: "[ Instagram ]", url: "#" },
      { label: "[ Facebook ]", url: "#" },
      { label: "[ TikTok ]", url: "#" }
    ],
    footerName: "[ TEAM NAME ]",
    footerCopy: "[ © YYYY Team Name Placeholder. All rights reserved. ]",
    teamMembers: [
      { name: "[ Player Name ]", role: "[ Position / No. ]", bio: "[ Mini bio placeholder text goes here. ]", photo: "img/volleyball.png" },
      { name: "[ Player Name ]", role: "[ Position / No. ]", bio: "[ Mini bio placeholder text goes here. ]", photo: "img/volleyball.png" },
      { name: "[ Player Name ]", role: "[ Position / No. ]", bio: "[ Mini bio placeholder text goes here. ]", photo: "img/volleyball.png" },
      { name: "[ Player Name ]", role: "[ Position / No. ]", bio: "[ Mini bio placeholder text goes here. ]", photo: "img/volleyball.png" },
      { name: "[ Player Name ]", role: "[ Position / No. ]", bio: "[ Mini bio placeholder text goes here. ]", photo: "img/volleyball.png" },
      { name: "[ Player Name ]", role: "[ Position / No. ]", bio: "[ Mini bio placeholder text goes here. ]", photo: "img/volleyball.png" }
    ],
    galleryImages: [
      { src: "img/volleyball.png", alt: "[ Image ]" },
      { src: "img/volleyball.png", alt: "[ Image ]" },
      { src: "img/volleyball.png", alt: "[ Image ]" },
      { src: "img/volleyball.png", alt: "[ Image ]" },
      { src: "img/volleyball.png", alt: "[ Image ]" },
      { src: "img/volleyball.png", alt: "[ Image ]" },
      { src: "img/volleyball.png", alt: "[ Image ]" }
    ]
  };

  function getStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, defaultData);
      return Object.assign({}, defaultData, JSON.parse(raw));
    } catch (error) {
      return Object.assign({}, defaultData);
    }
  }

  function saveStored(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function isAuthenticated() {
    return document.cookie.split("; ").some(function (value) {
      return value.indexOf("admin_session=") === 0;
    });
  }

  function addValue(form, name, value) {
    if (value === undefined || value === null) return;
    var field = form.elements.namedItem(name);
    if (field) {
      field.value = value;
    }
  }

  function readForm(form) {
    var data = getStored();
    var entries = new FormData(form);

    data.brandName = entries.get("brandName") || data.brandName;
    data.heroKicker = entries.get("heroKicker") || data.heroKicker;
    data.heroTitleLine1 = entries.get("heroTitleLine1") || data.heroTitleLine1;
    data.heroTitleLine2 = entries.get("heroTitleLine2") || data.heroTitleLine2;
    data.heroTagline = entries.get("heroTagline") || data.heroTagline;
    data.heroVideoUrl = entries.get("heroVideoUrl") || "";
    data.signupTitle = entries.get("signupTitle") || data.signupTitle;
    data.signupDescription = entries.get("signupDescription") || data.signupDescription;
    data.signupSuccess = entries.get("signupSuccess") || data.signupSuccess;
    data.aboutTitle = entries.get("aboutTitle") || data.aboutTitle;
    data.aboutDescription = entries.get("aboutDescription") || data.aboutDescription;
    data.galleryTitle = entries.get("galleryTitle") || data.galleryTitle;
    data.galleryDescription = entries.get("galleryDescription") || data.galleryDescription;
    data.faqTitle = entries.get("faqTitle") || data.faqTitle;
    data.faqIntro = entries.get("faqIntro") || data.faqIntro;
    data.contactTitle = entries.get("contactTitle") || data.contactTitle;
    data.contactDescription = entries.get("contactDescription") || data.contactDescription;
    data.email = entries.get("email") || data.email;
    data.phone = entries.get("phone") || data.phone;
    data.homeCourt = entries.get("homeCourt") || data.homeCourt;
    data.practice = entries.get("practice") || data.practice;
    data.footerName = entries.get("footerName") || data.footerName;
    data.footerCopy = entries.get("footerCopy") || data.footerCopy;

    data.socials = [
      { label: entries.get("social1Label") || "[ Instagram ]", url: entries.get("social1Url") || "#" },
      { label: entries.get("social2Label") || "[ Facebook ]", url: entries.get("social2Url") || "#" },
      { label: entries.get("social3Label") || "[ TikTok ]", url: entries.get("social3Url") || "#" }
    ];

    data.teamMembers = [
      { name: entries.get("player1Name") || "[ Player Name ]", role: entries.get("player1Role") || "[ Position / No. ]", bio: entries.get("player1Bio") || "[ Mini bio placeholder text goes here. ]", photo: entries.get("player1Photo") || "img/volleyball.png" },
      { name: entries.get("player2Name") || "[ Player Name ]", role: entries.get("player2Role") || "[ Position / No. ]", bio: entries.get("player2Bio") || "[ Mini bio placeholder text goes here. ]", photo: entries.get("player2Photo") || "img/volleyball.png" },
      { name: entries.get("player3Name") || "[ Player Name ]", role: entries.get("player3Role") || "[ Position / No. ]", bio: entries.get("player3Bio") || "[ Mini bio placeholder text goes here. ]", photo: entries.get("player3Photo") || "img/volleyball.png" },
      { name: entries.get("player4Name") || "[ Player Name ]", role: entries.get("player4Role") || "[ Position / No. ]", bio: entries.get("player4Bio") || "[ Mini bio placeholder text goes here. ]", photo: entries.get("player4Photo") || "img/volleyball.png" },
      { name: entries.get("player5Name") || "[ Player Name ]", role: entries.get("player5Role") || "[ Position / No. ]", bio: entries.get("player5Bio") || "[ Mini bio placeholder text goes here. ]", photo: entries.get("player5Photo") || "img/volleyball.png" },
      { name: entries.get("player6Name") || "[ Player Name ]", role: entries.get("player6Role") || "[ Position / No. ]", bio: entries.get("player6Bio") || "[ Mini bio placeholder text goes here. ]", photo: entries.get("player6Photo") || "img/volleyball.png" }
    ];

    data.galleryImages = [
      { src: entries.get("gallery1Src") || "img/volleyball.png", alt: entries.get("gallery1Alt") || "[ Image ]" },
      { src: entries.get("gallery2Src") || "img/volleyball.png", alt: entries.get("gallery2Alt") || "[ Image ]" },
      { src: entries.get("gallery3Src") || "img/volleyball.png", alt: entries.get("gallery3Alt") || "[ Image ]" },
      { src: entries.get("gallery4Src") || "img/volleyball.png", alt: entries.get("gallery4Alt") || "[ Image ]" },
      { src: entries.get("gallery5Src") || "img/volleyball.png", alt: entries.get("gallery5Alt") || "[ Image ]" },
      { src: entries.get("gallery6Src") || "img/volleyball.png", alt: entries.get("gallery6Alt") || "[ Image ]" },
      { src: entries.get("gallery7Src") || "img/volleyball.png", alt: entries.get("gallery7Alt") || "[ Image ]" }
    ];

    data.faqItems = [
      { question: entries.get("faq1Question") || "[ Question placeholder one? ]", answer: entries.get("faq1Answer") || "[ Answer placeholder text goes here. ]" },
      { question: entries.get("faq2Question") || "[ Question placeholder two? ]", answer: entries.get("faq2Answer") || "[ Answer placeholder text goes here. ]" },
      { question: entries.get("faq3Question") || "[ Question placeholder three? ]", answer: entries.get("faq3Answer") || "[ Answer placeholder text goes here. ]" },
      { question: entries.get("faq4Question") || "[ Question placeholder four? ]", answer: entries.get("faq4Answer") || "[ Answer placeholder text goes here. ]" },
      { question: entries.get("faq5Question") || "[ Question placeholder five? ]", answer: entries.get("faq5Answer") || "[ Answer placeholder text goes here. ]" }
    ];

    return data;
  }

  function hydrateForm(form, data) {
    addValue(form, "brandName", data.brandName);
    addValue(form, "heroKicker", data.heroKicker);
    addValue(form, "heroTitleLine1", data.heroTitleLine1);
    addValue(form, "heroTitleLine2", data.heroTitleLine2);
    addValue(form, "heroTagline", data.heroTagline);
    addValue(form, "heroVideoUrl", data.heroVideoUrl || "");
    addValue(form, "signupTitle", data.signupTitle);
    addValue(form, "signupDescription", data.signupDescription);
    addValue(form, "signupSuccess", data.signupSuccess);
    addValue(form, "aboutTitle", data.aboutTitle);
    addValue(form, "aboutDescription", data.aboutDescription);
    addValue(form, "galleryTitle", data.galleryTitle);
    addValue(form, "galleryDescription", data.galleryDescription);
    addValue(form, "faqTitle", data.faqTitle);
    addValue(form, "faqIntro", data.faqIntro);
    addValue(form, "contactTitle", data.contactTitle);
    addValue(form, "contactDescription", data.contactDescription);
    addValue(form, "email", data.email);
    addValue(form, "phone", data.phone);
    addValue(form, "homeCourt", data.homeCourt);
    addValue(form, "practice", data.practice);
    addValue(form, "footerName", data.footerName);
    addValue(form, "footerCopy", data.footerCopy);

    if (data.socials && data.socials.length >= 3) {
      addValue(form, "social1Label", data.socials[0].label);
      addValue(form, "social1Url", data.socials[0].url);
      addValue(form, "social2Label", data.socials[1].label);
      addValue(form, "social2Url", data.socials[1].url);
      addValue(form, "social3Label", data.socials[2].label);
      addValue(form, "social3Url", data.socials[2].url);
    }

    if (data.teamMembers) {
      data.teamMembers.forEach(function (member, index) {
        var itemIndex = index + 1;
        addValue(form, "player" + itemIndex + "Name", member.name);
        addValue(form, "player" + itemIndex + "Role", member.role);
        addValue(form, "player" + itemIndex + "Bio", member.bio);
        addValue(form, "player" + itemIndex + "Photo", member.photo);
      });
    }

    if (data.galleryImages) {
      data.galleryImages.forEach(function (item, index) {
        var itemIndex = index + 1;
        addValue(form, "gallery" + itemIndex + "Src", item.src);
        addValue(form, "gallery" + itemIndex + "Alt", item.alt);
      });
    }

    if (data.faqItems) {
      data.faqItems.forEach(function (item, index) {
        var itemIndex = index + 1;
        addValue(form, "faq" + itemIndex + "Question", item.question);
        addValue(form, "faq" + itemIndex + "Answer", item.answer);
      });
    }
  }

  function showLogin() {
    document.getElementById("loginView").hidden = false;
    document.getElementById("editorView").hidden = true;
    document.getElementById("logoutButton").hidden = true;
  }

  function showEditor() {
    document.getElementById("loginView").hidden = true;
    document.getElementById("editorView").hidden = false;
    document.getElementById("logoutButton").hidden = false;
  }

  function fetchJson(url, options) {
    return fetch(url, Object.assign({ credentials: "same-origin" }, options || {}));
  }

  async function uploadMedia() {
    var fileInput = document.getElementById("mediaUpload");
    var targetField = document.getElementById("mediaTarget");
    var status = document.getElementById("saveMessage");

    if (!fileInput || !fileInput.files.length) {
      status.textContent = "Choose a file first.";
      status.classList.add("error");
      return;
    }

    var formData = new FormData();
    formData.append("file", fileInput.files[0]);

    status.textContent = "Uploading...";
    status.classList.remove("error");

    try {
      var response = await fetchJson("/api/upload", {
        method: "POST",
        body: formData
      });
      var result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      var targetFieldEl = document.querySelector('[name="' + targetField.value + '"]');
      if (targetFieldEl) {
        targetFieldEl.value = result.url;
      }

      status.textContent = "Uploaded successfully. The media URL has been inserted in the selected field.";
      fileInput.value = "";
    } catch (error) {
      status.textContent = error.message || "Upload failed.";
      status.classList.add("error");
    }
  }

  async function publishChanges(form) {
    var data = readForm(form);
    saveStored(data);

    var response = await fetchJson("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    var result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Save failed.");
    }

    document.getElementById("saveMessage").textContent = "Saved successfully. Refresh the homepage to preview it.";
  }

  async function handleLogin(event) {
    event.preventDefault();
    var loginForm = document.getElementById("loginForm");
    var message = document.getElementById("loginMessage");
    var username = loginForm.username.value.trim();
    var password = loginForm.password.value.trim();

    try {
      var response = await fetchJson("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password })
      });

      var result = await response.json();
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Login failed.");
      }

      message.textContent = "";
      hydrateForm(document.getElementById("editorForm"), getStored());
      showEditor();
    } catch (error) {
      message.textContent = error.message || "Incorrect username or password.";
      message.classList.add("error");
    }
  }

  async function handleLogout() {
    try {
      await fetchJson("/api/logout", { method: "POST" });
    } catch (error) {
      console.warn("Could not clear session cookie.", error);
    }

    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    document.getElementById("loginForm").reset();
    showLogin();
  }

  function init() {
    var loginForm = document.getElementById("loginForm");
    var editorForm = document.getElementById("editorForm");
    var uploadButton = document.getElementById("uploadMediaButton");
    var logoutButton = document.getElementById("logoutButton");

    if (isAuthenticated()) {
      hydrateForm(editorForm, getStored());
      showEditor();
    } else {
      showLogin();
    }

    loginForm.addEventListener("submit", handleLogin);

    editorForm.addEventListener("submit", function (event) {
      event.preventDefault();
      publishChanges(editorForm).catch(function (error) {
        document.getElementById("saveMessage").textContent = error.message || "Save failed.";
        document.getElementById("saveMessage").classList.add("error");
      });
    });

    uploadButton.addEventListener("click", uploadMedia);
    logoutButton.addEventListener("click", handleLogout);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
