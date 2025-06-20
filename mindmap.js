const width = window.innerWidth;
const height = window.innerHeight;

const nodes = [
  { id: "Me", fx: width / 2, fy: height / 2, img: "assets/images/sudarshan.jpg" },
  { id: "About Me", url: "about.html" },
  { id: "Projects", url: "projects.html" },
  { id: "Publications", url: "publications.html" },
  { id: "Blog", url: "blog.html" },
  { id: "Contact", url: "contact.html" }
];

const links = nodes.slice(1).map(n => ({ source: "Me", target: n.id }));

const svg = d3.select("svg")
  .attr("viewBox", [0, 0, width, height]);

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-400))
  .force("center", d3.forceCenter(width / 2, height / 2));

const link = svg.append("g")
  .attr("stroke", "#888")
  .attr("stroke-opacity", 0.5)
  .selectAll("line")
  .data(links)
  .join("line")
  .attr("stroke-width", 2);

const node = svg.append("g")
  .selectAll("g")
  .data(nodes)
  .join("g")
  .style("cursor", d => d.url ? "pointer" : "default")
  .on("click", (event, d) => {
    if (d.url) window.location.href = d.url;
  });

node.append("circle")
  .attr("r", d => d.id === "Me" ? 40 : 25)
  .attr("fill", d => d.id === "Me" ? "#ffffff" : "#aad8ff")
  .attr("stroke", "#333")
  .attr("stroke-width", 2);

node.filter(d => d.id === "Me")
  .append("image")
  .attr("xlink:href", d => d.img)
  .attr("x", -30)
  .attr("y", -30)
  .attr("width", 60)
  .attr("height", 60)
  .attr("clip-path", "circle(30px at center)");

node.append("text")
  .attr("dy", d => d.id === "Me" ? 60 : 35)
  .attr("text-anchor", "middle")
  .text(d => d.id);

simulation.on("tick", () => {
  link
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);

  node.attr("transform", d => `translate(${d.x},${d.y})`);
});