let bookmarks = [
    "Web"
]

function openToDock(window, location, dontAnimateIn) {
    console.log(window.dataset)

    let icon = document.createElement("div")
    icon.classList = "icon open"
    icon.dataset.id = window.id
    icon.dataset.name = window.dataset.name

    icon.style.backgroundImage = "url('./Applications/"+icon.dataset.name+"/icon.svg')"

    icon.addEventListener("click", function(){
        if (!window.classList.contains("minimized")) {
            minimizeWindow(window)
        } else {
            focus(window)
            window.style.transition = "all 0.5s"
            window.classList.remove("minimized")
            icon.classList.add("open")

            if (window.dataset.fullscreen == "true") {
                window.classList.add("fullscreen")
            }

            setTimeout(function(){
                window.style.transition = ""
            },500)
        }
    })

    if (!dontAnimateIn) {
        setTimeout(function(){
            icon.style.transform = "unset"
        },1)
    } else {
        icon.style.transform = "unset"
    }
   

    if (!location || location == "temp") {
        $("body > .dock > .temporary")[0].appendChild(icon)
    } else if (location == "main") {
        $("body > .dock > .bookmark")[0].appendChild(icon)

        icon.addEventListener("click", function(){
            if ($("body > .content-area").find(`[data-name='${window.dataset.name}']`).length == 0) {
                ($("body > .dock .bookmark").find(`[data-name='${window.dataset.name}']`)[0]).remove()

                openToDock(app(window.dataset.name), "main")
            }
        })
    }

    return icon
}

function minimizeToDock(id) {
    let icon = ($("body > .dock").find(`[data-id='${id}']`)[0])
    icon.classList.remove("open")
}

function closeFromDock(id) {
    let icon = ($("body > .dock").find(`[data-id='${id}']`)[0])
    if (icon.parentElement.classList != "bookmark") {
        icon.style.transform = ""
        setTimeout(function(){
            icon.remove()
        },600)
    } else {
        icon.classList.remove("open")
    }
}

for (b=0; b<bookmarks.length; b++) {
    let window = app(bookmarks[b])
    console.log(window)
    openToDock(window, "main", true).classList.remove("open")
    window.remove()
}