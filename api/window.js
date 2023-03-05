function createWindow(name, showTitle, width, height, percentageThreshold, overflow) {
    // Generate Window
    let window = document.createElement("div")
    window.id = name.replace(" ","")+Date.now()+Math.round(Math.random()*10000)
    window.classList = "window app-" + name.toLowerCase().replace(" ","")
    window.style.width = width
    
    // Add Data
    window.dataset.name = name
    window.dataset.id = window.id
    window.dataset.opened = Date.now()

    window.style.minHeight = height

    if (!overflow) {
        window.style.maxHeight = height
    } else {
        window.style.height = "unset"
    }
    
    // Create Header
    let header = document.createElement("header")

    // Add Traffic Lights
    let trafficLights = document.createElement("div")
    trafficLights.classList = "traffic"

    let close = document.createElement("button"); close.classList="close"; close.innerHTML="close"; close.setAttribute("onclick","closeWindow("+window.id+")")
    let minimize = document.createElement("button"); minimize.classList="minimize"; minimize.innerHTML="remove"; minimize.setAttribute("onclick","minimizeWindow("+window.id+")")
    let fullscreen = document.createElement("button"); fullscreen.classList="fullscreen"; fullscreen.innerHTML="open_in_full"; fullscreen.setAttribute("onclick","fullscreenWindow("+window.id+")")

    trafficLights.appendChild(close)
    trafficLights.appendChild(minimize)
    trafficLights.appendChild(fullscreen)
    header.appendChild(trafficLights)

    // Title
    if (showTitle) {
        let title = document.createElement("span")
        title.classList = "title"
        title.innerHTML = name

        header.appendChild(title)
    }

    // Create Content Area
    let contentArea = document.createElement("div")
    contentArea.classList = "content"

    if (!overflow) {
        contentArea.style.overflowY = "hidden"
    }

    window.appendChild(header)
    window.appendChild(contentArea)
    $("body > .content-area")[0].appendChild(window)


    window.addEventListener("click", function(){focus(window)})
    header.addEventListener("dblclick", function(){fullscreenWindow(window)})
    focus(window)
    dragElement(window);

    return contentArea
}

function closeWindow(window) {
    if (window) {
        console.log("Closing",window.id)
        closeFromDock(window.id)
        window.remove()
    }
}

function minimizeWindow(window) {
    if (window) {
        console.log("Minimizing",window.id)
        window.classList.add("minimized")

        if (window.classList.contains("fullscreen")) {
            window.classList.remove("fullscreen")
            window.dataset.fullscreen = "true"
        } else {
            window.dataset.fullscreen = ""
        }

        minimizeToDock(window.id)
    }
}

function fullscreenWindow(window) {
    if (window) {
        console.log("Fullscreening",window.id)
        
        window.classList.toggle("fullscreen")
    }
}

function focus(window) {
    $(".window").each(function(i,e){
        e.style.zIndex = ""
    })

    $("#app-name")[0].innerHTML = window.dataset.name
    window.style.zIndex = "101"
}

// function settings() {
//     const window = createWindow("Settings",true,"400px","500px",[], true)

//     let wallpaperSection = document.createElement("section")

//     window.appendChild(wallpaperSection)
// }
