/*** DOM */
const helloButton = document.getElementById("helloButton")

/*** Function */
const testFunction = () => {
    alert("Hello Electron ! !")
}

/*** Event */
helloButton.addEventListener(('click'), () => {
    testFunction()
})

/*** Init */
