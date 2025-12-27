function setup() {
  createCanvas(600, 400);
  angleMode(DEGREES); // Makes math much more intuitive
  noFill();
  strokeWeight(2);
  stroke(90, 50, 20); // Dark "Mahogany" wood color

  // temp : prefill form values
  document.getElementById("radius").value = 60;
  document.getElementById("angle").value = 40;
  document.getElementById("height").value = 100;
}

function getParams() {
  const degrees = Number(document.getElementById("angle").value);
  const inverseDegrees = 90 - degrees;
  const height = Number(document.getElementById("height").value);
  const radius = Number(document.getElementById("radius").value);
  return { degrees, inverseDegrees, height, radius };
}

function draw() {
  clear();

  const { degrees, height, radius } = getParams();

  const baseY = 300;
  const baseX = 50;
  const topY = baseY - height;

  const b1x = baseX + 100;
  const b1y = baseY;

  const b2x = b1x + height / tan(degrees);

  bezier(b1x, b1y, b1x + radius, b1y, b2x - radius, topY, b2x, topY);

  line(baseX, baseY, b1x, baseY);
  line(b2x, topY, b2x + 100, topY);
}
