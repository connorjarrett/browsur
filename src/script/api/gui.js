const gui = {
    sidebar: {
        close(windowElement) {
            const sidebar = windowElement.getElementsByTagName("aside")[0]
            const headerLeft = windowElement.getElementsByTagName("header")[0].getElementsByClassName("left")[0]
            
            sidebar.style.width = 0
            sidebar.style.padding = "50px 0 5px 0"

            headerLeft.style.backgroundColor = ""
            headerLeft.style.borderBottom = ""
            
        },
        
        open(windowElement) {
            const sidebar = windowElement.getElementsByTagName("aside")[0]
            const headerLeft = windowElement.getElementsByTagName("header")[0].getElementsByClassName("left")[0]
       
            sidebar.style.width = ""
            sidebar.style.padding = ""

            headerLeft.style.backgroundColor = "rgba(253, 248, 244, 0)"
            headerLeft.style.borderBottom = "1px solid rgba(239, 239, 239, 0)"
        },

        toggle(windowElement) {
            const sidebar = windowElement.getElementsByTagName("aside")[0]

            if (sidebar.style.width == 0) {
                this.close(windowElement)
            } else {
                this.open(windowElement)
            }
        }
    },

    _initDrag(windowElement) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (windowElement.getElementsByClassName("windowHeader")[0]) {

            // if present, the header is where you move the DIV from:
            windowElement.getElementsByClassName("windowHeader")[0].onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV: 
            windowElement.onmousedown = dragMouseDown;
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
            if (!windowElement.classList.contains("fullscreen")) {
                let canGoUp = (windowElement.offsetTop - pos2) - windowElement.offsetHeight/2 >= 0 ? true : false
                let canGoDown = (windowElement.offsetTop - pos2) + windowElement.offsetHeight/2 - $("body > .content")[0].offsetHeight <=0 ? true : false

                let canGoLeft = (windowElement.offsetLeft - pos1) - windowElement.offsetWidth/5 >= 0 ? true : false
                let canGoRight = (windowElement.offsetLeft - pos1) + windowElement.offsetWidth/5 - $("body > .content")[0].offsetWidth <=0 ? true : false

                if (canGoUp && canGoDown) {
                    windowElement.style.top = (windowElement.offsetTop - pos2) + "px";
                }

                if (canGoLeft && canGoRight) {
                    windowElement.style.left = (windowElement.offsetLeft - pos1) + "px";
                }
                
                
            }   
        }
      
        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }   
    },

    build(config) {
        if (config.name) {
            // Build Window
            const main = document.createElement("section")
            main.classList = "window"
            main.style.width = `${config.size.dimension[0]}${config.size.unit}`
            main.style.height = `${config.size.dimension[1]}${config.size.unit}`

            // Build the header row
            const header = document.createElement("header")
            header.classList = "windowHeader"
            const headerLeft = document.createElement("div")
            const headerRight = document.createElement("div")

            headerLeft.classList = "left"
            headerRight.classList = "right"

            header.appendChild(headerLeft)
            header.appendChild(headerRight)
            main.appendChild(header)

            // Traffic Lights
            const trafficLights = document.createElement("div")
            trafficLights.classList = "traffics"

            var lights = [
                {type: "close", symbol:"close", action: function(){if(!main.dataset["attached-to-app"]){main.remove()} else {app.quit(main.dataset.name)}}},
                {type: "min", symbol:"remove"},
                {type: "full", symbol:"expand_content", action: function(){main.classList.toggle("fullscreen")}},
            ]

            for (let i=0; i<lights.length; i++) {
                let light = lights[i]

                let button = document.createElement("button")
                button.classList = `${light.type} icon`
                button.innerHTML = light.symbol

                if (light.action) {
                    button.onclick = light.action
                }

                trafficLights.appendChild(button)
            }
            headerLeft.appendChild(trafficLights)

            // Main Content
            const content = document.createElement("main")

            // Add the sidebar
            if (config.sidebar) {
                const sidebar = document.createElement("aside")
                sidebar.classList = "glass-high"
                main.appendChild(sidebar)

                if (config.sidebar.optional) {
                    const sidebarToggle = document.createElement("span")
                    sidebarToggle.innerHTML = "t"
                    sidebarToggle.setAttribute("onclick", "gui.sidebar.toggle(this.parentElement.parentElement.parentElement)")
                    headerLeft.appendChild(sidebarToggle) 

                    if (config.sidebar.defaultState) {
                        if (config.sidebar.defaultState != "open") {
                            this.sidebar.close(main)
                        }
                    }
                } else {
                    if (config.sidebar.defaultState) {
                        if (config.sidebar.defaultState != "open") {
                            console.warn("Cannot set sidebar to closed without the ability to toggle it back.\n\nFor Developers:\nAdd the 'optional: true' tag into your gui.build JSON")
                        }
                    }
                }

                if (config.sidebar.items) {
                    let items = config.sidebar.items

                    for (let i=0; i<items.length; i++) {
                        const item = items[i]

                        const span = document.createElement("span")

                        if (item.type == "heading") {
                            span.innerHTML = `<b>${item.text}</b>`
                        } else if (item.type == "item") {
                            span.innerHTML = `<span>${item.icon}</span> ${item.text}`
                        }

                        sidebar.appendChild(span)
                    }
                }
            }
        
            // Overflow
            if (config.overflow) {
                main.style.width = "max-content"
                main.style.height = "max-content"

                main.style.minWidth = `${config.size.dimension[0]}${config.size.unit}`
                main.style.minHeight = `${config.size.dimension[1]}${config.size.unit}`
            }

            // Add data tags
            if (config.metadata) {
                let meta = config.metadata

                for (const [key, value] of Object.entries(meta)) {
                    main.dataset[key] = value
                } 

                if (meta.app) {
                    main.classList.add(`app-${meta.app.toLowerCase()}`)
                    main.dataset.name = meta.app

                }
            } else {
                main.dataset.name = config.name   
                main.classList.add(`app-${config.name.toLowerCase().replaceAll(" ","-")}`)
            }

            main.appendChild(content)
            $("body > section.content")[0].appendChild(main)

            this._initDrag(main)

            focus(main)

            return {
                window: main,
                header: header,
                content: content
            }
        }
    }
}