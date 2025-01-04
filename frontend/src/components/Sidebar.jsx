import { useEffect, useState } from "react";
import SidebarSkeleton from "../skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import useChatStore from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUser, setProfileUser] = useState(null); // Store the user for the modal

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleUserClick = (user) => {
    setSelectedUser(user); // Open chat window
    setShowProfileModal(false); // Close modal if open
  };

  const handleImageClick = (user, e) => {
    e.stopPropagation(); // Prevent chat opening when image is clicked
    setProfileUser(user); // Set user for the modal
    setShowProfileModal(true); // Open the modal
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileUser(null); // Clear modal user
  };

  // if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors cursor-pointer
            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
            onClick={() => handleUserClick(user)} // Open chat window when clicking anywhere except the image
          >
            <div
              className="relative mx-auto lg:mx-0 cursor-pointer"
              onClick={(e) => handleImageClick(user, e)} // Open profile modal when clicking on the image
            >
              <img
                src={user.profilePic || "https://github.com/burakorkmez/fullstack-chat-app/blob/master/frontend/public/avatar.png?raw=true"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:flex flex-col text-left min-w-0">
              <span className="font-medium truncate">{user.fullname}</span>
              <span className="text-sm text-zinc-400 truncate">
                {user.latestChat
                  ? user.latestChat.text
                    ? user.latestChat.text
                    : user.latestChat.image
                      ? "image"
                      : ""
                  : ""}
              </span>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfileModal && profileUser && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeProfileModal} // Close modal when clicking outside
        >
          <div
            className="m-4 w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg border bg-white px-4 pt-6 pb-8 shadow-lg relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeProfileModal} // Close modal when clicking the button
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Profile Picture */}
            <div className="relative mx-auto w-28 rounded-full">
              <img
                className="mx-auto w-24 h-24 rounded-full object-cover"
                src={profileUser.profilePic}
                alt={profileUser.fullname}
              />
            </div>

            {/* User Info */}
            <h1 className="my-2 text-center text-lg md:text-xl font-bold leading-7 text-gray-900">
              {profileUser.fullname}
            </h1>
            <h3 className="text-sm md:text-base text-center leading-5 text-gray-600">
              Welcome to the chat app!
            </h3>

            {/* Status and Joined Date */}
            <ul className="mt-3 divide-y rounded bg-gray-100 py-2 px-3 text-gray-600 shadow-sm hover:text-gray-700 hover:shadow">
              <li className="flex items-center py-2 text-xs md:text-sm">
                <span>Status</span>
                <span className="ml-auto">
                  <span className="rounded-full bg-green-200 py-1 px-2 text-xs md:text-sm font-medium text-green-700">
                    Active
                  </span>
                </span>
              </li>
              <li className="flex items-center py-2 text-xs md:text-sm">
                <span>Joined On</span>
                <span className="ml-auto">
                  {new Date(profileUser.createdAt).toLocaleDateString("en-US") ||
                    "Unknown"}
                </span>
              </li>
            </ul>

            {/* Send Message Button */}
            <button
              onClick={() => {
                closeProfileModal();
                handleUserClick(profileUser); // Open chat when clicking "Send Message"
              }}
              className="bg-blue-500 text-white py-2 px-3 rounded-lg w-full mt-4 hover:bg-blue-600"
            >
              Send Message
            </button>
          </div>
        </div>
      )}



    </aside>
  );
};

export default Sidebar;
