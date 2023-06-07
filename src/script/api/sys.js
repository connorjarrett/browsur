const sys = {
    validURL(str) {
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    },

    date: {
        time(includeSeconds = false) {
            const date = new Date()

            var hours = String(date.getHours()).padStart(2,"0")
                minutes = String(date.getMinutes()).padStart(2,"0")
                seconds = String(date.getSeconds()).padStart(2,"0")

            if (!includeSeconds) {
                return `${hours}:${minutes}`
            } else {
                return `${hours}:${minutes}:${seconds}`
            }
        },

        shorthand() {
            const date = new Date()

            var day = date.getDate()
                month = date.getMonth()
                year = date.getFullYear()

            return `${day}/${month}/${year}`
        },

        display() {
            const date = new Date()

            var dayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][date.getDay()]
                dayDate = date.getDate()
                month = ["Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()]

            return `${dayName} ${dayDate} ${month}`
        },

        full() {
            const date = new Date()

            var dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()]
                dayDate = date.getDate()
                month = ["January","February","March","April","June","July","August","September","October","November","December"][date.getMonth()]

            return `${dayName} ${dayDate} ${month}`
        }
    }    
}

function alert(message) {
    const dialouge = gui.build({
        name: "Alert",
        overflow: true,
        size: {
            dimension: [250, 150],
            unit: "px"
        }
    })

    let p = document.createElement("p")
    p.innerHTML = message
    
    dialouge.content.appendChild(p)
}