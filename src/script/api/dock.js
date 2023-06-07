const dock = {
    sections: {
        "bookmarks": "body > .dock .bookmarks",
        "open": "body > .dock .currentlyOpen",
        "minimized": "body > .dock .minimized"
    },

    contains(appName, section) {
        if (!section) {
            return $(`body > .dock .appicon[data-name=${appName}]`).length > 0 ? true : false
        } else {
            section = section.toLowerCase()

            if (Object.keys(this.sections).includes(section)) {
                return $(`${this.sections[section]} .appicon[data-name=${appName}]`).length > 0 ? true : false
            } else {
                console.error(`Invalid section name "${section}", please chose from [${Object.keys(this.sections).toString()}]`)
            }
        }
    },

    remove(appName, section) {
        if (!section) {
            return $(`body > .dock .appicon[data-name=${appName}]`).remove()
        } else {
            section = section.toLowerCase()

            if (Object.keys(this.sections).includes(section)) {
                return $(`${this.sections[section]} .appicon[data-name=${appName}]`).remove()
            } else {
                console.error(`Invalid section name "${section}", please chose from [${Object.keys(this.sections).toString()}]`)
            }
        }
    },

    push(appName, section) {
        section = section.toLowerCase()
        var validSection = Object.keys(this.sections).includes(section);
            

        if (!validSection) {console.error(`Invalid section name "${section}", please chose from [${Object.keys(this.sections).toString()}]`);return false}
            
        const sectionDiv = $(this.sections[section])[0]

        if (["bookmarks","open"].includes(section)) {
            if (!this.contains(appName, "open") && !this.contains(appName, "bookmarks")) {
                const appIcon = document.createElement("div")
                appIcon.classList = "appicon"
                appIcon.dataset.name = appName

                if (fs.fileExists(`/Applications/${appName}/appicon.ico`)) {
                    appIcon.style.background = `#eeeeee url(${fs.fromPath(`/Applications/${appName}/appicon.ico`).data})`
                } else {
                    appIcon.style.background = "#eeeeee"
                }
                appIcon.style.backgroundSize = "cover"

                $(appIcon).on("click", function(){
                    app.run(appName)
                }) 

                sectionDiv.appendChild(appIcon)
            }
        }
    }
}