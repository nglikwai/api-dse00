const mongoose = require("mongoose");
const Jupas = require("../models/jupas");

const score = `2022|1000|5*|5|5**|5*|5**|5|4|City University of Hong Kong |Bachelor of Science in Computational Finance and Financial Technology/2022|2410|3|4|5*|4|4|5*||Hong Kong Baptist University|Bachelor of Chinese Medicine and Bachelor of Science (Hons) in Biomedical Science/2021|3070|3|3|4|3|5|5||The Hong Kong Polytechnic University|Aviation, Maritime and Supply Chain Management - BBA (Hons) Scheme/2022|3180|3|3|3|3|5|4||The Hong Kong Polytechnic University |Information and Artificial Intelligence Engineering - BEng (Hons) BSc (Hons) Scheme/2020|3337|4|4|4|5*|3|4|3|The Hong Kong Polytechnic University |Mental Health Nursing - BSc (Hons) Scheme in Nursing/2021|3478|4|5|5**|4|5*|5*||The Hong Kong Polytechnic University |Medical Laboratory Science - BSc (Hons) Scheme in Medical Laboratory Science and Radiography/2020|3612|5*|5|4|4|5**|5*|5|The Hong Kong Polytechnic University |Radiography - BSc (Hons) Scheme in Medical Laboratory Science and Radiography/2022|3612|4|4|5*|5**|5*|5||The Hong Kong Polytechnic University |Radiography - BSc (Hons) Scheme in Medical Laboratory Science and Radiography/2021|3636|4|5*|5*|4|5*|5||The Hong Kong Polytechnic University |Physiotherapy - BSc (Hons) Scheme in Rehabilitation Sciences/2021|3636|4|5|5*|5|5*|5*|5|The Hong Kong Polytechnic University |Physiotherapy - BSc (Hons) Scheme in Rehabilitation Sciences/2021|3120|3|3|5*|4|4|5||The Hong Kong Polytechnic University |Civil Engineering and Sustainable Development - BEng (Hons) Scheme/2022|4123|5**|5**|4|4|4|4|4|The Chinese University of Hong Kong|Translation/2021|4202|4|4|5|4|4|4|4|The Chinese University of Hong Kong|Integrated BBA/2021|4240|4|4|5|4|4|4||The Chinese University of Hong Kong|Professional Accountancy/2022|4501|4|5*|5**|5|5**|5*|5*|The Chinese University of Hong Kong|"Medicine (MBChB) Programme"/2021|4513|4|5*|5*|4|5|4|3|The Chinese University of Hong Kong|Nursing/2022|4550|5*|5|5*|5*|5*|5*|5|The Chinese University of Hong Kong|Biomedical Sciences/2020|4601|4|5|5|4|4|4|5|The Chinese University of Hong Kong|Science (broad-based)/2022|4601|4|3|5|4|4|4|4|The Chinese University of Hong Kong|Science (broad-based)/2022|4682|3|4|5**|4|5*|5*||The Chinese University of Hong Kong|Enrichment Mathematics/2022|4850|5|4|4|4|5**|4||The Chinese University of Hong Kong|Journalism and Communication/2022|5200|3|4|5*|3|5*|5|3|The Hong Kong University of Science and Technology|Engineering/2022|5282|4|5|5|5|5|5|4|The Hong Kong University of Science and Technology|Engineering with an Extended Major in Artificial Intelligence/2022|5300|3|5|4|4|4|4|5|The Hong Kong University of Science and Technology|Business & Management/2022|5332|3|5|5*|4|5**|5**|5*|The Hong Kong University of Science and Technology|BSc in Quantitative Finance/2021|6107|4|5*|5**|5|5**|5**||The University of Hong Kong|Bachelor of Dental Surgery/2022|6107|5*|4|5**|5|5**|5**|5*|The University of Hong Kong|Bachelor of Dental Surgery/2021|6456|5|5*|5**|5|5**|5**|5**|The University of Hong Kong|Bachelor of Medicine and Bachelor of Surgery/2020|6456|5**|5**|5**|5**|5**|5**|5**|The University of Hong Kong|Bachelor of Medicine and Bachelor of Surgery/2022|6729|5|4|5|5*|5*|5*||The University of Hong Kong|Bachelor of Science in Actuarial Science/2020|6808|5*|5**|5|5|5*|5*||The University of Hong Kong|Bachelor of Business Administration (Law) and Bachelor of Laws (double degree)/2022|6901|4|4|4|3|4|5||The University of Hong Kong|Bachelor of Science/2021|6901|3|4|5*|4|5|5|5|The University of Hong Kong|Bachelor of Science/2021|6937|5|5**|5*|5**|5*|5*|5*|The University of Hong Kong|Global Engineering and Business Programme/2020|6963|3|3|5*|4|4|5|5|The University of Hong Kong|Bachelor of Engineering/2021|8246|3|4|5|5|4|3||The Education University of Hong Kong|BEd (Primary) - Mathematics`

const splited = score.split('/')

const handleScore = (w) => {
    if (w === '5**') {
        return 7
    }
    if (w === '5*') {
        return 6
    }
    if (w === '') {
        return null
    }
    return parseInt(w)
}

const jupases = splited.map(record => {
    const splitRecord = record.split('|')
    return {
        year: handleScore(splitRecord[0]),
        code: handleScore(splitRecord[1]),
        chin: handleScore(splitRecord[2]),
        eng: handleScore(splitRecord[3]),
        math: handleScore(splitRecord[4]),
        ls: handleScore(splitRecord[5]),
        e1: handleScore(splitRecord[6]),
        e2: handleScore(splitRecord[7]),
        e3: handleScore(splitRecord[8]),
        school: splitRecord[9],
        program: splitRecord[10],
    }
})


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
    console.log("Database connected likwai");
});



const seedDB = async () => {
    await Jupas.deleteMany({});
    for (let i = 0; i < jupases.length; i++) {
        const jupas = new Jupas(jupases[i]);
        console.log(jupas);
        await jupas.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
