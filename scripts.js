let n = 96;
let colorsArray = Array(n).fill('white');
const clearAll = () => {
    colorsArray = Array(96).fill('white');
    for(let i=0; i<96; i++) document.getElementById(`div-${i}`).style.backgroundColor = colorsArray[i];
}

let container = document.getElementById("container");
container.addEventListener("mouseup", () => { onContainerMouseUp() });
const onContainerMouseUp = () => {
    if (isDragging) {
        isDragging = false;
        applyColor();
    }
}

while (n--) {
    div = document.createElement("div");
    div.setAttribute('title', `div-${95 - n}`);
    div.setAttribute("class", "div-grid-element");
    div.setAttribute("id", `div-${95 - n}`);
    div.setAttribute("dragable", false);
    container.appendChild(div);
}

let topLeftX, topLeftY, bottomRightX, bottomRightY;
let firstDiv = document.getElementById("div-0");
let lastDiv = document.getElementById("div-95");

topLeftX = Math.trunc(firstDiv.getBoundingClientRect().left);
topLeftY = Math.trunc(firstDiv.getBoundingClientRect().top);
bottomRightX = Math.trunc(lastDiv.getBoundingClientRect().right);
bottomRightY = Math.trunc(lastDiv.getBoundingClientRect().bottom);

let root = document.querySelector(":root");
root.addEventListener("mousemove", () => { onRootMouseMove(event) });
const onRootMouseMove = (e) => {
    if (isDragging && (e.clientX < topLeftX || e.clientY < topLeftY || e.clientX > bottomRightX || e.clientY > bottomRightY)) {
        isDragging = false;
        applyColor();
    }
}

let elements = document.getElementsByClassName("div-grid-element");
for (let i=0; i<96; i++) {
    let element = elements[i];
    element.addEventListener("mousedown", () => { onMouseDown(event, i) });
    element.addEventListener("mousemove", () => { onMouseMove(event) });
    element.addEventListener("mouseup", () => { onGridMouseUp(event) });
}

let isDragging = false, diagonalCheck = false, down, up, startX, startY, endX, endY, downRowId, downColId, upRowId, upColId;
const onMouseDown = (e, index) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
    diagonalCheck = false;
    document.getElementById(`div-${index}`).style.backgroundColor = colorChosen;
    down = +e.target.id.split("-").pop();
    downRowId = Math.trunc(down / 12);
    downColId = down % 12;
}

const onMouseMove = (e) => {
    e.preventDefault();
    let currIndex = +e.target.id.split("-").pop();
    if (isDragging) {
        endX = e.clientX;
        endY = e.clientY;
        if (down !== currIndex) {
            if(startX > endX && startY < endY) {
                diagonalAdjustments('top-right-to-bottom-left', currIndex);
                currIndex = up;
            } else if (startX < endX && startY > endY) { 
                diagonalAdjustments('bottom-left-to-top-right', currIndex);
                currIndex = up;
            }
        }
        up = currIndex;
        liveRenderColor(down, up);
    }
}

const diagonalAdjustments = (direction, currIndex) => {
    diagonalCheck = true; 
    upRowId = Math.trunc(currIndex / 12);
    upColId = currIndex % 12;

    if(direction === 'top-right-to-bottom-left') {
        down = downRowId * 12 + upColId;
        up = upRowId * 12 + downColId;
    } else if(direction === 'bottom-left-to-top-right') {
        down = upRowId * 12 + downColId;
        up = downRowId * 12 + upColId;
    }
}

const liveRenderColor = (start, end) => {
    if (start > end) [start, end] = [end, start];
    for (let i = 0; i < 96; i++) {
        let element = document.getElementById(`div-${i}`);
        if (i >= start && i <= end && !(i % 12 < start % 12 || i % 12 > end % 12)) element.style.backgroundColor = colorChosen;
        else element.style.backgroundColor = colorsArray[i];
    }
}

const onGridMouseUp = (e) => {
    if(isDragging) {
        e.preventDefault();
        if(!diagonalCheck) up = +e.target.id.split("-").pop();
        isDragging = false;
        applyColor();
    }
}

let colorChosen = "green";
const applyColor = () => {
    if (down > up)[down, up] = [up, down];
    for (let i = 0; i < 96; i++) {
        if (i >= down && i <= up && !(i % 12 < down % 12 || i % 12 > up % 12)) {
            colorsArray[i] = colorChosen;
        }
        document.getElementById(`div-${i}`).style.backgroundColor = colorsArray[i];
    }
}

const onColorChange = () => {
    let colorPicker = document.getElementById("color");
    let color = colorPicker.options[colorPicker.selectedIndex].text;
    colorChosen = color;
}