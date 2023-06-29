const mongoose = require("mongoose");
const Jupas = require("../../models/jupas");
const jupases = require('./cutoff.json')


mongoose.connect(
  "mongodb+srv://nglikwai:dse00com@cluster0.hwgq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const handleScore = (w) => {
  if (typeof (w) === 'number') {
    return w
  }
  if (w === '5**') {
    return 7
  }
  if (w === '5*') {
    return 6
  }
  if (w && w.replaceAll(' ', '') === '') {
    return null
  }
}

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected likwai");
});


const seedDB = async () => {
  await Jupas.deleteMany({});
  for (let i = 0; i < jupases.length; i++) {
    const jupas = new Jupas(jupases[i]);
    jupas.chin = handleScore(jupas.chin)
    jupas.eng = handleScore(jupas.eng)
    jupas.math = handleScore(jupas.math)
    jupas.ls = handleScore(jupas.ls)
    jupas.e1 = handleScore(jupas.e1)
    jupas.e2 = handleScore(jupas.e2)
    jupas.e3 = handleScore(jupas.e3)
    jupas.m1m2 = handleScore(jupas.m1m2)
    console.log(jupas)
    await jupas.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
