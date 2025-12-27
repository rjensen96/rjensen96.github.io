window.onload = () => {
  prefill();
  render();
};

function prefill() {
  document.getElementById("radius").value = 60;
  document.getElementById("angle").value = 40;
  document.getElementById("height").value = 100;
}

function getParams() {
  const angle = Number(document.getElementById("angle").value);
  const height = Number(document.getElementById("height").value);
  const radius = Number(document.getElementById("radius").value);
  return { angle, height, radius };
}

function render() {
  console.log("rendered");
  const { angle, height, radius } = getParams();
  const svg = getSvg(angle, height, radius);
  const testSvg = geminiSvg();
  console.log("svg", svg);
  const curve = document.getElementById("curve");
  curve.innerHTML = svg;
  curve.innerHTML = testSvg;
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

function getPointOnAngle(fromX, fromY, angle, height) {
  const runX = height / Math.abs(Math.tan(angle));
  return getPoint(fromX + runX, fromY - height);
}

function getSvg(angle, height, radius) {
  const baseX = 50;
  const baseY = 150;
  const runLen = 150;

  const p1 = getPoint(baseX, baseY);
  const p2 = getPoint(baseX + runLen, baseY);

  console.log("p1", p1.str());
  console.log("p2", p2.str());
  const p3 = getPointOnAngle(p2.x, p2.y, angle, height);
  const midpoint = getPoint((p2.x + p3.x) / 2, (p2.y + p3.y) / 2);
  console.log("midpoint", midpoint.str());
  console.log("p3", p3.str());
  const control1 = getPoint(p2.x + radius * 0.5, p2.y); // bottom curve anchor
  const control2 = getPoint(p3.x + radius * 0.5, p3.y); // top curve anchor

  const p4 = getPoint(p3.x + runLen, p3.y);

  // ${p3.str()} ${control2.str()} ${p4.str()}
  return `
    <svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d=" M ${p1.str()} 
            L ${p2.str()} 
            C ${control1.str()}, ${midpoint.str()}, ${midpoint.str()}
            S ${p3.str()}, ${control2.str()}
            L ${p4.str()}
               
          "
        fill="none"
        stroke="black"
        stroke-width="2"
      />
    </svg>
  `;
}

function geminiSvg() {
  return `<svg width="500" height="250" viewBox="0 0 500 250" xmlns="http://www.w3.org/2000/svg">
  <path d="M 50 150 L 200 150
           C 250 150, 300 100, 300 100
           S 350 50, 400 50
           L 500 50" 
        fill="none" stroke="black" stroke-width="2" />
</svg>`;
}
