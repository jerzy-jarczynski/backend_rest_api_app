const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');

const uri = 'mongodb+srv://anderfor:anderfor123456%2A@kodilla.vpc6m3e.mongodb.net/NewWaveDB?retryWrites=true&w=majority';

// import routes
const testimonialRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// conncects our backend code with the database
const NODE_ENV = process.env.NODE_ENV;
let dbUri = "";

if (NODE_ENV === "production") dbUri = uri;
else if (NODE_ENV === "test") dbUri = "mongodb://localhost:27017/NewWaveDBTest";
else dbUri = "mongodb://localhost:27017/NewWaveDB";

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  if (NODE_ENV !== "test") console.log("Connected to the database");
});
db.on('error', err => console.log('Error ' + err));

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

// Add access to io in req.io
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api', testimonialRoutes); // add testimonial routes to server
app.use('/api', concertsRoutes); // add concerts routes to server
app.use('/api', seatsRoutes); // add seats routes to server

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// catching bad links
app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
});

module.exports = server;