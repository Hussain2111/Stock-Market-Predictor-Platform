import { motion } from "framer-motion";
import { UserProfile } from "./data";

interface ProfileProps {
  activeTab: string;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile = ({ activeTab, userProfile, setUserProfile }: ProfileProps) => {
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
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="md:w-1/3">
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-2 border-emerald-500"
                />
              </div>
              <div className="md:w-2/3">
                <button className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">
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
              <div>
                <label className="block text-gray-400 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      phone: e.target.value,
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