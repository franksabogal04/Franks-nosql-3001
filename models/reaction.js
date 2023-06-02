const reactionSchema = new Schema({
    reactionId: {
      type: mongoose.Types.ObjectId,
      default: new mongoose.Types.ObjectId
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    username: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    }
  });
  