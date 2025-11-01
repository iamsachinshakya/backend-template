import mongoose, { Schema } from "mongoose";

/**
 * Subscription Schema
 * --------------------
 * Represents a "follow" or "subscribe" relationship between users.
 * Example: User A (subscriber) subscribes to User B (channel).
 */
const subscriptionSchema = new Schema(
  {
    /**
     * The user who is subscribing.
     * e.g., User A subscribing to another user's channel.
     */
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * The user being subscribed to (the channel owner).
     * e.g., User B whose channel is being followed by User A.
     */
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
