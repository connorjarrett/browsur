let currentApp = []


function searchDir(area, name, type) {
    for (let i=0; i<area.length; i++) {
        if (area[i]["name"] == name && area[i]["type"] == type) {
            return area[i]
        }
    }

    return false
} 

const app = {
    _explore(url) {
        $.ajax({
            url: url,
            async: false,
            success: function(response) {
                for (let i=0; i<response.length; i++) {
                    let file = response[i]
                    
                    if (file["type"] == "dir") {
                        app._explore(file["url"])

                        currentApp.push({
                            name: file["name"],
                            path: file["path"],
                            type: file["type"],
                        })
                    } else {
                        currentApp.push({
                            name: file["name"],
                            path: file["path"],
                            type: file["type"],
                            content : file["download_url"]
                        })
                    }
                }
            },
            error: function(e) {
                console.error(`GitHub API failed to fetch new content for "app.load", likely a Rate Limit error.\n\nMESSAGE:\n${e["responseJSON"]["message"]}\n${e["responseJSON"]["documentation_url"]}`)
            }
        })
    },

    importDefaults() {
        return new Promise((resolve) => {
            function fetch() {
                return new Promise((resolve) => {
                $.ajax({
                    url: "script/default_apps/defaults.json",
                    async: false,
                    success: function(appindex) {
                        // Fetch default apps and import
                        for (const [name, files] of Object.entries(appindex)) {
                            // Create App Folder
                            fs.write({
                                path: `/Applications/${name}`,
                                type: "dir"
                            })

                            for (let i=0; i<files.length; i++) {
                                const file = files[i]

                                if (!["png","jpeg","jpg"].includes(fs.extension(file.name).toLowerCase())) {
                                    $.ajax({
                                        url: `script/default_apps/${name}/${file.name}`,
                                        async: false,
                                        dataType: 'text',
                                        success: function(fileContents) {
                                            fs.write({
                                                path: `/Applications/${name}/${file.name}`,
                                                type: file.type,
                                                data: fileContents
                                            })
                                        }
                                    })

                                    if (!files.find(({name}) => ["png","jpeg","jpg"].includes(fs.extension(name)))) {
                                        resolve(true)
                                    }
                                    
                                } else {
                                    console.log("STARTT")
                                    function getAppIcon(){
                                        return new Promise((resolve) => {
                                            const xhr = new XMLHttpRequest();
                                            xhr.open("GET", `script/default_apps/${name}/${file.name}`, true);
                                            xhr.onload = (e) => {
                                            if (xhr.readyState === 4) {
                                                if (xhr.status === 200) {
                                                    // Convert BLOB to Base64 String
                                                    var reader = new FileReader();
                                                    reader.readAsDataURL(xhr.response); 
                                                    reader.onloadend = function() {     
                                                        fs.write({
                                                            path: fs.nameStartsWith(file.name, "appicon") ? `/Applications/${name}/appicon.ico` : `/Applications/${name}/${file.name}`,
                                                            type: file.type,
                                                            data: reader.result
                                                        })
                                                        resolve(true)         
                                                    }
                                                    
                                                } else {
                                                console.error(xhr.statusText);
                                                }
                                            }
                                            };
                                            xhr.onerror = (e) => {
                                                console.error(xhr.statusText);
                                            };
                                            xhr.responseType = 'blob';
                                            xhr.send(null);

                                        });
                                    }

                                    async function load() {
                                        await getAppIcon()
                                        
                                        if (i == files.length - 1) {
                                            function checkAppIcon() {
                                                if (fs.fileExists(`/Applications/${name}/appicon.ico`)) {
                                                    resolve(true)
                                                } else {
                                                    setTimeout(checkAppIcon, 10)
                                                }
                                                
                                            }

                                            if (files.find(({name}) => fs.nameStartsWith(name) == "appicon")) {
                                                checkAppIcon()
                                            } else {
                                                reslove(true)
                                            }
                                            
                                        }
                                    }

                                    load()

                                }
                            }
                        }
                    }
                })
                })
            }

            async function reslover() {
                await fetch()
                resolve(true)
            }

            reslover()
            })
    },

    isAppRunning(appName) {
        let app = $(`body > .content > .app-${appName.toLowerCase().replaceAll(" ","-")}`)

        if (app.length > 0) {
            return true
        }

        return false
    },
    
    fetch(repoURL) {
        // Clean URL
        repoURL = repoURL.toLowerCase()
        repoURL = repoURL.replace("https://github.com/","")

        const author = repoURL.split("/")[0]
        const repoName = repoURL.split("/")[1]

        console.log(author, repoName)
        const apiInitialCall = `https://api.github.com/repos/${author}/${repoName}/contents`

        // Call to inital file contents
        this._explore(apiInitialCall)

        if (!fs.fileExists(`/Applications/${repoName}`)) {
            fs.write({
                path: `/Applications/${repoName}`,
                type: "dir"
            })

            var folders = []
            var files = []

            // Sort all items into file/folder categories
            for (let i=0; i<currentApp.length; i++) {
                if (currentApp[i]["type"] == "dir") {
                    folders.push(currentApp[i])
                } else {
                    files.push(currentApp[i])
                }
            }

            currentApp = undefined

            // Sort folders so that it does them incramentally as it goes down the file tree to prevent trying to add to a non-existant directory.
            folders.sort(function(a,b) {
                let a_split = a["path"].split("/")
                let b_split = b["path"].split("/")

                return a_split.length - b_split.length
            })

            // Write Folders
            for (let i=0; i<folders.length; i++) {
                let folder = folders[i]

                fs.write({
                    path: `/Applications/${repoName}/${folder["path"]}`,
                    type: "dir",
                    contents: []
                })
            }

            // Write Files
            console.log(files)

            for (let i=0; i<files.length; i++) {
                let file = files[i]

                if (sys.validURL(file["content"])) {
                    $.ajax({
                        url: file["content"],
                        async: false,
                        success: function(response) {
                            fs.write({
                                path: `/Applications/${repoName}/${file["path"]}`,
                                type: "file",
                                data: response
                            })
                        },
                        error: function(){
                            fs.write({
                                path: `/Applications/${repoName}/${file["path"]}`,
                                type: "file",
                                data: file["content"]
                            })
                        }
                    })
                } else {
                    fs.write({
                        path: `/Applications/${repoName}/${file["path"]}`,
                        type: "file",
                        data: file["content"]
                    })
                }

                
            }
        } else {
            window.error("App already exists!")
        }
    },

    getWindow(appName) {
        if (app.isAppRunning(appName)) {
            const window = $(`body > .content > .window.app-${appName.toLowerCase().replaceAll(" ","-")}`)[0]

            return {
                window: window,
                header: window.getElementsByTagName("header")[0],
                content: window.getElementsByTagName("main")[0]
            }
        }
    },

    quit(appName) {
        if (app.isAppRunning(appName)) {
            // Delete code if already loaded
            $(`head > script.external.app-code-${appName}`).remove()

            $('head').contents().each(function() {
                if(this.nodeType === Node.COMMENT_NODE) {
                    if (this.nodeValue.includes(`OF CODE IMPORT FOR "${appName}"`)) {
                        $(this).remove();
                    }
                }
            });

            this.getWindow(appName).window.remove();

            $("body > header #open-app").html("Explorer")

            dock.remove(appName, "open")
            dock.remove(appName, "minimized")
        }
    },

    run(appName) {
        if (!app.isAppRunning(appName)) {
            if (fs.fileExists(`/Applications/${appName}`)) {
                console.log("Starting")
                

                document.head.appendChild(document.createComment(` BEGINING OF CODE IMPORT FOR "${appName}" `))

                const filesInApp = fs.getAllFilesUnderDirectory(`/Applications/${appName}`)

                //  Load all files into memory
                const extenstions = [
                    {match: ".js", tag:"script"},
                ]

                var scripts = []

                for (let i=0; i<filesInApp.length; i++) {
                    let fileName = filesInApp[i].name
                    let tag = ""

                    for (let x=0; x<extenstions.length; x++) {
                        let currentMatch = extenstions[x].match
                    
                        let pattern = new RegExp(currentMatch,"i")

                        if (pattern.test(fileName)) {
                            tag = extenstions[x].tag
                            break
                        }
                    }

                    if (tag) {
                        if (tag != "script") {
                            let code = document.createElement(tag)
                            code.innerHTML = decodeURI(filesInApp[i].data)
                            code.classList = `external app-code-${appName} data-filename="${fileName}"`
                            document.head.appendChild(code)
                        } else {
                            scripts.push(filesInApp[i].data)
                        }
                    }
                }

                var script = document.createElement("script")
                script.innerHTML = `function runapp${appName.toLowerCase().replaceAll(" ","-")}(){\n${scripts.join(";\n")}\n};\n\nrunapp${appName.toLowerCase().replaceAll(" ","-")}()`
                script.classList = `external app-code-${appName}`
                document.head.appendChild(script)
                

                document.head.appendChild(document.createComment(` END OF CODE IMPORT FOR "${appName}" `))
                
                app.getWindow(appName).window.dataset.attachedToApp = "true"

                dock.push(appName, "open")
            } else {
                console.log("Fake ass app")
            }
        } else {
            console.log("it is running already")
        }
    }
}