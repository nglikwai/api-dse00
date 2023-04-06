const Family = require('../models/family');

module.exports.index = async (req, res) => {
    const familys = await Family.find()
    res.json({ data: familys })
}

module.exports.find = async (req, res) => {
    console.log(req.params.id)
    const family = await Family.findOne({ id: req.params.id })
    res.json({ data: family })
}

module.exports.update = async (req, res) => {
    console.log(req.params.id)
    const { id } = req.params
    const family = await Family.findOneAndUpdate({ id }, req.body)
    await family.save()
    const _family = await Family.find({ id: req.params.id })
    res.json({ data: _family })
}


module.exports.locationsRanks = async (req, res) => {
    const familys = await Family.find()
    let locations = []
    familys.forEach(family => {
        locations = locations.concat(family.locations)
    })
    const ranked_locations = countOccurrences(locations)

    res.json({ data: ranked_locations })
}


function countOccurrences(arr) {
    const occurrences = {};
    for (const val of arr) {
        occurrences[val] = (occurrences[val] || 0) + 1;
    }
    const sortedOccurrences = [];
    for (const [val, count] of Object.entries(occurrences)) {
        sortedOccurrences.push({ value: val, count });
    }
    sortedOccurrences.sort((a, b) => b.count - a.count);
    return sortedOccurrences;
}
