const Jupas = require('../models/jupas');
const Gradtrip = require('../models/gradtrip');
const Shrine = require('../models/shrine');


module.exports.searchCode = async (req, res) => {

    const filter = {}
    Object.keys(req.query).forEach(item => {
        filter[item] = req.query[item]
    })
    const jupases = await Jupas.find(filter)

    res.json({ data: jupases })
}
module.exports.createRecord = async (req, res) => {
    const record = new Jupas(req.body)
    console.log(req.body)
    await record.save()
    res.json({ data: record })
}


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
    const count = {}
    gradTrips.forEach(item => {
        if (count[item.trip]) {
            count[item.trip] += 1
        } else {
            count[item.trip] = 1
        }
    })
    res.json(count);

};

module.exports.getShrine = async (req, res) => {
    const { shrine, subShrine, name, date, id } = req.query
    const filter = {}
    if (shrine) {
        filter.shrine = shrine
    }
    if (subShrine) {
        filter.subShrine = subShrine
    }
    if (name) {
        filter.name = name
    }
    if (date) {
        filter.date = date
    }
    if (id) {
        filter.id = id
    }
    console.log(filter)
    const shrines = await Shrine.find(filter);
    res.json({ data: shrines });
};


module.exports.getOneShrine = async (req, res) => {
    const { id } = req.params;

    console.log(id)
    const shrine = await Shrine.findById(id);
    res.json({ data: shrine });
};



module.exports.createShrine = async (req, res, next) => {
    const { content } = req.body
    if (content.length < 11) {
        return res.json({ state: 'error' })
    }
    const shrine = new Shrine(req.body);

    await shrine.save();
    res.json({ status: 'success', data: shrine });
};