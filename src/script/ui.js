setInterval(function(){
    $("body > .menu #date").html(`${sys.date.display()} ${sys.date.time()}`)
},1000)

function focus(app) {
    $("body > .content > .window").each(function(){
        this.style.zIndex = ""
    })

    $("body > header #open-app").html(app.dataset.name)
    app.style.zIndex = 2
}

$(window).on("click",function(e){
    // Targeted App

    const target = e.target
    var selected;

    if (target == document.body || target.parentElement == document.body) {
        // Desktop Area
        selected = undefined
    } else {
        // On App
        var doneSearching = false
        let last = target;

        while (!doneSearching) {
            if (last.parentElement == $("body > section.content")[0]) {
                doneSearching = true
                selected = last
            }

            if (last.parentElement == document.body) {
                doneSearching = true

                if (last == $("body > header")[0] || last == $("body > .dock")[0]) {
                    selected = "unchanged"
                } else {
                    selected = undefined
                }

                
            }
        
            last = last.parentElement
        }
    }
    
    if (selected) {
        if (selected != "unchanged") {
            focus(selected)
        }
    } else {
        $("body > header #open-app").html("Explorer")
    }
})