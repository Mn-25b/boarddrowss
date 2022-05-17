import socket from './net.js'

let username;

window.addEventListener('load', () => {

    const $loginForm = document.getElementById('loginForm')
    const $nameInput = document.getElementById('nameInput')
    const $messageForm = document.getElementById('messageForm')
    const $canvas = document.getElementById('canvas')
    const $canvasButtonsRow = document.getElementById('canvasButtonsRow')
    
    // Login
    $loginForm.addEventListener('submit', function(event) {
        event.preventDefault()
        // вход с именем
        let name = $nameInput.value;
        login(name)

        // показ экрана
        $loginForm.remove()
        $messageForm.classList.remove('hidden')
        $canvas.classList.remove('hidden')
        $canvasButtonsRow.classList.remove('hidden')
    })

    function login(name) {
        username = name;
        socket.emit('login', username)
    }
})

