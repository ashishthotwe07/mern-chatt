import { X, Trash2 } from "lucide-react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser, clearChat } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullname} />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser.fullname}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Clear Chat Button */}
                    <button
                        className="p-2 rounded hover:bg-red-100"
                        onClick={async () => {
                            if (confirm("Are you sure you want to clear this chat?")) {
                                await clearChat();
                            }
                        }}
                        title="Clear Chat"
                    >
                        <Trash2 className="text-red-500" />
                    </button>

                    {/* Close Button */}
                    <button onClick={() => setSelectedUser(null)} title="Close Chat">
                        <X />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
