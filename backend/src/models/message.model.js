import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({}, { timestamps: true }); // Fill this in later

const Message = mongoose.model("Message", messageSchema);

export default Message;