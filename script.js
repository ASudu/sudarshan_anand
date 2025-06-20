const spokes = document.querySelectorAll(".spoke");
let currentAngle = 0;

function angleOf(tab) {
  return parseFloat(tab.style.getPropertyValue("--angle"));
}

function rotateTo(targetAngle) {
  const offset = 180 - targetAngle; // bring selected tab to pi (180 deg)
  currentAngle += offset;

  document.querySelector(".spoke-system").style.transform = `rotate(${currentAngle}deg)`;

  spokes.forEach(spoke => {
    const angle = angleOf(spoke);
    spoke.style.setProperty("--angle", `${(angle + offset + 360) % 360}deg`);
    spoke.classList.remove("active");
  });
}

spokes.forEach(spoke => {
  spoke.addEventListener("click", () => {
    rotateTo(angleOf(spoke));
    spoke.classList.add("active");
  });

  // Apply hover effects via CSS only
});

// Set default active tab to Home
document.querySelector(".spoke[data-tab='Home']").classList.add("active");