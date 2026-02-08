const form = document.getElementById("quoteForm");
const msg = document.getElementById("formMsg");

if(form){
  form.addEventListener("submit", e => {
    e.preventDefault();
    msg.textContent = "Gracias, te contactaremos pronto.";
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
