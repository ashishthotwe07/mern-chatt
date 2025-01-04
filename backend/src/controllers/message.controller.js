import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from 'cloudinary';
import { getReceiverSocketId, io } from '../libs/socket.js';


export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    // Fetch all users excluding the current authenticated user
    const users = await User.find({ _id: { $ne: currentUserId } }).select('-password'); // Exclude the password field

    // Fetch the latest message for each user
    const usersWithLatestChat = await Promise.all(
      users.map(async (user) => {
        const latestMessage = await Message.findOne({
          $or: [
            { senderId: currentUserId, receiverId: user._id },
            { senderId: user._id, receiverId: currentUserId },
          ],
        })
          .sort({ createdAt: -1 }) // Sort by newest first
          .select('text image createdAt'); // Fetch the text, image, and creation time

        return {
          ...user.toObject(),
          latestChat: latestMessage
            ? {
              text: latestMessage.text || null,
              image: latestMessage.image || null,
              createdAt: latestMessage.createdAt,
            }
            : null,
        };
      })
    );

    // Sort users based on the latest chat timestamp
    usersWithLatestChat.sort((a, b) => {
      if (!a.latestChat && !b.latestChat) return 0; // No chats for both
      if (!a.latestChat) return 1; // A has no chat, B goes first
      if (!b.latestChat) return -1; // B has no chat, A goes first
      return new Date(b.latestChat.createdAt) - new Date(a.latestChat.createdAt); // Newest chat first
    });

    res.status(200).json(usersWithLatestChat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};



export const getMessages = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { id } = req.params; // Get the receiver's user ID from the request parameters

    // Fetch the messages between the current authenticated user and the specified user (id)
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: id },
        { senderId: id, receiverId: currentUserId }
      ]
    })

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.id; // Get the receiver's user ID from the URL parameter
    const { text, image } = req.body;
    const senderId = req.user._id;

    if (!receiverId || (!text && !image)) {
      return res.status(400).json({ message: 'Either text or image is required' });
    }

    let imageUrl = null;
    if (image) {
      // Upload the image to Cloudinary
      const uploadedImage = await cloudinary.v2.uploader.upload(image, {
        folder: 'messages',
      });
      imageUrl = uploadedImage.secure_url;
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || null,
      image: imageUrl || null,
    });

    // Save the message to the database
    await newMessage.save();


    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};