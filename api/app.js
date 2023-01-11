/*
app.js
Finds an app and initialises it
*/

function app(name) {
    console.log(`Opening ${name}`)
    try {
        var window;
        $.ajax({
            url:`Applications/${name}/init.js`,
            dataType: "script",
            async: false,
            success: function(){
                window = init()
            }
        })

        return window;
    } catch(error) {
        console.log("oop")
    }
}