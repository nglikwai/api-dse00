const Tutor = require('../models/tutor');
const Case = require('../models/case');

module.exports.renderTutors = async (req, res) => {

    const { limit, page } = req.query
    const options = { limit, page }
    const tutors = await Tutor.paginate({}, options);
    res.json(tutors.docs);
}

module.exports.renderTutor = async (req, res) => {
    const tutor = await Tutor.findById(req.params.id);
    res.json([tutor]);
}

module.exports.renderCase = async (req, res) => {
    const caseUnit = await Case.find({});
    res.json(caseUnit)
}


module.exports.renderCaseUnit = async (req, res) => {
    const caseUnit = await Case.findById(req.params.id);
    res.json(caseUnit)
}

module.exports.searchTutors = async (req, res) => {
    const locations = ['中西區', '東區', '南區', '灣仔', '九龍城', '觀塘', '深水埗', '黃大仙', '油尖旺', '離島', '葵青', '北區', '西貢', '沙田', '大埔', '荃灣', '屯門', '元朗'];
    const subjects = ['中文', 'eng', 'math', 'ls', 'phy', 'chem', 'bio', 'econ', 'bafs', 'geo', 'history', '中國歷史']
    const gender = req.query.gender || ['m', 'f']
    const location = req.query.location || locations;
    const subject = req.query.subject || subjects;
    const price = req.query.price || 0;
    const tutors = await Tutor.find({ teachingSubjectsPrice: { $lte: price }, location: { $in: location }, teachingSubjects: { $in: subject }, gender: { $in: gender } })
    res.json(tutors);
}

