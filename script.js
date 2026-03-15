const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  });
}

const quoteForm = document.getElementById("quoteForm");
const formNote = document.getElementById("formNote");

if (quoteForm) {
  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(quoteForm);
    const name = formData.get("name") || "";
    const email = formData.get("email") || "";
    const phone = formData.get("phone") || "";
    const address = formData.get("address") || "";
    const service = formData.get("service") || "";

    const subject = encodeURIComponent("New Quote Request - Ariana's Lawn Care");
    const body = encodeURIComponent(
`Name: ${name}

Email: ${email}

Phone: ${phone}

Address: ${address}

Service Needed:
${service}`
    );

    window.location.href = `mailto:hardscapeandco@gmail.com?subject=${subject}&body=${body}`;

    if (formNote) {
      formNote.textContent = "Tu aplicación de correo se abrirá para enviar la cotización.";
    }
  });
}
