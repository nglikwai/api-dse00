const Jupas = require("../models/jupas");
const Gradtrip = require("../models/gradtrip");
const Shrine = require("../models/shrine");

module.exports.searchCode = async (req, res) => {
  const filter = {};
  Object.keys(req.query).forEach((item) => {
    filter[item] = req.query[item];
  });
  const jupases = await Jupas.find(filter);

  if (jupases.length === 0) {
    res.status(404).json({ error: "抱歉，沒有記錄" });
    return;
  }
  res.json({ data: jupases });
};
module.exports.getRecent = async (req, res) => {
  const jupases = await Jupas.find({}).sort({ _id: -1 }).limit(10);
  res.json({ data: jupases });
};

module.exports.createRecord = async (req, res) => {
  const record = new Jupas(req.body);
  console.log(req.body);
  await record.save();
  res.json({ data: record });
};

module.exports.editRecord = async (req, res) => {
  const { id, like, dislike } = req.body;
  const record = await Jupas.findById(id);

  if (like) {
    record.like += 1;
  }
  if (dislike) {
    record.dislike += 1;
  }
  await record.save();
  res.json({ data: record });
};

module.exports.gradtrip = async (req, res) => {
  const { username, trip } = req.body;
  const gradTrip = await Gradtrip.findOne({ username });

  if (gradTrip) {
    gradTrip.trip = trip;
    await gradTrip.save();
    res.json({ updated: gradTrip });
  } else {
    const newTrip = new Gradtrip({ username, trip });
    await newTrip.save();
    res.status(200).json({ newTrip });
  }
};

module.exports.gradtripReport = async (req, res) => {
  const gradTrips = await Gradtrip.find({});
  const count = {};
  gradTrips.forEach((item) => {
    if (count[item.trip]) {
      count[item.trip] += 1;
    } else {
      count[item.trip] = 1;
    }
  });
  res.json(count);
};

module.exports.getShrine = async (req, res) => {
  const { shrine, subShrine, name, date, id } = req.query;
  const filter = {};
  if (shrine) {
    filter.shrine = shrine;
  }
  if (subShrine) {
    filter.subShrine = subShrine;
  }
  if (name) {
    filter.name = name;
  }
  if (date) {
    filter.date = date;
  }
  if (id) {
    filter.id = id;
  }
  console.log(filter);
  const shrines = await Shrine.find(filter);
  res.json({ data: shrines });
};

module.exports.getOneShrine = async (req, res) => {
  const { id } = req.params;

  console.log(id);
  const shrine = await Shrine.findById(id);
  res.json({ data: shrine });
};

module.exports.createShrine = async (req, res, next) => {
  const { content } = req.body;
  if (content.length < 3) {
    return res.json({ state: "字數太短" });
  }
  const shrine = new Shrine(req.body);

  await shrine.save();
  res.json({ status: "success", data: shrine });
};

module.exports.donateShrine = async (req, res, next) => {
  const { id } = req.body;
  const shrine = await Shrine.findById(id);
  shrine.donation = 1;
  await shrine.save();
  res.json({ status: "success", data: shrine });
};
