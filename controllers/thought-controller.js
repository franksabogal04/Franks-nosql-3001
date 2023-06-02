const { User, Thought } = require('../models');

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find()
      .populate('reactions')
      .select('-__v')
      .then(thoughtData => res.json(thoughtData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getThoughtById(req, res) {
    Thought.findById(req.params.id)
      .populate('reactions')
      .select('-__v')
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createThought(req, res) {
    Thought.create(req.body)
      .then(thoughtData => {
        return User.findByIdAndUpdate(
          thoughtData.userId,
          { $push: { thoughts: thoughtData._id } },
          { new: true }
        );
      })
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  updateThought(req, res) {
    Thought.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  deleteThought(req, res) {
    Thought.findByIdAndDelete(req.params.id)
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        return User.findByIdAndUpdate(
          thoughtData.userId,
          { $pull: { thoughts: thoughtData._id } },
          { new: true }
        );
      })
      .then(userData => res.json({ message: 'Thought and associated reactions deleted' }))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true, runValidators: true }
    )
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  deleteReaction(req, res) {
    Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then(thoughtData => {
        if (!thoughtData) {
          return res.status(404).json({ message: 'Thought not found' });
        }
        res.json(thoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  }
};

module.exports = thoughtController;
