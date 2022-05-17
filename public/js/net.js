// Socket Connect

let url = location.pathname.split('/');
let namespace = url[url.length - 1];
const socket = io(`/${namespace}`)

window.addEventListener('load', () => {
    document.getElementById('title').innerText = `Сервер: ${namespace}`
    document.title = namespace
})


window.onunload = () => {
    socket.close()
}

export default socket;