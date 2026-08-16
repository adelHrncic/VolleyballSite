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

  function getListIndexes(form, prefix) {
    var matches = [];
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!field || !field.name || field.name.indexOf(prefix) !== 0) return;
      var suffix = field.name.slice(prefix.length);
      var numberMatch = suffix.match(/^(\d+)/);
      if (!numberMatch) return;
      var index = parseInt(numberMatch[1], 10);
      if (matches.indexOf(index) === -1) {
        matches.push(index);
      }
    });
    return matches.sort(function (a, b) { return a - b; });
  }

  function collectNamedList(form, prefix, builder) {
    var indexes = getListIndexes(form, prefix);
    if (!indexes.length) return [];
    return indexes.map(function (index) {
      return builder(index);
    }).filter(function (item) {
      return !!item;
    });
  }

  function createListItemMarkup(listName, index) {
    if (listName === "players") {
      return [
        '<label>Player ' + index + ' Name<input type="text" name="player' + index + 'Name"></label>',
        '<label>Player ' + index + ' Role<input type="text" name="player' + index + 'Role"></label>',
        '<label>Player ' + index + ' Photo<input type="text" name="player' + index + 'Photo"><input type="file" class="media-upload" accept="image/*" data-target="player' + index + 'Photo"></label>',
        '<label style="grid-column: 1 / -1;">Player ' + index + ' Bio<textarea name="player' + index + 'Bio"></textarea></label>'
      ].join('');
    }

    if (listName === "faq") {
      return [
        '<label>FAQ ' + index + ' Question<input type="text" name="faq' + index + 'Question"></label>',
        '<label>FAQ ' + index + ' Answer<textarea name="faq' + index + 'Answer"></textarea></label>'
      ].join('');
    }

    return [
      '<label>Gallery ' + index + ' Image<input type="text" name="gallery' + index + 'Src"><input type="file" class="media-upload" accept="image/*" data-target="gallery' + index + 'Src"></label>',
      '<label>Gallery ' + index + ' Alt Text<input type="text" name="gallery' + index + 'Alt"></label>'
    ].join('');
  }

  function appendListItem(button) {
    var listName = button.dataset.list;
    var container = document.querySelector('[data-list-container="' + listName + '"]');
    if (!container) return;

    var prefix = listName === "players" ? "player" : listName === "faq" ? "faq" : "gallery";
    var indexes = getListIndexes(document.getElementById("editorForm"), prefix);
    var nextIndex = indexes.length ? Math.max.apply(null, indexes) + 1 : 1;
    container.insertAdjacentHTML("beforeend", createListItemMarkup(listName, nextIndex));
    bindMediaUploads();
  }

  function removeLastListItem(button) {
    var listName = button.dataset.list;
    var container = document.querySelector('[data-list-container="' + listName + '"]');
    if (!container) return;
    var count = listName === "players" ? 4 : 2;
    for (var i = 0; i < count; i += 1) {
      var lastChild = container.lastElementChild;
      if (!lastChild) break;
      container.removeChild(lastChild);
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

    data.teamMembers = collectNamedList(form, "player", function (index) {
      var name = entries.get("player" + index + "Name");
      var role = entries.get("player" + index + "Role");
      var bio = entries.get("player" + index + "Bio");
      var photo = entries.get("player" + index + "Photo");
      if (!name && !role && !bio && !photo) return null;
      return {
        name: name || "[ Player Name ]",
        role: role || "[ Position / No. ]",
        bio: bio || "[ Mini bio placeholder text goes here. ]",
        photo: photo || "img/volleyball.png"
      };
    });

    data.galleryImages = collectNamedList(form, "gallery", function (index) {
      var src = entries.get("gallery" + index + "Src");
      var alt = entries.get("gallery" + index + "Alt");
      if (!src && !alt) return null;
      return {
        src: src || "img/volleyball.png",
        alt: alt || "[ Image ]"
      };
    });

    data.faqItems = collectNamedList(form, "faq", function (index) {
      var question = entries.get("faq" + index + "Question");
      var answer = entries.get("faq" + index + "Answer");
      if (!question && !answer) return null;
      return {
        question: question || "[ Question placeholder ]",
        answer: answer || "[ Answer placeholder text goes here. ]"
      };
    });

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

  async function parseJsonResponse(response) {
    var contentType = response.headers.get("content-type") || "";
    if (contentType.indexOf("application/json") !== -1) {
      return response.json();
    }

    var text = await response.text();
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(text.replace(/\s+/g, " ").substring(0, 180) || "Request failed.");
    }
  }

  async function uploadMediaFile(file, targetName) {
    var status = document.getElementById("saveMessage");
    if (!file) {
      status.textContent = "Choose a file first.";
      status.classList.add("error");
      return;
    }

    var formData = new FormData();
    formData.append("file", file);

    status.textContent = "Uploading...";
    status.classList.remove("error");

    try {
      var response = await fetchJson("/api/upload", {
        method: "POST",
        body: formData
      });
      var result = await parseJsonResponse(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Upload failed.");
      }

      var targetField = document.querySelector('[name="' + targetName + '"]');
      if (targetField) {
        targetField.value = result.url;
      }

      status.textContent = "Uploaded successfully.";
    } catch (error) {
      status.textContent = error.message || "Upload failed.";
      status.classList.add("error");
    }
  }

  function bindMediaUploads() {
    var uploads = document.querySelectorAll(".media-upload");
    uploads.forEach(function (input) {
      input.onchange = function () {
        if (!input.files || !input.files.length) return;
        uploadMediaFile(input.files[0], input.dataset.target);
      };
    });
  }

  async function publishChanges(form) {
    var data = readForm(form);
    saveStored(data);

    var response = await fetchJson("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    var result = await parseJsonResponse(response);
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

      var result = await parseJsonResponse(response);
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Login failed.");
      }

      message.textContent = "";
      hydrateForm(document.getElementById("editorForm"), getStored());
      bindMediaUploads();
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
    var logoutButton = document.getElementById("logoutButton");

    if (isAuthenticated()) {
      hydrateForm(editorForm, getStored());
      bindMediaUploads();
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

    document.querySelectorAll(".add-list-item").forEach(function (button) {
      button.addEventListener("click", function () {
        appendListItem(button);
      });
    });

    document.querySelectorAll(".remove-list-item").forEach(function (button) {
      button.addEventListener("click", function () {
        removeLastListItem(button);
      });
    });

    logoutButton.addEventListener("click", handleLogout);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
