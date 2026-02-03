// Mobile menu
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle?.addEventListener("click", () => {
  nav.classList.toggle("nav--open");
});

// Close menu when clicking a link (mobile)
document.querySelectorAll(".nav__link").forEach(link => {
  link.addEventListener("click", () => nav.classList.remove("nav--open"));
});

// Current year
document.getElementById("year").textContent = new Date().getFullYear();

// Quote form (simple validation + "mailto" fallback)
const form = document.getElementById("quoteForm");
const note = document.getElementById("formNote");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const name = data.get("name")?.toString().trim();
  const email = data.get("email")?.toString().trim();
  const phone = data.get("phone")?.toString().trim();
  const address = data.get("address")?.toString().trim();
  const service = data.get("service")?.toString().trim();

  if (!name || !email || !phone || !address || !service) {
    note.textContent = "Please fill out all fields.";
    note.style.color = "#ffd166";
    return;
  }

  note.textContent = "✅ Ready! Opening your email to send the request...";
  note.style.color = "#9ef0b6";

  // Change this email to your friend's business email
  const to = "greencut@example.com";
  const subject = encodeURIComponent("New Quote Request - Lawn Care");
  const body = encodeURIComponent(
`Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Service Needed:
${service}`
  );

  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

  // Reset after a moment
  setTimeout(() => form.reset(), 600);
});
