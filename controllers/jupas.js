const Jupas = require('../models/jupas');
const Gradtrip = require('../models/gradtrip');
const Shrine = require('../models/shrine');


module.exports.searchCode = async (req, res) => {
    if (req.query.code) {
        if (!(req.query.code > 0)) {
            req.flash('error', '只輸入 4 位數字 code');
            res.redirect('/jupas/code')
        }
        const code = req.query.code;
        console.log(code);
        const jupases = await Jupas.find({ code })
        return res.render('jupas/index', { jupases })
    }
    const jupases = await Jupas.find({})
    res.render('jupas/index', { jupases })
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

module.exports.createShrine = async (req, res, next) => {
    const { content } = req.body
    if (content.length < 11) {
        return res.json({ state: 'error' })
    }
    const shrine = new Shrine(req.body);

    await shrine.save();
    res.json({ status: 'success', post: shrine });
};