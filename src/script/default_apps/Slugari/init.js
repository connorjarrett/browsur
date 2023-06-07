const appWindow = gui.build({
    name:'Slugari',
    size:{
        dimension:[50,50],
        unit:'%'
    }
})

const header = appWindow.header.getElementsByClassName("right")[0]
const form = document.createElement("form")
const input = document.createElement("input")

form.style.marginLeft = "auto"
form.style.marginRight = "auto"
input.style.transform = "translateX(-50px)"
input.type = "text"

form.appendChild(input)
header.appendChild(form)

const content = appWindow.content
content.style.overflow = "hidden"

const iframe = document.createElement("iframe")
iframe.src = "https://www.google.com/webhp?igu=1"
iframe.style.width = "100%"
iframe.style.height = "100%"

content.appendChild(iframe)

// appWindow.content.innerHTML = `<p>${JSON.stringify(fs.getAllFilesUnderDirectory("/"))}</p>`