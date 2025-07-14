import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
    },
    image: {
        type: String,
        default: "",
    }
}, { timestamps: true }); // Fill this in later

const Message = mongoose.model("Message", messageSchema);

export default Message;