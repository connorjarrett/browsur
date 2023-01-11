function build(window) {
    let urlbar = document.createElement("div")
    urlbar.classList = "urlbar"

    let form = document.createElement("form")
    urlbar.appendChild(form)

    let input = document.createElement("input")
    form.appendChild(input)

    $(form).submit(function(e){
        iframe.src = "https://"+input.value
        e.preventDefault();
    })

    let iframe = document.createElement("iframe")
    iframe.src = "https://www.google.com/webhp?igu=1"
    
    window.appendChild(urlbar)
    window.appendChild(iframe)
}