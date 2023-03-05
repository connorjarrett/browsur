// Show the time on the menu bar
function uiTime() {
    let time = getTime()
    let timeStr = `${time["day"]} ${time["month"]} ${time["date"]} ${('0' + time["hour"]).slice(-2)}:${('0' + time["min"]).slice(-2)} ${time["ampm"]}`
    $("#time")[0].innerHTML = timeStr
}
setInterval(uiTime, 100)
uiTime()

// Average the wallpaper colour to determine what colour text should be
let image = document.createElement("img")
image.style.display = "none"

let url = getComputedStyle(document.body, null).getPropertyValue("background-image").substring(5).slice(0,-2)
image.src = url

var rgb = getAverageRGB(image);

if ((rgb.r*0.299 + rgb.g*0.587 + rgb.b*0.114) > 186) {
    console.log("Use black")
} else {
    console.log("Use white")
}

function getAverageRGB(imgEl) {

var blockSize = 5, // only visit every 5 pixels
    defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
    canvas = document.createElement('canvas'),
    context = canvas.getContext && canvas.getContext('2d'),
    data, width, height,
    i = -4,
    length,
    rgb = {r:0,g:0,b:0},
    count = 0;
    
if (!context) {
    return defaultRGB;
}

height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

context.drawImage(imgEl, 0, 0);

try {
    data = context.getImageData(0, 0, width, height);
} catch(e) {
    return defaultRGB;
}

length = data.data.length;

while ( (i += blockSize * 4) < length ) {
    ++count;
    rgb.r += data.data[i];
    rgb.g += data.data[i+1];
    rgb.b += data.data[i+2];
}

// ~~ used to floor values
rgb.r = ~~(rgb.r/count);
rgb.g = ~~(rgb.g/count);
rgb.b = ~~(rgb.b/count);

return rgb;

}

// Make the DIV element draggable:
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if ($(`#${elmnt.id} > header`)) {
    // if present, the header is where you move the DIV from:
    $(`#${elmnt.id} > header`)[0].onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if (elmnt.classList.contains("fullscreen")) {
      elmnt.classList.remove("fullscreen")
      elmnt.dataset.fullscreen = ""
    }

    if (!elmnt.classList.contains("fullscreen")) {
        let menuOffset = $("body > header")[0].offsetHeight + elmnt.offsetHeight/2

        if ((elmnt.offsetTop - pos2) > menuOffset && (elmnt.offsetTop - pos2) < document.body.offsetHeight) {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        }

        if ((elmnt.offsetLeft - pos1) > 0 && (elmnt.offsetLeft - pos1) < document.body.offsetWidth) {
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        focus(elmnt)
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}