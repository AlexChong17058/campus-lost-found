const Item = require("../models/Item");

// GET ALL ITEMS (with filter support)
exports.getItems = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.mine === "true") {
      if (!req.user) {
        return res.status(401).json({ message: "Please log in to view your reports" });
      }
      filter.user = req.user._id;
    }

    const items = await Item.find(filter).sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET ITEM BY ID
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
};

// CREATE ITEM
exports.createItem = async (req, res, next) => {
  try {
    const item = await Item.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

// UPDATE ITEM
exports.updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only edit your own report",
      });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json(item);
  } catch (err) {
    next(err);
  }
};

// UPDATE STATUS
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update your own report",
      });
    }

    item.status = status;
    await item.save();

    res.json(item);
  } catch (err) {
    next(err);
  }
};

// DELETE ITEM
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete your own report",
      });
    }

    await item.deleteOne();

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// GET ITEM STATISTICS
exports.getItemStats = async (req, res, next) => {
  try {

    const stats = await Item.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      Active: 0,
      Claimed: 0,
      Resolved: 0
    };

    stats.forEach(s => {
      result[s._id] = s.count;
      result.total += s.count;
    });

    res.json(result);

  } catch (err) {
    next(err);
  }
};