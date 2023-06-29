const mongoose = require("mongoose");
const Jupas = require("../../models/jupas");

mongoose.connect(
  "mongodb+srv://nglikwai:dse00com@cluster0.hwgq8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  // await Jupas.deleteMany({});
  for (let i = 0; i < jupases.length; i++) {
    for (let j = 0; j < jupases[i].cutoffs.length; j++) {
      const jupas = new Jupas(jupases[i]);
      jupas.chin = jupases[i].cutoffs[j][0]
      jupas.eng = jupases[i].cutoffs[j][1]
      jupas.math = jupases[i].cutoffs[j][2]
      jupas.ls = jupases[i].cutoffs[j][3]
      jupas.e1 = jupases[i].cutoffs[j][4]
      jupas.e2 = jupases[i].cutoffs[j][5]
      jupas.e3 = jupases[i]?.cutoffs[j][6]
      console.log(jupas)
      await jupas.save();
    }
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
