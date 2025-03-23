import { motion } from "framer-motion";

interface Preferences {
    emailAlerts: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
    twoFactorAuth: boolean;
    darkMode: boolean;
    autoRefresh: boolean;
    defaultTimeframe: string;
    predictionHorizon: string;
  }

interface PreferencesProps {
    activeTab: string;
    preferences: Preferences;
    setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

const Security = ({activeTab, preferences, setPreferences}: PreferencesProps) => {
    return (
        <>
        {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Two-Factor Authentication
                        </div>
                        <div className="text-sm text-gray-400">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.twoFactorAuth}
                          onChange={() =>
                            setPreferences({
                              ...preferences,
                              twoFactorAuth: !preferences.twoFactorAuth,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                        <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                      </label>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Login Sessions</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                          <div>
                            <div className="font-medium">Current Session</div>
                            <div className="text-sm text-gray-400">
                              Chrome on MacOS • IP: 192.168.1.1
                            </div>
                            <div className="text-xs text-emerald-400 mt-1">
                              Active Now
                            </div>
                          </div>
                          <div>
                            <button className="text-gray-400 hover:text-gray-300">
                              This is you
                            </button>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                          <div>
                            <div className="font-medium">Previous Session</div>
                            <div className="text-sm text-gray-400">
                              Safari on iOS • IP: 192.168.1.2
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              2 days ago
                            </div>
                          </div>
                          <div>
                            <button className="text-red-400 hover:text-red-300">
                              Revoke
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4 text-red-400">
                        Danger Zone
                      </h3>
                      <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
        </>
    );
    }

    export default Security;