var toggle = document.getElementById("dark-mode-toggle");
var darkTheme = document.getElementById("dark-mode-theme");

// the default theme is light
var savedTheme = localStorage.getItem("dark-mode-storage") || "light";
setTheme(savedTheme);

toggle.addEventListener("click", () => {
  if (toggle.className === "far fa-moon") {
    setTheme("dark");
  } else if (toggle.className === "far fa-sun") {
    setTheme("light");
  }
});

function setTheme(mode) {
  localStorage.setItem("dark-mode-storage", mode);

  if (mode === "dark") {
    darkTheme.disabled = false;
    toggle.className = "far fa-sun";
    toggle.title = "Enable Light Mode";
  } else if (mode === "light") {
    darkTheme.disabled = true;
    toggle.className = "far fa-moon";
    toggle.title = "Enable Dark Mode";
  }
}