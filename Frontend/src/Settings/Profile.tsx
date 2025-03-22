import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { authService } from "../authService";
import defaultAvatar from "./defaultpic.jpg";

// Define the UserProfile interface
interface UserProfile {
  avatar: string;
  name: string;
  email: string;
  phone?: string; // Make phone optional as we'll be removing it
}

interface ProfileProps {
  activeTab: string;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile = ({ activeTab, userProfile, setUserProfile }: ProfileProps) => {
  // Reference to the file input element
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract username from email (everything before @)
  const extractUsername = (email: string): string => {
    const atIndex = email.indexOf('@');
    if (atIndex !== -1) {
      // Return the part before @ and capitalize first letter
      const username = email.substring(0, atIndex);
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    return email;
  };

  // Add useEffect to fetch user email when component mounts
  useEffect(() => {
    // Get user email from localStorage using authService
    const userEmail = authService.getUserEmail();
    
    if (userEmail && userEmail !== userProfile.email) {
      // Extract username from email
      const username = extractUsername(userEmail);
      
      setUserProfile({
        ...userProfile,
        email: userEmail,
        name: username, // Set name based on email
        avatar: userProfile.avatar || defaultAvatar // Set default avatar if not present
      });
    } else if (!userProfile.avatar) {
      // Ensure default avatar is set even if email doesn't change
      setUserProfile({
        ...userProfile,
        avatar: defaultAvatar
      });
    }
  }, [userProfile, setUserProfile]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      // Update the user profile with the new avatar
      setUserProfile({
        ...userProfile,
        avatar: imageUrl
      });
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {activeTab === "profile" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            Profile Information
          </h2>
          <div className="space-y-6">
            {/* Profile Avatar Section with Properly Centered Content */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="md:w-1/3 flex justify-center md:justify-start">
                <img
                  src={userProfile.avatar || defaultAvatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-2 border-emerald-500 object-cover"
                />
              </div>
              <div className="md:w-2/3">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                {/* Button that triggers the hidden file input */}
                <button 
                  onClick={handleUploadClick}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                >
                  Upload New Photo
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <h3 className="font-semibold mb-4">Change Password</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••"
                    className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
                  
            <div className="flex justify-end">
              <button className="px-6 py-2 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Profile;