(() => {
  "use strict";
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navMenu");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }
  const video = document.querySelector(".hero-video-bg");
  const pause = document.getElementById("videoToggle");
  if (video && pause) {
    pause.hidden = false;
    const update = () => { pause.textContent = video.paused ? "Play background" : "Pause background"; };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
    pause.addEventListener("click", () => {
      if (video.paused) video.play().catch(() => { pause.textContent = "Video unavailable"; });
      else video.pause();
    });
    video.addEventListener("play", update);
    video.addEventListener("pause", update);
    update();
  }
  const planner = document.getElementById("seasonPlanner");
  if (planner) {
    const advice = document.getElementById("plannerAdvice");
    const adviceByService = {
      "Leaf removal": "Tell us where leaves collect: lawn, driveway, paths or planting beds.",
      "Fall yard cleanup": "A good fit when leaves, branches and garden beds all need attention.",
      "Gutter cleaning": "Include the number of stories and any access restrictions in your request."
    };
    const update = () => {
      const selected = planner.querySelector('input[name="service"]:checked');
      advice.textContent = selected ? adviceByService[selected.value] : "Choose a seasonal service to start your request.";
    };
    planner.addEventListener("change", update);
    update();
  }
  const form = document.getElementById("quoteForm");
  if (!form || !window.QuoteRules) return;
  const rules = window.QuoteRules;
  const byId = id => document.getElementById(id);
  const button = byId("sendQuote");
  const review = byId("quoteReview");
  const reviewDetails = byId("reviewDetails");
  const note = byId("formNote");
  const addressIds = ["street", "unit", "city", "state", "zip"];
  let reviewed = false;
  button.textContent = "Review my request";
  const address = () => Object.fromEntries(addressIds.map(id => [id, byId(id).value]));
  const invalidateReview = () => {
    reviewed = false;
    review.hidden = true;
    button.textContent = "Review my request";
    note.textContent = "";
  };
  function validate() {
    const errors = rules.addressErrors(address());
    for (const id of addressIds) byId(id).setCustomValidity(errors[id] || "");
    byId("customerPhone").setCustomValidity(rules.phoneValid(byId("customerPhone").value) ? "" : "Enter a 10-digit phone number, with an optional +1 country code.");
    byId("customerName").setCustomValidity(rules.clean(byId("customerName").value).length >= 2 ? "" : "Enter your name.");
    byId("jobDetails").setCustomValidity(rules.clean(byId("jobDetails").value).length >= 15 ? "" : "Please add at least 15 characters describing the work you need.");
    return form.checkValidity();
  }
  function updateAddress() {
    const a = address();
    const complete = Object.keys(rules.addressErrors(a)).length === 0;
    byId("addressPreview").textContent = complete ? rules.fullAddress(a) : "Include the house number, full street, city, state and ZIP code.";
  }
  form.addEventListener("input", event => {
    invalidateReview();
    if (addressIds.includes(event.target.id)) byId("addressConfirmed").checked = false;
    validate();
    updateAddress();
  });
  form.addEventListener("change", () => { invalidateReview(); validate(); updateAddress(); });
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("service");
  const requestedCity = params.get("city");
  const requestedScope = params.get("scope");
  if (rules.services.includes(requestedService)) byId("service").value = requestedService;
  if (rules.towns.includes(requestedCity)) { byId("city").value = requestedCity; byId("state").value = "PA"; }
  if (["Light leaf cover", "Heavy leaf cover", "Not sure yet"].includes(requestedScope)) byId("jobDetails").value = "Leaf conditions: " + requestedScope + ". ";
  byId("editQuote").addEventListener("click", () => { invalidateReview(); byId("street").focus(); });
  form.addEventListener("submit", event => {
    if (!validate()) { event.preventDefault(); form.reportValidity(); return; }
    const full = rules.fullAddress(address());
    byId("fullAddress").value = full;
    byId("mapLink").value = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(full);
    if (!reviewed) {
      event.preventDefault();
      reviewDetails.replaceChildren();
      const fields = [
        ["Name", rules.clean(byId("customerName").value)],
        ["Email", byId("customerEmail").value.trim()],
        ["Phone", byId("customerPhone").value.trim()],
        ["Service address", full],
        ["Service", byId("service").value],
        ["Timing", byId("timing").value],
        ["Job details", byId("jobDetails").value.trim()]
      ];
      for (const [label, value] of fields) {
        const term = document.createElement("dt");
        const detail = document.createElement("dd");
        term.textContent = label; detail.textContent = value;
        reviewDetails.append(term, detail);
      }
      review.hidden = false;
      reviewed = true;
      button.textContent = "Send quote request";
      note.textContent = "Review your details below. Your request has not been sent yet.";
      review.focus();
    } else {
      note.textContent = "Opening the secure submission page. Complete any verification shown there.";
    }
  });
  window.addEventListener("pageshow", () => { invalidateReview(); validate(); updateAddress(); });
  updateAddress();
})();


