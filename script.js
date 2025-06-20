const width = window.innerWidth * 0.6;
const height = window.innerHeight;
const centerX = width / 2;
const centerY = height / 2;

const tabs = [
  { id: "About", content: "This is the About section." },
  { id: "Projects", content: "Here are my Projects." },
  { id: "Publications", content: "Publications go here." },
  { id: "Blog", content: "My personal blog and notes." },
  { id: "Contact", content: "Reach out to me via email or LinkedIn." }
];

const svg = d3.select("#mindmap");

// === STATIC CENTER GROUP ===
const staticG = svg.append("g")
  .attr("transform", `translate(${centerX}, ${centerY})`);

// Background circle
staticG.append("circle")
  .attr("r", 60)
  .attr("fill", "rgba(127, 255, 249, 1)");

// Profile image in circle, slightly offset for style
staticG.append("clipPath")
  .attr("id", "profileClip")
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 60);

staticG.append("image")
  .attr("xlink:href", "assets/images/sudarshan.jpg")
  .attr("x", -60)
  .attr("y", -60)
  .attr("width", 120)
  .attr("height", 120)
  .attr("clip-path", "url(#profileClip)")
  .attr("class", "profile-img");

// === ROTATING SPOKES GROUP ===
const rotatingG = svg.append("g")
  .attr("id", "spokesGroup")
  .attr("transform", `translate(${centerX}, ${centerY})`);

// Spokes
const spokes = rotatingG.selectAll("line")
  .data(tabs)
  .join("line")
  .attr("stroke", "rgba(127, 255, 249, 1)")
  .attr("stroke-width", 2);

// Static upright text group
const labelsG = svg.append("g").attr("id", "labelsGroup");

// Labels
const tabLabels = labelsG.selectAll("text")
  .data(tabs)
  .join("text")
  .text(d => d.id)
  .attr("class", "tab-text")
  .attr("text-anchor", "middle")
  .style("cursor", "pointer")
  .on("mouseover", function () {
    d3.select(this).attr("font-weight", "bold");
  })
  .on("mouseout", function () {
    d3.select(this).attr("font-weight", "normal");
  })
  .on("click", function (event, d) {
    rotateToTab(d);
    document.getElementById("tab-content").innerText = d.content;
  });

// === TAB POSITIONING ===
function positionTabs(rotation = 0) {
  const angleStep = (2 * Math.PI) / tabs.length;

  tabs.forEach((d, i) => {
    const angle = i * angleStep + rotation;
    d.angle = angle;
    d.x = centerX + Math.cos(angle) * 180;
    d.y = centerY + Math.sin(angle) * 180;
  });

  spokes
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", d => Math.cos(d.angle) * 180)
    .attr("y2", d => Math.sin(d.angle) * 180);

  tabLabels
    .attr("x", d => d.x)
    .attr("y", d => d.y);
}

let currentRotation = 0;

function rotateToTab(selectedTab) {
  const targetAngle = Math.atan2(selectedTab.y - centerY, selectedTab.x - centerX);
  const desiredAngle = Math.PI; // want tab to align on left
  const delta = desiredAngle - targetAngle;

  currentRotation += delta;

  // Animate spokes rotation
  rotatingG.transition()
    .duration(1000)
    .attr("transform", `translate(${centerX}, ${centerY}) rotate(${(currentRotation * 180) / Math.PI})`);

  // Animate labels repositioning (no rotation)
  d3.transition()
    .duration(1000)
    .tween("labelTween", () => {
      const interpolate = d3.interpolate(0, delta);
      return function (t) {
        positionTabs(currentRotation - delta + interpolate(t));
      };
    });
}

// Initial draw
positionTabs(currentRotation);