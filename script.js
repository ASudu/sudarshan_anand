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

const g = svg.append("g")
  .attr("transform", `translate(${centerX}, ${centerY})`)
  .attr("id", "mapGroup");

// Add spokes (lines)
const spokes = g.selectAll("line")
  .data(tabs)
  .join("line")
  .attr("stroke", "rgba(127, 255, 249, 1)")
  .attr("stroke-width", 2);

// Tab labels
const tabLabels = g.selectAll("text")
  .data(tabs)
  .join("text")
  .text(d => d.id)
  .attr("class", "tab-text")
  .attr("text-anchor", "middle")
  .on("mouseover", function () {
    d3.select(this).attr("font-weight", "bold");
  })
  .on("mouseout", function () {
    d3.select(this).attr("font-weight", "normal");
  })
  .on("click", function (event, d, i) {
    rotateToTab(d);
    document.getElementById("tab-content").innerText = d.content;
  });

// Profile image at center, cropped to a circle using a clipPath
g.append("clipPath")
  .attr("id", "profileClip")
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 60);

g.append("svg:image")
  .attr("xlink:href", "assets/images/sudarshan.svg")
  .attr("x", -60)
  .attr("y", -60)
  .attr("width", 120)
  .attr("height", 120)
  .attr("class", "profile-img")
  .attr("clip-path", "url(#profileClip)");

// Initial layout
function positionTabs(rotation = 0) {
  const angleStep = (2 * Math.PI) / tabs.length;

  tabLabels.each(function (d, i) {
    const angle = i * angleStep + rotation;
    const x = Math.cos(angle) * 180;
    const y = Math.sin(angle) * 180;
    d.x = x;
    d.y = y;
    d.angle = angle;

    d3.select(this)
      .attr("x", x)
      .attr("y", y);
  });

  spokes
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", d => d.x)
    .attr("y2", d => d.y);
}

let currentRotation = 0;

function rotateToTab(selectedTab) {
  const targetAngle = Math.atan2(selectedTab.y, selectedTab.x);
  const desiredAngle = Math.PI; // Left direction
  const delta = desiredAngle - targetAngle;

  currentRotation += delta;

  g.transition()
    .duration(1000)
    .attr("transform", `translate(${centerX}, ${centerY}) rotate(${(currentRotation * 180) / Math.PI})`);
}

positionTabs();