import { useState, useEffect } from "react";
import { Camera, Mail, User, Edit, Check, X } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

const Profile = () => {
    const { authUser, isUpdatingProfile, updateProfile, updateAccount, deleteAccount } = useAuthStore();
    const [selectedImg, setSelectedImg] = useState(null);
    const [editing, setEditing] = useState({ fullname: false, email: false });
    const [formData, setFormData] = useState({
        fullname: authUser?.fullname || "",
        email: authUser?.email || "",
    });
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        setIsChanged(
            formData.fullname !== authUser?.fullname || formData.email !== authUser?.email
        );
    }, [formData, authUser]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        await updateProfile(file);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveChanges = async (field) => {
        if (field === "fullname" && formData.fullname !== authUser?.fullname) {
            await updateAccount({ fullname: formData.fullname });
        } else if (field === "email" && formData.email !== authUser?.email) {
            await updateAccount({ email: formData.email });
        }
        setEditing({ ...editing, [field]: false });
    };

    const handleCancelChanges = (field) => {
        setFormData({
            ...formData,
            [field]: authUser[field],
        });
        setEditing({ ...editing, [field]: false });
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            await deleteAccount();
        }
    };

    return (
        <div className="pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    {/* Avatar upload section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={selectedImg || authUser.profilePic || "/avatar.png"}
                                alt="Profile"
                                className="size-32 rounded-full object-cover border-4 "
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-400">
                            {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                        </p>
                    </div>

                    {/* Profile details */}
                    <div className="space-y-6 mt-4">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </div>
                            <div className="relative">
                                {editing.fullname ? (
                                    <>
                                        <input
                                            type="text"
                                            name="fullname"
                                            value={formData.fullname}
                                            onChange={handleInputChange}
                                            className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full ${isChanged && formData.fullname ? "border-blue-500" : ""}`}
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                                            <Check
                                                className="w-5 h-5 cursor-pointer"
                                                onClick={() => handleSaveChanges("fullname")}
                                            />
                                            <X
                                                className="w-5 h-5 cursor-pointer"
                                                onClick={() => handleCancelChanges("fullname")}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullname}</p>
                                        <Edit
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            onClick={() => setEditing({ ...editing, fullname: true })}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <div className="relative">
                                {editing.email ? (
                                    <>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`px-4 py-2.5 bg-base-200 rounded-lg border w-full ${isChanged && formData.email ? "border-blue-500" : ""}`}
                                        />
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                                            <Check
                                                className="w-5 h-5 cursor-pointer"
                                                onClick={() => handleSaveChanges("email")}
                                            />
                                            <X
                                                className="w-5 h-5 cursor-pointer"
                                                onClick={() => handleCancelChanges("email")}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                                        <Edit
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                            onClick={() => setEditing({ ...editing, email: true })}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium mb-4">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member Since</span>
                                <span>{authUser.createdAt?.split("T")[0]}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>

                        {/* Delete Account Text */}
                        <div
                            className="text-sm text-red-500 font-semibold cursor-pointer mt-4"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </div>
                    </div>

                    {/* Save Changes */}
                    {editing.fullname || editing.email ? (
                        <div className="mt-6">
                            <button
                                onClick={handleSaveChanges}
                                className="btn btn-primary w-full"
                                disabled={isUpdatingProfile || !isChanged}
                            >
                                Save Changes
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Profile;
