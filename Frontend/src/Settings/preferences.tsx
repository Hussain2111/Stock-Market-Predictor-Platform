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

const PreferencesComponent = ({activeTab, preferences, setPreferences}: PreferencesProps) => {
    return (
        <>
        {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Preferences</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Email Alerts</div>
                            <div className="text-sm text-gray-400">
                              Receive important updates via email
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.emailAlerts}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  emailAlerts: !preferences.emailAlerts,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              Push Notifications
                            </div>
                            <div className="text-sm text-gray-400">
                              Receive alerts in your browser
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.pushNotifications}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  pushNotifications:
                                    !preferences.pushNotifications,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">SMS Alerts</div>
                            <div className="text-sm text-gray-400">
                              Receive text messages for urgent updates
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.smsAlerts}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  smsAlerts: !preferences.smsAlerts,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Display Settings</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Dark Mode</div>
                            <div className="text-sm text-gray-400">
                              Use dark theme for interface
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.darkMode}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  darkMode: !preferences.darkMode,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Auto Refresh</div>
                            <div className="text-sm text-gray-400">
                              Automatically refresh data every 5 minutes
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.autoRefresh}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  autoRefresh: !preferences.autoRefresh,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Analysis Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 mb-2">
                            Default Timeframe
                          </label>
                          <select
                            value={preferences.defaultTimeframe}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                defaultTimeframe: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                          >
                            <option value="1m">1 Month</option>
                            <option value="3m">3 Months</option>
                            <option value="6m">6 Months</option>
                            <option value="1y">1 Year</option>
                            <option value="5y">5 Years</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2">
                            Prediction Horizon
                          </label>
                          <select
                            value={preferences.predictionHorizon}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                predictionHorizon: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                          >
                            <option value="1d">1 Day</option>
                            <option value="3d">3 Days</option>
                            <option value="7d">1 Week</option>
                            <option value="14d">2 Weeks</option>
                            <option value="30d">1 Month</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
        </>
    )
}

export default PreferencesComponent;