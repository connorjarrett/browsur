function loadInFiles(location, windowID) {
    if (!windowID) {
        let window = app("Files")
        openToDock(window)
        
        loadInFiles(location, window.id)
    } else {
        console.log("A")
    }
}