/* Progressive enhancement: links, details and form work without these controls. */
(() => {
  "use strict";
  function filters(id, items, category, initial, countId, noun) {
    const bar = document.getElementById(id);
    if (!bar) return;
    const buttons = [...bar.querySelectorAll("[data-filter]")];
    function select(value) {
      buttons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.filter === value)));
      items.forEach(item => { item.hidden = value !== "all" && !category(item).split(" ").includes(value); });
      const count = document.getElementById(countId);
      if (count) {
        const visible = items.filter(item => !item.hidden);
        const total = id === "galleryFilters" ? visible.reduce((sum, item) => sum + item.querySelectorAll(".gallery-open").length, 0) : visible.length;
        count.textContent = total + " " + noun + " shown";
      }
    }
    bar.hidden = false;
    buttons.forEach(button => button.addEventListener("click", () => select(button.dataset.filter)));
    select(initial);
  }
  filters("serviceFilters", [...document.querySelectorAll("[data-service-category]")], el => el.dataset.serviceCategory, "fall", "serviceCount", "services");
  filters("galleryFilters", [...document.querySelectorAll("[data-gallery-group]")], el => el.dataset.galleryGroup, "all", "galleryCount", "photos");
  const choices = document.getElementById("contactChoices");
  if (choices) {
    choices.hidden = false;
    const select = value => {
      choices.querySelectorAll("button").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.contact === value)));
      document.querySelectorAll("[data-contact-panel]").forEach(panel => { panel.hidden = panel.dataset.contactPanel !== value; });
    };
    choices.querySelectorAll("button").forEach(button => button.addEventListener("click", () => select(button.dataset.contact)));
    select("quote");
    document.querySelectorAll("[data-town]").forEach(link => {
      link.setAttribute("role", "button");
      link.addEventListener("click", event => {
        event.preventDefault();
        document.querySelectorAll("[data-town]").forEach(other => other.setAttribute("aria-pressed", String(other === link)));
        document.getElementById("localQuoteLink").href = link.href;
        document.getElementById("townStatus").textContent = "Selected: " + link.dataset.town + ", PA. Continue to add your full property address.";
      });
      link.addEventListener("keydown", event => { if (event.key === " ") { event.preventDefault(); link.click(); } });
    });
  }
  const dialog = document.getElementById("galleryDialog");
  if (dialog && typeof dialog.showModal === "function") {
    const links = [...document.querySelectorAll(".gallery-open")];
    let current = 0, active = [], opener = null;
    function show(index) {
      current = (index + active.length) % active.length;
      const photo = document.getElementById("expandedPhoto");
      photo.src = active[current].href;
      photo.alt = active[current].dataset.caption;
      document.getElementById("photoCaption").textContent = photo.alt;
      document.getElementById("photoPosition").textContent = (current + 1) + " / " + active.length;
    }
    links.forEach(link => link.addEventListener("click", event => {
      event.preventDefault();
      active = links.filter(item => !item.closest("[data-gallery-group]").hidden);
      opener = link;
      show(active.indexOf(link));
      dialog.showModal();
    }));
    document.getElementById("closePhoto").addEventListener("click", () => dialog.close());
    document.getElementById("previousPhoto").addEventListener("click", () => show(current - 1));
    document.getElementById("nextPhoto").addEventListener("click", () => show(current + 1));
    dialog.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); show(current + (event.key === "ArrowLeft" ? -1 : 1)); }
    });
    dialog.addEventListener("close", () => { if (opener) opener.focus(); });
  }
  const form = document.getElementById("quoteForm"), progress = document.getElementById("quoteProgress");
  if (form && progress) {
    progress.hidden = false;
    const update = () => {
      const groups = [...form.querySelectorAll("fieldset")];
      progress.textContent = groups.map((group, index) => {
        const fields = [...group.querySelectorAll("[required]")];
        const complete = fields.filter(field => field.type === "checkbox" ? field.checked : field.value.trim() && field.validity.valid).length;
        return ["Contact", "Address", "Job"][index] + " " + complete + "/" + fields.length;
      }).join("  ·  ");
    };
    form.addEventListener("input", update); form.addEventListener("change", update); window.addEventListener("pageshow", update); update();
  }
})();

