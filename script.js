// GreenCut multi-page
// Menú móvil + año + formulario mailto

const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

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

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

    const to = "greencut@example.com"; // Cambia al correo real del cliente
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
