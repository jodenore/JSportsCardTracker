export function handleThemeSwitcher() {
  const toggler = document.querySelector("#theme-toggle");
  const togglerIcon = toggler.querySelector("i");
  const body = document.body;
  if (!toggler || !togglerIcon) return;
  const theme = document.documentElement;

  const getThemeIcon = () => {
    const isLight = theme.dataset.bsTheme === "light";
    togglerIcon.classList.toggle("fa-moon", isLight);
    togglerIcon.classList.toggle("fa-circle-half-stroke", !isLight);
  };

  getThemeIcon();

  toggler.addEventListener("click", () => {
    const isLight = theme.dataset.bsTheme === "light";
    theme.dataset.bsTheme = isLight ? "dark" : "light";

    getThemeIcon();
  });
}
