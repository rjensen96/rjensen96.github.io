function setup() {
  createCanvas(600, 400);
  angleMode(DEGREES); // Makes math much more intuitive
  noFill();
  strokeWeight(4);
  stroke(90, 50, 20); // Dark "Mahogany" wood color

  // temp : prefill form values
  document.getElementById("angle").value = 60;
  document.getElementById("height").value = 100;
  document.getElementById("radius").value = 50;
}

function draw() {
  background(245);

  const degrees = Number(document.getElementById("angle").value);
  const inverseDegrees = 90 - degrees;
  const height = Number(document.getElementById("height").value);
  const r = Number(document.getElementById("radius").value);

  // --- Cloud Lift Parameters ---
  const base_y = 250; // The y-level of the bottom horizontal lines
  const top_y = base_y - height; // The y-level of the top horizontal line

  const center_flat_width = 100; // Width of the flat top part
  const center_x = width / 2;

  // Calculate the start and end points of the curved sections
  const left_curve_start_x = 150;
  const left_curve_end_x = center_x - center_flat_width / 2;

  // --- Draw the pieces ---

  // 1. Left-side bottom line
  line(0, base_y, left_curve_start_x, base_y);

  // 2. Bottom arc
  // This curve goes from (left_curve_start_x, base_y) to (left_curve_end_x, top_y)
  const left_arc_center_x = left_curve_start_x;
  const left_arc_center_y = base_y - r;
  arc(left_arc_center_x, left_arc_center_y, 2 * r, 2 * r, inverseDegrees, 90);

  const runLength = arcRunLength(inverseDegrees, r);

  // 3. Top center line
  const top_line_start_x = left_curve_end_x + runLength;
  line(top_line_start_x, top_y, top_line_start_x + 100, top_y);

  // 2. top arc
  const top_arc_center_x = left_curve_end_x;
  const top_arc_center_y = top_y + r;
  arc(
    top_line_start_x,
    top_arc_center_y,
    2 * r,
    2 * r,
    180 + inverseDegrees,
    270
  );

  // 3. Straight connector
  const connector_begin_x =
    left_curve_start_x + arcRunLength(inverseDegrees, r);
  const connector_begin_y = base_y - arcRiseLength(inverseDegrees, r);
  const connector_end_x = top_arc_center_x - arcRunLength(inverseDegrees, r);
  const connector_end_y = top_y + arcRiseLength(inverseDegrees, r);
  line(connector_begin_x, connector_begin_y, connector_end_x, connector_end_y);
}

// todo - test this crap to see if it gives the correct points
function arcHypotenuseLength(degrees, radius) {
  return 2 * radius * sin(degrees * 0.5);
}
function arcRunLength(degrees, radius) {
  return cos(degrees) * arcHypotenuseLength(degrees, radius);
}

function arcRiseLength(degrees, radius) {
  return sin(degrees) * arcHypotenuseLength(degrees, radius);
}
