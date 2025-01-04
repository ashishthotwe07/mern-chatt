import useChatStore from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import useAuthStore from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
        deleteMessage,
    } = useChatStore();
    const { authUser } = useAuthStore();
    const messageEndRef = useRef(null);

    const [contextMenu, setContextMenu] = useState(null);
    const [selectedMessageId, setSelectedMessageId] = useState(null);

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView();
        }
    }, [messages]);

    const handleContextMenu = (event, messageId) => {
        event.preventDefault();
        setSelectedMessageId(messageId);
        setContextMenu({
            x: event.clientX,
            y: event.clientY,
        });
    };

    const handleDeleteMessage = () => {
        if (selectedMessageId) {
            const message = messages.find(msg => msg._id === selectedMessageId);
            if (message && message.senderId === authUser._id) {
                deleteMessage(selectedMessageId);
            }
        }
        setContextMenu(null);
    };

    const closeContextMenu = () => {
        setContextMenu(null); // Close context menu when clicking anywhere outside the bubble
    };

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div
            className="flex-1 flex flex-col overflow-auto"
            onClick={closeContextMenu} // Close context menu on click anywhere
        >
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <div
                            key={message._id}
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                            ref={messageEndRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img
                                        src={
                                            message.senderId === authUser._id
                                                ? authUser.profilePic || "/avatar.png"
                                                : selectedUser.profilePic || "/avatar.png"
                                        }
                                        alt="profile pic"
                                    />
                                </div>
                            </div>
                            <div className="chat-header mb-1">
                                <time className="text-xs opacity-50 ml-1">
                                    {formatMessageTime(message.createdAt)}
                                </time>
                            </div>
                            <div
                                className={`chat-bubble flex flex-col ${message.senderId === authUser._id
                                    ? "bg-primary text-primary-content"
                                    : "bg-base-300 text-gray-500"
                                    }`}
                                onContextMenu={(event) => handleContextMenu(event, message._id)} // Trigger context menu
                            >
                                {message.image && (
                                    <img
                                        src={message.image}
                                        alt="Attachment"
                                        className="sm:max-w-[200px] rounded-md mb-2"
                                    />
                                )}
                                {message.text && <p>{message.text}</p>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-10">
                        Start a conversation with {selectedUser.name}!
                    </div>
                )}
            </div>

            <MessageInput />

            {/* Custom Context Menu */}
            {contextMenu && (
                <div
                    className="absolute bg-white border rounded-lg shadow-lg p-3"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                    }}
                >
                    <div
                        className="cursor-pointer text-red-500 text-sm"
                        onClick={handleDeleteMessage}
                    >
                        {messages.find(msg => msg._id === selectedMessageId)?.senderId === authUser._id
                            ? "Delete Message"
                            : "Report"}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;
