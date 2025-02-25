const Habit = require("../models/habit");
const Backup = require("../models/backup");

module.exports.index = async (req, res) => {
  const habits = await Habit.find();
  res.json({ data: habits });
};

module.exports.find = async (req, res) => {
  console.log(req.params.id);
  const habit = await Habit.findOne({ id: req.params.id });
  res.json({ data: habit });
};

module.exports.getFriend = async (req, res) => {
  console.log(req.params.name);
  const habit = await Habit.findOne({ name: req.params.name });
  res.json({ data: habit });
};

module.exports.createupdate = async (req, res) => {
  const { name, token } = req.body;
  const user = await Habit.findOne({ name });
  if (!user) {
    const habit = new Habit({ name, token });
    await habit.save();
    res.json({ data: habit });
  } else {
    const habit = await Habit.findOneAndUpdate({ name }, { token });
    res.json({ data: habit });
  }
};

module.exports.getBackUp = async (req, res) => {
  const { name, date, pin } = req.query;
  console.log("date", date);
  const backup = await Backup.find({
    name,
    pin,
    createdAt: { $gte: new Date(date).toISOString() },
  });

  if (backup.length === 0) {
    const lastBackup = await Backup.find({ name, pin }).sort({
      createdAt: -1,
    });

    if (!lastBackup) {
      return res.json({ data: null, meta: { lastServerBackupTime: null } });
    }
    res.json({
      data: null,
      meta: { lastServerBackupTime: lastBackup.createdAt },
    });
  }
  res.json({ data: backup });
};

module.exports.uploadBackup = async (req, res) => {
  const { name, pin, backup } = req.body;
  const backupDto = new Backup({ name, pin, backup });
  await backupDto.save();
  res.json({ data: backup });
};
