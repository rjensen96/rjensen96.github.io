window.onload = () => {
  prefill();
  render();
};

function prefill() {
  document.getElementById("radius").value = 1.5;
  document.getElementById("angle").value = 65;
  document.getElementById("height").value = 1;
}

function getParams() {
  const angle = Number(document.getElementById("angle").value);
  const height = Number(document.getElementById("height").value);
  const radius = Number(document.getElementById("radius").value);
  return { angle, height, radius };
}

function render() {
  const { angle, height, radius } = getParams();
  const svg = getSvg(angle, height, radius);
  console.log("svg", svg);
  const curve = document.getElementById("curve");
  curve.innerHTML = svg;
}

function getPoint(x, y) {
  const roundX = parseFloat(x.toFixed(3));
  const roundY = parseFloat(y.toFixed(3));
  return {
    x,
    y,
    str() {
      return `${roundX} ${roundY}`;
    },
  };
}

function getXRunOfRadius(angle, height) {
  const angleInRadians = (angle * Math.PI) / 180;
  return height * Math.sin(angleInRadians);
}

function getPointOnAngle(fromX, fromY, angle, height) {
  const invertedAngle = Math.abs(90 - angle);
  const angleInRadians = (invertedAngle * Math.PI) / 180;
  const runX = height * Math.tan(angleInRadians);
  const runXOfRadius = getXRunOfRadius(invertedAngle, height);
  return getPoint(fromX + runX + runXOfRadius, fromY - height);
}

function getSvg(angle, height, radius) {
  const baseX = 1.0;
  const baseY = 2.5;
  const runLen = 1.0;
  const halfRadius = radius / 2;

  const p1 = getPoint(baseX, baseY);
  const p2 = getPoint(baseX + runLen, baseY);
  const p3 = getPointOnAngle(p2.x + halfRadius, p2.y, angle, height);
  const p4 = getPoint(p3.x + runLen, p3.y);

  const controlP2 = getPoint(p2.x + halfRadius, p2.y);
  const controlP3 = getPoint(p3.x - halfRadius, p3.y);

  return `
    <svg
      width="6in"
      height="3in"
      viewBox="0 0 6 3.25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d=" M ${p1.str()} 
            L ${p2.str()} 
            C ${controlP2.str()}, ${controlP3.str()}, ${p3.str()}
            L ${p4.str()}
          "
        fill="none"
        stroke="black"
        stroke-width="0.02"
      />
    </svg>
  `;
}

function downloadSvg() {
  const { angle, height, radius } = getParams();
  const svgContent = getSvg(angle, height, radius);
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cloud-lift.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// doesn't work yet.
function copySvg() {
  const { angle, height, radius } = getParams();
  const svgContent = getSvg(angle, height, radius);

  // Create a blob for the image/svg+xml type
  const blob = new Blob([svgContent], { type: "image/svg+xml" });

  // Create a blob for the text/plain type
  const textBlob = new Blob([svgContent], { type: "text/plain" });

  const item = new ClipboardItem({
    "image/svg+xml": blob,
    "text/plain": textBlob,
  });

  navigator.clipboard.write([item]).then(
    () => {
      alert("SVG copied to clipboard!");
    },
    (err) => {
      console.error("Failed to copy SVG: ", err);
      alert("Failed to copy SVG. See console for details.");
    }
  );
}
