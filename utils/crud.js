const getOne = (model) => async (req, res) => {
  try {
    const doc = await model
      .findOne({ createdBy: req.user._id, _id: req.params.id })
      .lean()
      .exec();
    if (!doc) {
      return res.status(400).end();
    }
    res.status(200).json({ data: doc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};
const getMany = (model) => async (req, res) => {
  try {
    const docs = await model.find({ createdBy: req.user._id }).lean().exec();

    res.status(200).json({ data: docs });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};
const createOne = (model) => async (req, res) => {
  const createdBy = req.user._id;
  try {
    const doc = await model.create({ ...req.body, createdBy });
    res.status(201).json({ data: doc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};
const updateOne = (model) => async (req, res) => {
  try {
    const updatedDoc = model
      .findOneAndUpdate(
        {
          createdBy: req.user._id,
          _id: req.params.id,
        },
        req.body,
        { new: true }
      )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).end();
    }
    res.status(200).json({ data: updatedDoc });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};
const removeOne = (model) => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      createdBy: req.user._id,
      _id: req.params.id,
    });
    if (!removed) {
      return res.status(400).end();
    }
    return res.status(200).json({ data: removed });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

module.exports = crudControllers = (model) => ({
  getMany: getMany(model),
  getOne: getOne(model),
  createOne: createOne(model),
  updateOne: updateOne(model),
  removeOne: removeOne(model),
});
