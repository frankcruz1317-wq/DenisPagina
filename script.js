// GreenCut v2 - Menú + Scroll (snap) + Form
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const page = document.getElementById("page");
const toggleSnapBtn = document.getElementById("toggleSnap");

function setSnapLabel(){
  if (!toggleSnapBtn) return;
  toggleSnapBtn.textContent = document.body.classList.contains("is-snap") ? "Modo: Snap" : "Modo: Normal";
}

// Mobile menu
if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

// Current year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll helper
function smoothTo(target){
  if (!target) return;
  const snapOn = document.body.classList.contains("is-snap");
  if (snapOn && page) {
    page.scrollTo({ top: target.offsetTop, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    smoothTo(target);
  });
});

// Toggle snap mode
if (toggleSnapBtn) {
  toggleSnapBtn.addEventListener("click", () => {
    document.body.classList.toggle("is-snap");
    setSnapLabel();
  });
  setSnapLabel();
}

// Quote form (mailto)
const form = document.getElementById("quoteForm");
const note = document.getElementById("formNote");

function setNote(text, type = "ok") {
  if (!note) return;
  note.textContent = text;
  if (type === "warn") note.style.color = "#ffd166";
  if (type === "ok") note.style.color = "#9ef0b6";
  if (type === "error") note.style.color = "#ff6b6b";
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const phone = (data.get("phone") || "").toString().trim();
    const address = (data.get("address") || "").toString().trim();
    const service = (data.get("service") || "").toString().trim();

    if (!name || !email || !phone || !address || !service) {
      setNote("Porfa llená todos los campos.", "warn");
      return;
    }

    setNote("✅ Listo! Abriendo tu correo para enviar la solicitud...", "ok");

    const to = "greencut@example.com"; // Cambia al correo real
    const subject = encodeURIComponent("Nueva cotización - Lawn Care");
    const body = encodeURIComponent(
`Nombre: ${name}
Correo: ${email}
Teléfono: ${phone}
Dirección: ${address}

Servicio:
${service}`
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setTimeout(() => form.reset(), 700);
  });
}

