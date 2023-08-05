const Seat = require('../models/seat.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Seat.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getRandom = async (req, res) => {
  try {
    const count = await Seat.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const seat = await Seat.findOne().skip(rand);
    if(!seat) res.status(404).json({ message: 'Not found' });
    else res.json(seat);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);
    if(!seat) res.status(404).json({ message: 'Not found' });
    else res.json(seat);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

// mod: add filtering for preventing HTML injections to name/email
exports.addNew = async (req, res) => {
  
  try {
    const { day, seat, client, email } = req.body;
    // Regular Expressions for name and email validation
    const clientRegex = /^[a-zA-Z '-]+$/;
    const emailRegex = /^\S+@\S+\.\S+$/;

    // validation
    if (!day || !seat || !client || !email) {
      return res.status(400).json({ error: 'One or more mandatory fields omitted.' });
    }

    // Validate client and email
    if (!clientRegex.test(client)) {
      return res.status(400).json({ error: 'Invalid characters in client name.' });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // parse int
    const parsedDay = parseInt(day);
    const parsedSeat = parseInt(seat);
    // check if int
    if (isNaN(parsedDay) || isNaN(parsedSeat)) {
      return res.status(400).json({ error: 'Invalid day or seat value.' });
    }
    // check if taken
    const isTaken = await Seat.exists({ day: parsedDay, seat: parsedSeat });
    if (isTaken) {
      return res.status(409).json({ message: 'The slot is already taken...' });
    }
    // database
    const newSeat = new Seat({ day: parsedDay, seat: parsedSeat, client: client, email: email });
    await newSeat.save();
    // Log all seats
    const allSeats = await Seat.find();
    // websocket
    req.io.emit('seatsUpdated', allSeats);
    // response
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }
  
};


exports.modifyById = async (req, res) => {
  const { day, seat, client, email } = req.body;
  try {
    const seatMod = await Seat.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { day: day, seat: seat, client: client, email: email } },
      { new: true } // This option returns the updated document
    );

    if (!seatMod) {
      return res.status(404).json({ message: 'Not found...' });
    }

    res.json(seatMod);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.removeById = async (req, res) => {
  try {
    const seat = await Seat.findById(req.params.id);

    if (!seat) {
      return res.status(404).json({ message: 'Not found...' });
    }

    const deletedSeat = await Seat.findOneAndDelete({ _id: req.params.id });

    // Log all seats
    const allSeats = await Seat.find();
    // websocket
    req.io.emit('seatsUpdated', allSeats);

    res.json(deletedSeat);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
