const express = require('express');
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const path = require('path')
const logger = require('morgan')

const port = process.env.PORT || 3000
app.set('port', port)
http.listen(port, () => console.log('listening on port ' + port));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(logger('dev'))

const namespaces = ['1_Server', '2_Server', '3_Server'];

namespaces.map(ns => io.of(`/${ns}`))
.forEach(ns => {
    let users = {};
    ns.on('connection', (socket) => {
        
        socket.on('login', (name) => {
            console.log('login', name)
            users[socket.id] = name;
            socket.broadcast.emit('msg', {
                from: 'server',
                message: `${name} logged in.`
            })
        })
        
        // если имя такое есть
        socket.on('disconnect', function() {
            let name;
            if (socket.id in users) {
                name = users[socket.id]
            } else {
                name = socket.id
            }
            console.log('disconnect: ' + name)
            
            socket.broadcast.emit('msg', {
                from: 'server',
                message: `${name} disconnected.`
            })
            
            delete users[socket.id]
        })
    
    
        // рисование
        socket.on('mouseDown', ([x, y]) => socket.broadcast.emit('mouseDown', [x, y]))
        socket.on('mouseMove', ([x, y]) => socket.broadcast.emit('mouseMove', [x, y]))
        socket.on('mouseUp', () => socket.broadcast.emit('mouseUp'))
        socket.on('clear', () => socket.broadcast.emit('clear'))
        socket.on('undo', () => socket.broadcast.emit('undo'))
        socket.on('setColor', (c) => socket.broadcast.emit('setColor', c))
        socket.on('setThickness', (r) => socket.broadcast.emit('setThickness', r))
    })
})

// Routes
app.get('/lobby', (req, res) => {
    res.render('lobby', {
        namespaces: namespaces
    })
})
app.get('/',     (req, res) => res.redirect('/lobby'))
app.get('/draw', (req, res) => res.redirect('/lobby'))

app.get('/draw/:namespace', (req, res) => {
    const ns = req.params['namespace'];
    if (!namespaces.includes(ns)) {
        return res.sendStatus(404);
    }
    res.render('draw')
})