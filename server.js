const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

const db = [
  { id: '1', author: 'John Doe', text: 'This company is worth every coin!' },
  { id: '2', author: 'Amanda Doe', text: 'They really know how to make you happy.' },
  { id: '3', author: 'Jack Black', text: 'You must never underestimate the power of the eyebrow.' },
  { id: '4', author: 'Dave Grohl', text: 'I had no idea what I was doing and I faked it and it worked.' },
  { id: '5', author: 'David Gilmour', text: 'Everything in moderation - that\'s what I live by.' },
  { id: '6', author: 'John Lennon', text: 'I\'ve always been politically minded and against the status quo.' },
  { id: '7', author: 'Paul McCartney', text: 'Think globally, act locally.' },
  { id: '8', author: 'Jack White', text: 'I consider music to be storytelling, melody and rhythm.' },
  { id: '9', author: 'Ed Sheeran', text: 'I\'ve fallen for your eyes, but they don\'t know me yet.' },
  { id: '10', author: 'Freddy Mercury', text: 'I won\'t be a rock star.' },
];

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// get all db array
app.get('/testimonials', (req, res) => {
  res.json(db);
});

// get random db array element
app.get('/testimonials/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * db.length);
  const randomTestimonial = db[randomIndex];
  res.json(randomTestimonial);
});

// get single db array element
app.get('/testimonials/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const testimonial = db.find((item) => item.id === id);
  if (testimonial) {
    res.json(testimonial);
  } else {
    res.status(404).json({ error: 'Testimonial not found' });
  }
});

// post add new element to db array
app.post('/testimonials', (req, res) => {
  const { author, text } = req.body;
  const id = uuidv4();
  const newTestimonial = { id, author, text };
  db.push(newTestimonial);
  res.status(201).json({ message: 'OK' });
});

// put modify db array element
app.put('/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { author, text } = req.body;

  const testimonial = db.find((item) => item.id === id);

  if (!testimonial) {
    return res.status(404).json({ message: 'Testimonial not found' });
  }

  testimonial.author = author;
  testimonial.text = text;

  res.json({ message: 'OK' });
});

// delete element from db array
app.delete('/testimonials/:id', (req, res) => {
  const testimonialId = req.params.id;

  const testimonialIndex = db.findIndex((testimonial) => testimonial.id === testimonialId);

  if (testimonialIndex !== -1) {
    db.splice(testimonialIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Testimonial not found' });
  }
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});