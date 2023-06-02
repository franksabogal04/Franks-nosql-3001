const { User, Thought } = require('../models');

const userController = {
  getAllUsers(req, res) {
    User.find()
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then(userData => res.json(userData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getUserById(req, res) {
    User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends')
      .select('-__v')
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createUser(req, res) {
    User.create(req.body)
      .then(userData => res.json(userData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
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

  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.id)
      .then(userData => {
        if (!userData) {
          return res.status(404).json({ message: 'User not found' });
        }
        return Thought.deleteMany({ username: userData.username });
      })
      .then(() => res.json({ message: 'User and associated thoughts deleted' }))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
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

  removeFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
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
  }
};

module.exports = userController;
