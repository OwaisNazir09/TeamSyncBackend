require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require('./routes/router');

// Middleware
app.use(express.json());
app.use(cors()); 


mongoose.connect(process.env.MONGOOSE_CONNECTION, {
    useNewUrlParser: true,  
    useUnifiedTopology: true,
})
    .then(() => console.log("Users database connected successfully"))
    .catch((err) => console.error(" MongoDB Connection Error:", err));


app.get('/', (req, res) => {
    res.send("Hello world");
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Serve static files
// app.use(express.static(path.join(__dirname, 'public')));

// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('offer', (data) => {
//         socket.broadcast.emit('offer', data);
//     });

//     socket.on('answer', (data) => {
//         socket.broadcast.emit('answer', data);
//     });

//     socket.on('ice-candidate', (data) => {
//         socket.broadcast.emit('ice-candidate', data);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// // Start the server
// server.listen(3000, () => console.log('Server running on http://localhost:3000'));
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static(__dirname + '/public'));

// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     socket.on('offer', (data) => {
//         socket.broadcast.emit('offer', data);
//     });

//     socket.on('answer', (data) => {
//         socket.broadcast.emit('answer', data);
//     });

//     socket.on('ice-candidate', (candidate) => {
//         socket.broadcast.emit('ice-candidate', candidate);
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// server.listen(3000, () => { 
//     console.log('Server running at http://localhost:3000');
// });
