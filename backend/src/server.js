const express = require ('express');
const mongoose = require ('mongoose');
const cors = require('cors')
const path = require('path')

const socketio = require('socket.io')
const http = require('http')

const routes = require ('./routes');
const app = express();

const server = http.Server(app)
const io = socketio(server)


//conexao com o banco
mongoose.connect('mongodb+srv://jhordan:951753@cluster0-pbvvq.mongodb.net/rock?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

//conexao com o socket

const connectedUsers = {}

io.on('connection', socket => {

    const { user_id } = socket.handshake.query
    connectedUsers[user_id] = socket.id
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    return next()
})

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(routes);
server.listen(3333);