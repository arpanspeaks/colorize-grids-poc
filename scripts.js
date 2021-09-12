let n = 12;
let container = document.getElementById("container");

while(n--) {
  div = document.createElement("div");
  div.setAttribute("class", "div-grid-element");
  div.setAttribute("id", `div-${11 - n}`);
  div.setAttribute("dragable", false);
  container.appendChild(div);
}

let elements = document.getElementsByClassName("div-grid-element");
for(let element of elements) {
    element.addEventListener("mousedown", () => { onMouseDown(event) });
    element.addEventListener("mousemove", () => { onMouseMove(event) });
    element.addEventListener("mouseup", () => { onMouseUp(event) });
}

let dragging = false, prevIdx = -1, down, up;
const onMouseDown = (e) => {
    e.preventDefault();
    dragging = true;
    down = +e.target.id.split("-").pop();
}

const onMouseMove = (e) => {
    e.preventDefault();
    let currIdx = +e.target.id.split("-").pop();
    if(dragging && prevIdx !== currIdx) {
        prevIdx = currIdx;
        applyColor(down, currIdx);
    }
}

const onMouseUp = (e) => {
    e.preventDefault();
    dragging = false;
    prevIdx = -1;
    let up = +e.target.id.split("-").pop();
    if(up === down ) applyColor(down, up);
}

let colorChosen = "green";
const applyColor = (down, up) => {
    if(down > up) [down, up] = [up, down];
    for(let i = 0; i < 12; i++) {
        if(i >= down && i <= up) {
            if(i%4 < down%4 || i%4 > up%4) document.getElementById(`div-${i}`).style.backgroundColor = "white";
            else document.getElementById(`div-${i}`).style.backgroundColor = colorChosen;
        } else {
            document.getElementById(`div-${i}`).style.backgroundColor = "white";
        }
    }
}

const onColorChange = () => {
    let root = document.querySelector(':root');
    let colorPicker = document.getElementById("color");
    let color = colorPicker.options[colorPicker.selectedIndex].text;
    root.style.setProperty('--selected-color', color);
    colorChosen = color;
}