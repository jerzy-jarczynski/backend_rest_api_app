const Concert = require('../models/concert.model');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find().populate('workshops');
    res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Concert.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const crt = await Concert.findOne().skip(rand);
    if(!crt) res.status(404).json({ message: 'Not found' });
    else res.json(crt);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const crt = await Concert.findById(req.params.id);
    if(!crt) res.status(404).json({ message: 'Not found' });
    else res.json(crt);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

// mod: add validation
exports.addNew = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = req.body;

    // Perform simple validations
    if (!performer || !genre || !image || day === undefined || price === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields: performer, genre, price, day, image.' });
    }

    if (typeof price !== 'number') {
      return res.status(400).json({ message: 'Price must be a number.' });
    }

    if (!Number.isInteger(day)) {
      return res.status(400).json({ message: 'Day must be an integer.' });
    }

    const newConcert = new Concert({ performer: performer, genre: genre, price: price, day: day, image: image });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.modifyById = async (req, res) => {
  const { performer, genre, price, day, image } = req.body;
  try {
    const crt = await Concert.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { performer: performer, genre: genre, price: price, day: day, image: image } },
      { new: true } // This option returns the updated document
    );

    if (!crt) {
      return res.status(404).json({ message: 'Not found...' });
    }

    res.json(crt);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.removeById = async (req, res) => {
  try {
    const crt = await Concert.findById(req.params.id);

    if (!crt) {
      return res.status(404).json({ message: 'Not found...' });
    }

    const deletedCrt = await Concert.findOneAndDelete({ _id: req.params.id });

    res.json(deletedCrt);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

//

exports.getByPerformer = async (req, res) => {
  try {
    const concerts = await Concert.find({ performer: req.params.performer });
    console.log(concerts);
    res.json(concerts);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

exports.getByGenre = async (req, res) => {
  try {
    const concerts = await Concert.find({ genre: req.params.genre });
    res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getByPrice = async (req, res) => {
  try {
    const concerts = await Concert.find({ price: { $gte: Number(req.params.price_min), $lte: Number(req.params.price_max) } });
    res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getByDay = async (req, res) => {
  try {
    const concerts = await Concert.find({ day: Number(req.params.day) });
    res.json(concerts);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};
