const width = window.innerWidth * 0.6;
const height = window.innerHeight;
const centerX = width / 2;
const centerY = height / 2;

const tabs = [
  { id: "Home", content: "Hey,\n I'm Sudarshan Anand", angle: Math.PI },
  { id: "Projects", content: "Here are my Projects." , angle: (3/5) * Math.PI },
  { id: "Publications", content: "Publications go here.", angle: (1/5) * Math.PI },
  { id: "Blog", content: "My personal blog and notes.", angle: (9/5) * Math.PI },
  { id: "Contact", content: "Reach out to me via email or LinkedIn.", angle: (7/5) * Math.PI },
];

const svg = d3.select("#mindmap");

// ROTATING GROUP for spokes
const rotatingG = svg.append("g")
  .attr("id", "spokesGroup")
  .attr("transform", `translate(${centerX}, ${centerY})`);

const spokeLength = 160;
const labelGap = 20;

// Add spokes
const spokes = rotatingG.selectAll("line")
  .data(tabs)
  .join("line")
  .attr("stroke", "rgb(29, 255, 221)")
  .attr("stroke-width", 3);

// STATIC group for labels
const labelsG = svg.append("g").attr("id", "labelsGroup");

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
    const content = d.id === "Home" ? "Hey, I'm Sudarshan Anand" : d.content;
    document.getElementById("tab-content").innerText = content;

    tabLabels.attr("font-weight", t => (t.id === d.id ? "bold" : "normal"));
  })
  .attr("x", d => centerX + Math.cos(d.angle || 0) * (spokeLength + labelGap))
  .attr("y", d => centerY + Math.sin(d.angle || 0) * (spokeLength + labelGap));

// STATIC GROUP for center photo and circle
const staticG = svg.append("g")
  .attr("transform", `translate(${centerX}, ${centerY})`);

staticG.append("circle")
  .attr("r", 60)
  .attr("fill", "rgb(29, 255, 221)");

staticG.append("clipPath")
  .attr("id", "profileClip")
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 60);

staticG.append("image")
  .attr("xlink:href", "assets/images/sudarshan_profile.svg")
  .attr("x", -60)
  .attr("y", -60)
  .attr("width", 120)
  .attr("height", 120)
  .attr("clip-path", "url(#profileClip)")
  .attr("preserveAspectRatio", "xMidYMid meet");

// ==== Tab layout logic ====
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
      return `rotate(${-deg},${d.x},${d.y})`; // Ferris wheel upright
    });
}

function rotateToTab(selectedTab) {
  const angleStep = (2 * Math.PI) / tabs.length;
  const tabIndex = tabs.findIndex(t => t.id === selectedTab.id);
  const tabAngle = tabIndex * angleStep + currentRotation;
  const desiredAngle = Math.PI;

  let delta = desiredAngle - tabAngle;
  if (delta > 0) delta -= 2 * Math.PI; // Always rotate counterclockwise

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

// Initial layout
positionTabs(currentRotation);
rotateToTab(tabs[0]); // Set "Home" by default