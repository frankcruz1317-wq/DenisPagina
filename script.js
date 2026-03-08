const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
}

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const form = document.getElementById("quoteForm");
const note = document.getElementById("formNote");

function setNote(text, type = "ok") {
  if (!note) return;
  note.textContent = text;
  if (type === "warn") note.style.color = "#b45f06";
  if (type === "ok") note.style.color = "#2f7a4f";
  if (type === "error") note.style.color = "#a61b1b";
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

    setNote("Listo. Abriendo tu correo para enviar la solicitud...", "ok");

    const to = "greencut@example.com";
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
