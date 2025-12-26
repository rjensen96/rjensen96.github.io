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
  let top_y = base_y - height; // The y-level of the top horizontal line

  let center_flat_width = 100; // Width of the flat top part
  let center_x = width / 2;

  // Calculate the start and end points of the curved sections
  // let left_curve_start_x = center_x - center_flat_width / 2 - 2 * r;
  let left_curve_start_x = 150;
  let left_curve_end_x = center_x - center_flat_width / 2;

  let right_curve_start_x = center_x + center_flat_width / 2;

  // --- Draw the pieces ---

  // 1. Left-side bottom line
  line(0, base_y, left_curve_start_x, base_y);

  // 2. Left-side "S" curve (two arcs)
  // This curve goes from (left_curve_start_x, base_y) to (left_curve_end_x, top_y)
  let left_arc1_center_x = left_curve_start_x;
  let left_arc1_center_y = base_y - r;
  arc(left_arc1_center_x, left_arc1_center_y, 2 * r, 2 * r, inverseDegrees, 90);

  let left_arc2_center_x = left_curve_end_x;
  let left_arc2_center_y = top_y + r;
  arc(
    left_arc2_center_x,
    left_arc2_center_y,
    2 * r,
    2 * r,
    180 + inverseDegrees,
    270
  );

  // 3. Top center line
  line(left_curve_end_x, top_y, right_curve_start_x, top_y);
}
