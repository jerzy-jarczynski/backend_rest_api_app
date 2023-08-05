const express = require('express');
const cors = require('cors');
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');
const helmet = require('helmet');

const uri = `mongodb+srv://anderfor:${process.env.DB_PASS}@kodilla.vpc6m3e.mongodb.net/NewWaveDB?retryWrites=true&w=majority`;

// import routes
const testimonialRoutes = require('./routes/testimonials.routes');
const concertsRoutes = require('./routes/concerts.routes');
const seatsRoutes = require('./routes/seats.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8000',
  'https://backendrestapiapp.jerzy-jarczynski.repl.co/'
];

app.use(cors({
  origin: function(origin, callback){

    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow external access...';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// conncects our backend code with the database
const NODE_ENV = process.env.NODE_ENV;
let dbUri = "";

if (NODE_ENV === "production") dbUri = uri;
else if (NODE_ENV === "test") dbUri = "mongodb://localhost:27017/NewWaveDBTest";
else dbUri = "mongodb://localhost:27017/NewWaveDB";


try {
  mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;

  db.once('open', () => {
    if (NODE_ENV !== "test") console.log("Connected to the database");
  });
  db.on('error', err => console.log('Error ' + err));
} catch (err) {
  if(process.env.debug === true) console.log(err);
  else console.log('Couldn\'t connect to db...');
}

let server;

try {
  server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  });
} catch (err) {
  if(process.env.debug === true) console.log(err);
  else console.log('Couldn\'t start the server...');
}

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