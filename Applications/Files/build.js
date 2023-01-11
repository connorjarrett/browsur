function build(window) {
    let sidebar = document.createElement("aside")
    window.appendChild(sidebar)

    let favourites = document.createElement("ul")
    sidebar.appendChild(favourites)

    let favouritesList = [
        {location:"/var/www/html/desktop/Applications",
        shortname:"Applications"}
    ]

    for (i=0; i<favouritesList.length; i++) {
        let item = document.createElement("li")
        item.setAttribute("onclick",`loadInFiles('${favouritesList[i]["location"]}', '${window.parentElement.id}')`)
        item.innerHTML = favouritesList[i]["shortname"]

        favourites.appendChild(item)
  
    }

    let explorer = document.createElement("div")
    explorer.classList = "explorer file-grid"
    window.appendChild(explorer)
}