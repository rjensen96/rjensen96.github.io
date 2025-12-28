window.onload = () => {
  prefill();
  render();
};

function prefill() {
  document.getElementById("radius").value = 100;
  document.getElementById("angle").value = 65;
  document.getElementById("height").value = 75;
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
  const curve = document.getElementById("curve");
  curve.innerHTML = svg;
}

function getPoint(x, y) {
  return {
    x,
    y,
    str() {
      return `${x} ${y}`;
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
  const baseX = 50;
  const baseY = 250;
  const runLen = 150;

  const p1 = getPoint(baseX, baseY);
  const p2 = getPoint(baseX + runLen, baseY);
  const p3 = getPointOnAngle(p2.x + radius, p2.y, angle, height);
  const p4 = getPoint(p3.x + runLen, p3.y);

  const controlP2 = getPoint(p2.x + radius, p2.y);
  const controlP3 = getPoint(p3.x - radius, p3.y);

  return `
    <svg
      width="600"
      height="600"
      viewBox="0 0 600 600"
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
        stroke-width="2"
      />
    </svg>
  `;
}
