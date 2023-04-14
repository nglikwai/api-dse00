const Jupas = require('../models/jupas');
const Gradtrip = require('../models/gradtrip');


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
        console.log('exist and update');

        gradTrip.trip = trip;
        // await gradTrip.save();
        res.json({ updated: gradTrip });
    } else {
        console.log('new');
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