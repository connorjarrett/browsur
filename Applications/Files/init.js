
function init() {
    const ApplicationName = "Files"

    const scripts = [
        "api/window.js",
        `Applications/${ApplicationName}/build.js`,
        `Applications/${ApplicationName}/api.js`
    ]

    const styles = [
        `Applications/${ApplicationName}/style.css`
    ]

    // Inject Script
    for (i=0;i<scripts.length;i++) {
        $.ajax({
            url: scripts[i],
            async: false,
            dataType:"script"
        })

        let script = document.createElement("script")
        script.src = scripts[i]

        if (!$("body > .content-area")[0].dataset.eq == "true") {
            document.head.appendChild(script)

            console.log($("body > .content-area")[0].dataset)
        }
    }

    // Inject Style
    for (i=0;i<styles.length;i++) {
        let style = document.createElement("link")
        style.rel = "stylesheet"
        style.href = styles[i]

        document.head.appendChild(style)
    }

    // Create Window
    var window = createWindow(ApplicationName,true,"1510px","930px",[],false)

    build(window)


    return window.parentElement; 
}