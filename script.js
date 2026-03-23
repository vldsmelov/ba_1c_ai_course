const printButtons = [
  document.getElementById("print-button"),
  document.getElementById("print-button-secondary")
].filter(Boolean);

for (const button of printButtons) {
  button.addEventListener("click", () => window.print());
}

for (const control of document.querySelectorAll("[data-scroll]")) {
  control.addEventListener("click", () => {
    const selector = control.getAttribute("data-scroll");
    const target = selector ? document.querySelector(selector) : null;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

const requestForm = document.getElementById("request-form");
const formResponse = document.getElementById("form-response");

if (requestForm && formResponse) {
  requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formResponse.hidden = false;
    formResponse.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}
