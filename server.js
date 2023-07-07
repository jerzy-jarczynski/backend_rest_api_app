const express = require('express');
const cors = require('cors');

const app = express();

const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
  { id: 3, author: 'Jack Black', text: 'You must never underestimate the power of the eyebrow.' },
  { id: 4, author: 'Dave Grohl', text: 'I had no idea what I was doing and I faked it and it worked.' },
  { id: 5, author: 'David Gilmour', text: 'Everything in moderation - that\'s what I live by.' },
  { id: 6, author: 'John Lennon', text: 'I\'ve always been politically minded and against the status quo.' },
  { id: 7, author: 'Paul McCartney', text: 'Think globally, act locally.' },
  { id: 8, author: 'Jack White', text: 'I consider music to be storytelling, melody and rhythm.' },
  { id: 9, author: 'Ed Sheeran', text: 'I\'ve fallen for your eyes, but they don\'t know me yet.' },
  { id: 10, author: 'Freddy Mercury', text: 'I won\'t be a rock star.' },
];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});