// Define a color scale for unique entity colors
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Data storage
let entities = [];
let connections = [];

// SVG dimensions and circle layout
const width = window.innerWidth * 0.7;
const height = window.innerHeight;
const radius = Math.min(width, height) / 2.5;

// Padding to place text outside the circle
const textPadding = 20;

// Initialize SVG
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const container = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Arrowhead marker for directed connections
svg.append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8) // Adjusted for better positioning
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#333");

// Render function
function render() {
    container.selectAll(".entity").remove();
    container.selectAll(".connection").remove();

    // Assign unique colors to entities
    const entityColors = {};
    entities.forEach((entity, i) => {
        entityColors[entity.id] = colorScale(i);
    });

    // Calculate angle and position entities on the circle
    const angleScale = d3.scaleLinear()
        .domain([0, entities.length])
        .range([0, 2 * Math.PI]);

    // Draw the inner circle (center circle) for reference
    container.append("circle")
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("stroke-width", 1);

    // Draw entities as text labels outside the circle boundary
    const entityNodes = container.selectAll(".entity")
        .data(entities)
        .enter()
        .append("text")
        .attr("class", "entity")
        .attr("x", (d, i) => (radius + textPadding) * Math.cos(angleScale(i) - Math.PI / 2))
        .attr("y", (d, i) => (radius + textPadding) * Math.sin(angleScale(i) - Math.PI / 2))
        .attr("text-anchor", d => {
            const angle = angleScale(entities.indexOf(d));
            return angle > Math.PI ? "end" : "start";
        })
        .attr("alignment-baseline", "middle")
        .text(d => d.id)
        .style("font-size", "25px")
        .style("fill", d => entityColors[d.id]);

    // Draw directed connections with adjusted paths and colors
    const connectionLines = container.selectAll(".connection")
        .data(connections)
        .enter()
        .append("path")
        .attr("class", "connection")
        .attr("d", d => {
            const sourceIndex = entities.findIndex(e => e.id === d.source);
            const targetIndex = entities.findIndex(e => e.id === d.target);
            if (sourceIndex === -1 || targetIndex === -1) return null;

            const sourceAngle = angleScale(sourceIndex) - Math.PI / 2;
            const targetAngle = angleScale(targetIndex) - Math.PI / 2;

            const sourceX = radius * Math.cos(sourceAngle);
            const sourceY = radius * Math.sin(sourceAngle);
            const targetX = radius * Math.cos(targetAngle);
            const targetY = radius * Math.sin(targetAngle);

            const curveOffset = 40; // Adjusted curve for less overlap

            return `M${sourceX},${sourceY} Q${curveOffset * Math.cos((sourceAngle + targetAngle) / 2)},${curveOffset * Math.sin((sourceAngle + targetAngle) / 2)} ${targetX},${targetY}`;
        })
        .attr("stroke", d => entityColors[d.source])
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
        .attr("marker-end", d => `url(#arrowhead-${d.source})`);

    // Add arrowhead marker for each color dynamically
    svg.select("defs").selectAll(".arrowhead").remove();
    Object.entries(entityColors).forEach(([entity, color]) => {
        svg.select("defs")
            .append("marker")
            .attr("class", "arrowhead")
            .attr("id", `arrowhead-${entity}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 8)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", color);
    });
}

// Submit data
function submitData() {
    const entityInput = document.getElementById("entity-input").value.trim();
    const connectionInput = document.getElementById("connection-input").value.trim();

    // Parse entities
    entities = entityInput.split("\n").map(e => ({ id: e.trim() })).filter(e => e.id);

    // Parse connections
    connections = connectionInput.split("\n").map(c => {
        const [source, target] = c.split("->").map(x => x.trim());
        return { source, target };
    }).filter(c => c.source && c.target);

    render();
}

// Export SVG as PNG
function exportPNG() {
    const svgElement = document.querySelector("svg");

    // Serialize the SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Convert the SVG string into an image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Set desired resolution multiplier (e.g., 2x for HD, 4x for 4K)
    const resolutionMultiplier = 4; // Change this value for higher quality
    const width = (svgElement.clientWidth || 800) * resolutionMultiplier;
    const height = (svgElement.clientHeight || 600) * resolutionMultiplier;

    // Set canvas size with higher resolution
    canvas.width = width;
    canvas.height = height;

    // Scale the canvas to match resolution multiplier
    ctx.scale(resolutionMultiplier, resolutionMultiplier);

    // Load the SVG into the Image element
    img.onload = function () {
        // Draw the SVG onto the canvas
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width / resolutionMultiplier, height / resolutionMultiplier);

        // Convert the canvas to a PNG blob
        canvas.toBlob(blob => {
            // Create a download link
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "visualization_hd.png";
            link.click();

            // Clean up the object URL
            URL.revokeObjectURL(link.href);
        }, "image/png");
    };

    // Set the SVG string as the image source
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
}


async function copyToClipboard() {
    const svg = document.querySelector('svg');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);

    // Create a canvas and draw the SVG on it
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 1920; // High resolution width
    canvas.height = 1080; // High resolution height
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    img.onload = async function () {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height); // White background
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Copy to Clipboard
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
                alert('Image copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy image:', err);
                alert('Failed to copy image. Please try again.');
            }
        });

        // Revoke object URL
        URL.revokeObjectURL(url);
    };

    img.src = url;
}






// Initialize with some default entities and connections
document.addEventListener("DOMContentLoaded", function () {
    // Set initial values in input fields for testing
    document.getElementById("entity-input").value = "A\nB\nC\nD";
    document.getElementById("connection-input").value = "A->B\nB->C\nC->D\nD->A\nA->C";

    // Render initial visualization
    submitData();
});
