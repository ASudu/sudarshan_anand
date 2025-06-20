const rotatable = document.getElementById("rotatable");
const tabs = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  const angle = tab.getAttribute("data-angle");
  tab.style.setProperty("--angle", `${angle}deg`);
  tab.style.transform = `rotate(${angle}deg) translateX(150px) rotate(-${angle}deg)`;
});

function rotateTo(angle) {
  const rotation = 180 - angle; // bring to pi
  rotatable.style.transform = `rotate(${rotation}deg)`;

  tabs.forEach(tab => {
    const tabAngle = parseFloat(tab.getAttribute("data-angle"));
    const newAngle = (tabAngle + rotation + 360) % 360;
    tab.style.setProperty("--angle", `${newAngle}deg`);
    tab.style.transform = `rotate(${newAngle}deg) translateX(150px) rotate(-${newAngle}deg)`;
    tab.classList.remove("active");
  });
}

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const angle = parseFloat(tab.getAttribute("data-angle"));
    rotateTo(angle);
    tab.classList.add("active");
  });
});

// Set "Home" active by default
const homeTab = document.querySelector(".tab[data-angle='180']");
homeTab.classList.add("active");