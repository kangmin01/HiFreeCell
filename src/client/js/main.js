import "../scss/styles.scss";

const toggleBtn = document.getElementById("navbar_toggleBtn");
const nav = document.querySelector("nav");

toggleBtn.addEventListener("click", () => {
  nav.classList.toggle("active");
});
