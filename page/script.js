function isElementInViewport (el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}


// Scroll To Reveal
$(window).on("load scroll",function(){
    $(".scroll-to-reveal").each(function(){
        if (isElementInViewport(this)) {
            this.style.opacity = 1
        }
    })
})

// Expand Box Content
var midExpansion = false

$("article .expand").on("click",function(){
    const button = this
    const box = button.parentNode
    const content = box.getElementsByClassName("content")[0]

    const title = box.getElementsByClassName("header")[0].getElementsByTagName("h2")[0]
    const preview = content.getElementsByClassName("preview")[0]
    const detail = content.getElementsByClassName("expanded")[0]

    var state = preview.style.opacity ? true : false

    if (!midExpansion) {
        if (!state) {
            midExpansion = true
            button.style.rotate = "45deg"
            button.style.filter = "invert(1)"

            preview.style.opacity = 0
            box.style.background = content.dataset["ex-bg"]
            title.style.color = content.dataset["ex-text"]

            setTimeout(function(){
                detail.style.opacity = 1
                
                midExpansion = false
            }, 950)
            
        } else {
            midExpansion = true
            button.style.rotate = ""

            detail.style.opacity = ""

            setTimeout(function(){
                preview.style.opacity = "" 
                box.style.background = ""
                button.style.filter = ""
                title.style.color = ""
                midExpansion = false
            }, 560)
        }
    }
})

// Year
$(".year").each(function(){
    const date = new Date
    this.innerHTML = date.getFullYear()
})

// Locale
$(".locale").each(function(){
    // If there is a better way to do this please tell me
    var span = this

    $.getJSON('https://api.db-ip.com/v2/free/self', function(data) {
        if (!data.errorCode) {
            span.innerHTML = data.countryName
        } else {
            span.innerHTML = ""
        }
    });
    
})