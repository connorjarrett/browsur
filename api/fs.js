/*
fs.js
Filesystem
*/

function scanDir(dir, filename) {
    for (i=0; i<dir.length; i++) {
        if (dir[i]["type"] == "folder") {
            scanDir(dir[i]["inside"], filename)
        } else {
            if (dir[i]["name"] == filename) {
                console.log(dir[i])
            }
        }
    }
}

function getAppFromPath(path) {
    path = path.split("/")
    console.log(path)

    $.ajax({
        url:"fs.json",
        async: false,
        success: function(fs){
            scanDir(fs["inside"], path[path.length-1])
        }
    })
}