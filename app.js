const canvas = document.getElementById("canvas");
let colorSelect = document.getElementById("color");
let widthSelect = document.getElementById("width");
let undo_arr = [];
let redo_arr = [];
let index = -1;
let redo_index = -1;
canvas.height = 500;
canvas.width = 1000;
const ctx = canvas.getContext("2d");

let is_drawing = false;
let drag = false;
let draw_color = colorSelect.value;
let draw_width = widthSelect.value;
canvas.addEventListener("mousedown", handleMousedown);
canvas.addEventListener("mousemove", handleMousemove);
canvas.addEventListener("mouseup", handleMouseUp);
colorSelect.addEventListener("change", (e) => {
  draw_color = colorSelect.value;
});

widthSelect.addEventListener("change", (e) => {
  draw_width = widthSelect.value;
});
function handleMousedown(event) {
  drag = false;
  is_drawing = true;
  ctx.beginPath();
  ctx.moveTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
  event.preventDefault();
}

function handleMousemove(event) {
  if (is_drawing) {
    drag = true;
    ctx.lineTo(
      event.clientX - canvas.offsetLeft,
      event.clientY - canvas.offsetTop
    );
    ctx.strokeStyle = draw_color;
    ctx.lineWidth = draw_width;
    ctx.stroke();
  }
  event.preventDefault();
}

function handleMouseUp(event) {
  if (is_drawing) {
    ctx.stroke();
    ctx.closePath();
    is_drawing = false;
  }
  event.preventDefault();

  undo_arr.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  index++;
  redo_arr = [];
  redo_index = -1;
}

document.getElementById("clear").addEventListener("click", (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  undo_arr = [];
  index = -1;
  redo_arr = [];
  redo_index = -1;
});

document.getElementById("undo").addEventListener("click", (e) => {
  if (index <= 0) {
    document.getElementById("clear").click();
  } else {
    index--;
    redo_index++;
    redo_arr.push(undo_arr[index+1]);
    undo_arr.pop();
    ctx.putImageData(undo_arr[index], 0, 0);
  }
});

document.getElementById("redo").addEventListener("click", (e) => {
  if (redo_index > -1) {
    ctx.putImageData(redo_arr[redo_index], 0, 0);
    redo_index--;
    undo_arr.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    index++;
  }
});
