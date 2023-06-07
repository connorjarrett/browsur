var fileStructure;

const fs = {
    nameStartsWith(filename) {
        return (filename.split(".")[0])
    },

    searchDirFromJSON(dir, query, silence = false) {
        if (dir) {
            if (dir["type"] == "dir") {
                let children = dir["contents"]
                
                for (let i=0; i<children.length; i++) {
                    if (children[i]["name"] == query) {
                        return children[i]
                    }
                }

                if (!silence) {
                    console.warn(`Was unable to find "${query}" in "${this.pathFromJSON(dir)}"`);
                }
            }
        } else {
            console.error("Directory value was undefined.");
        }
    },

    pathFromJSON(json) {
        return json["name"]
    },

    getAllFilesUnderDirectory(path) {
        const dir = this.fromPath(path, true)

        var files = []

        if (!dir) {
            console.error(`Nonexistant directory "${path}"`)
            return false
        } else {
            var searchArea

            if (dir.contents) {
                searchArea = dir.contents
            } else {
                searchArea = dir
            }

            for (let i=0; i<searchArea.length; i++) {
                let file = searchArea[i]
                file.path = path

                // console.log(file.name, file.path)

                if (file.type == "dir") {
                    if (path != "/") {
                        files = files.concat(this.getAllFilesUnderDirectory(`${path}/${file.name}`))
                    } else {
                        files = files.concat(this.getAllFilesUnderDirectory(`/${file.name}`))
                    }
                } else {
                    files.push(file)
                }
            }
        }

        return files
    },

    fromPath(path, silence = false) {
        var search = fileStructure // Whole Filesystem

        if (path.slice(-1) == "/") [
            path = path.slice(0,-1)
        ]

        strPath = path
        path = path.slice(1).split("/")

        var found;

        if (path.length == 1) {
            // Is in "/"

            if (path[0] == "") {
                // Searching for "/"
                found = search

            } else {
                // Searching for "/*"

                for (let i=0; i<search.length; i++) {
                    if (search[i]["name"] == path[path.length-1]) {
                        found = search[i]
                        break;
                    }
                }
            }

        } else if (path.length > 1) {
            // Outside of "/"
            let currentSearching;

            for (let i=0; i<path.length; i++) {
                if (i==0) {
                    currentSearching = this.fromPath(`/${path[i]}`)
                } else {
                    if (!currentSearching && !silence) {
                        console.error("Attempting to search non-existant directory")
                    } else {
                        let query = this.searchDirFromJSON(currentSearching,path[i], silence)

                        if (query) {
                            if (i == path.length-1) {
                                found = query
                            } else {
                                if (query["type"] == "dir") {
                                    currentSearching = query
                                }
                            }
                        }
                    }
                }
                
            }
        }


        if (!found && !silence) {
            console.error(`The file "${strPath}" does not exist!`);
        }

        return found
    },

    fileExists(path) {
        if (this.fromPath(path, true)) {
            return true
        }

        return false
    },

    extension(path) {
        return path.split(".").splice(-1)[0].toLowerCase()
    },

    write(json) {
        if (json["path"] && json["type"] && !this.fileExists(json["path"], true)) {
            const path = json["path"]

            const parentPath = (path.split("/").slice(0, -1)).join("/")
            const fileName =  (path.split("/").slice(-1)).toString().replace(" ","_")

            var parentDir = this.fromPath(parentPath, true)
            
            if (parentDir) {
                if (parentDir["type"] == "dir") {
                    if (json["type"] == "file") {
                        // Adding File
                        

                        if (json["data"]) {
                            // console.log(json.data)

                            var data = json.data
                            var ext = this.extension(json.path).toLowerCase()

                            if (ext == "jpg") {
                                ext = "jpeg"
                            }

                            if (["png","jpeg"].includes(ext)) {
                                
                                const blobToBase64 = blob => new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(blob);
                                    reader.onload = () => resolve(reader.result);
                                    reader.onerror = error => reject(error);
                                });
                                const convertBlobToBase64 = async (blob) => { // blob data
                                    return await blobToBase64(blob);
                                }
                                

                                convertBlobToBase64(data).then(function(result){
                                    parentDir["contents"].push({
                                        type: "file",
                                        name: fileName,
                                        data: result 
                                    })
                                })

                            } else {
                                parentDir["contents"].push({
                                    type: "file",
                                    name: fileName,
                                    data: data 
                                })
                            }

                            
                        }

                    } else if (json["type"] == "dir") {
                        // Adding Directory
                        parentDir["contents"].push({
                            type: "dir",
                            name: fileName,
                            contents: []
                        })
                    } else {
                        console.error(`Type "${type}" is invalid, either use "dir" or "file"`)
                    }
                } else {
                    console.error(`Failed to write file "${fileName}", because it's parent directory (${parentPath}) isn't a directory.`)
                }
            } else {
                console.error(`Failed to write file "${fileName}", because it's parent directory (${parentPath}) doesn't exist.`)
            }
            
        } else {
            // Prerequesties weren't met
            if (this.fileExists(json["path"])) {
                console.warn(`File "${json["path"]}" already exits, not created`)
            }
        }
    }
}

$.ajax({
    url: "filesystem.json",
    async: false,
    success: function(r) {
        fileStructure = r
    }
})
