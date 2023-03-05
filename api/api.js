function getTime() {
    let time = Math.floor(Date.now())
    let date = new Date(time);
    
    let day = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][date.getDay(0)-1]
    let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()]
    let dayOfMo = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()

    var ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12
    hour = hour ? hour : 12;

    let out = {
        "day":day,
        "month":month,
        "date":dayOfMo,
        "hour":hour,
        "min":min,
        "ampm":ampm
    }

    return out
}

function alert(message) {
    const window = createWindow("Alert",true,"500px","100px",[85,90],true)

    let messageBox = document.createElement("p")
    messageBox.style.margin = 0
    messageBox.style.padding = "10px"
    messageBox.style.boxSizing = "border-box"
    messageBox.style.width = "100%"
    messageBox.innerHTML = message

    window.appendChild(messageBox)
}