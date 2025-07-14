import Message from "../models/message.model.js";

export const getUsers = async (req, res) => {

    console.log("Do we get here?")
    try {
        const loggedInUserId = req.user._id; // Get the logged-in user's ID from the request object
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // Find all users except the logged-in user   

        return res.status(200).json(filteredUsers);
    } catch (err) {
        console.error("Error occured: " + err.message);
        return res.status(500).json("Internal Server Error");
    }
}

export const getMessages = async (req, res) => {
    try {
        const {  id:userToChatId } = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({ 
            // Get messages either sent by the user or received with the same selected party
            // In the layout, you can sort the messages by datetime posted, and display on either side (right or left) of the page based on who was the sender.
            $or: [
                { sender: senderId, receiver: userToChatId },
                { sender: userToChatId, receiver: senderId }
            ]
        });
        // , (err, documents) => {
            // // THIS IS CUSTOM IMPLEMENTATION, MAKE SURE IT WORKS
            // // Sort in ascending order based on 'createdAt'
            // if (err) {
            //     console.error(err);
            //     return res.status(500).send("Internal state error.")
            // }

            // documents.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        // });

        // Sort messages based on datetime posted, from oldest to newest
        return res.status(200).json({ msg: messages });
    } catch (err) {

    }
}

export const sendMessages = async (req, res) => {

    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        
        if (!senderId || !receiverId) {
            console.log("Sender and receiver identifiers missing. Aborting...");
            return res.status(400).send("At least one of senderId and receiverId missing.");
        }

        if (!content && !picture) {
            console.log("Cannot send an empty message. Aborting...");
            return res.status(401).send("Cannot send empty message. Provide some content.")
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content: text || "",
            picture: image || "",
        })

        await newMessage.save();

        res.status(200).json({ message: "sent message successfully.", message: newMessage });
    } catch (err) {
        console.log("Error occured: " + err.message);
        return res.status(500).send("Internal state error.")
    }


}