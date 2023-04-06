const mongoose = require('mongoose');

const familys = [
    {
        id: 'dad',
        name: '爸爸 / 大姑爺',
        reference: 'GEYJSE',
        locations: ['東京', '香港']
    },
    {
        id: 'mum',
        name: '媽媽 /大姑媽',
        reference: 'D14J8L',
        locations: ['大阪']

    },
    {
        id: 'likwai',
        name: '力維',
        reference: 'E2NZ8V',
        locations: ['大阪', '香港']

    },
    {
        id: 'kawing',
        name: '嘉穎',
        reference: 'X84PJZ',
        locations: ['大阪']

    }

];

const Family = require("../models/family");;

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
    await Family.deleteMany({});
    for (let i = 0; i < familys.length; i++) {
        const family = new Family(familys[i]);
        console.log(family);
        await family.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
