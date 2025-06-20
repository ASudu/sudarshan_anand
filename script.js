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

// === ROTATING GROUP with CIRCLE, PHOTO, and SPOKES ===
const rotatingG = svg.append("g")
  .attr("id", "spokesGroup")
  .attr("transform", `translate(${centerX}, ${centerY})`);

// Central green circle (attached to spokes)
rotatingG.append("circle")
  .attr("r", 60)
  .attr("fill", "rgba(127, 255, 249, 1)");

// Circular profile photo slightly offset for style
rotatingG.append("clipPath")
  .attr("id", "profileClip")
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 60);

rotatingG.append("image")
  .attr("xlink:href", "assets/images/sudarshan_profile.svg")
  .attr("x", -60)
  .attr("y", -60)
  .attr("width", 120)
  .attr("height", 120)
  .attr("clip-path", "url(#profileClip)")
  .attr("class", "profile-img")
  .attr("preserveAspectRatio", "xMidYMid slice");

// === SPOKES ===
const spokeLength = 160;
const labelGap = 30;

const spokes = rotatingG.selectAll("line")
  .data(tabs)
  .join("line")
  .attr("stroke", "rgba(127, 255, 249, 1)")
  .attr("stroke-width", 2);

// === LABELS OUTSIDE ROTATION ===
const labelsG = svg.append("g").attr("id", "labelsGroup");

// Set font color
svg.select("style").remove();
svg.append("style").text(`
  .tab-text {
    fill: rgba(127, 255, 249, 1);
    font-size: 1rem;
    transition: transform 0.3s;
  }

  .tab-text:hover {
    font-weight: bold;
    transform: scale(1.2);
  }

  .profile-img {
    filter: drop-shadow(0 0 8px rgba(127, 255, 249, 1));
  }
`);

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

// === POSITIONING ===
let currentRotation = 0;

function positionTabs(rotation = 0) {
  const angleStep = (2 * Math.PI) / tabs.length;

  tabs.forEach((d, i) => {
    const angle = i * angleStep + rotation;
    d.angle = angle;
    d.x = centerX + Math.cos(angle) * (spokeLength + labelGap);
    d.y = centerY + Math.sin(angle) * (spokeLength + labelGap);
    d.labelAngle = angle;
  });

  spokes
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", d => Math.cos(d.angle) * spokeLength)
    .attr("y2", d => Math.sin(d.angle) * spokeLength);

  tabLabels
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("transform", d => {
      const deg = (d.labelAngle * 180) / Math.PI;
      return `rotate(${-deg},${d.x},${d.y})`;
    });
}

function rotateToTab(selectedTab) {
  const angleStep = (2 * Math.PI) / tabs.length;
  const tabIndex = tabs.findIndex(t => t.id === selectedTab.id);
  const tabAngle = tabIndex * angleStep + currentRotation;
  const desiredAngle = Math.PI; // want tab to align on left (180deg)

  const delta = desiredAngle - tabAngle;
  const startRotation = currentRotation;
  const endRotation = currentRotation + delta;

  rotatingG.transition()
    .duration(1000)
    .attrTween("transform", function () {
      return function (t) {
        const rot = startRotation + (endRotation - startRotation) * t;
        return `translate(${centerX}, ${centerY}) rotate(${(rot * 180) / Math.PI})`;
      };
    });

  d3.transition()
    .duration(1000)
    .tween("labelTween", () => {
      return function (t) {
        const rot = startRotation + (endRotation - startRotation) * t;
        positionTabs(rot);
      };
    });

  currentRotation = endRotation;
}

// Initial draw
positionTabs(currentRotation);