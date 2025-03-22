import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Preferences {
    emailAlerts: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
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
    const [browserInfo, setBrowserInfo] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [ipAddress, setIpAddress] = useState("192.168.1.1"); // Default IP

    useEffect(() => {
        // Get browser information
        const userAgent = navigator.userAgent;
        let browserName = "Unknown Browser";
        let osName = "Unknown OS";
        
        // Detect browser
        if (userAgent.indexOf("Chrome") > -1) {
            browserName = "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            browserName = "Safari";
        } else if (userAgent.indexOf("Firefox") > -1) {
            browserName = "Firefox";
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
            browserName = "Internet Explorer";
        } else if (userAgent.indexOf("Edge") > -1) {
            browserName = "Edge";
        }
        
        // Detect OS
        if (userAgent.indexOf("Win") > -1) {
            osName = "Windows";
        } else if (userAgent.indexOf("Mac") > -1) {
            osName = "MacOS";
        } else if (userAgent.indexOf("Linux") > -1) {
            osName = "Linux";
        } else if (userAgent.indexOf("Android") > -1) {
            osName = "Android";
        } else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
            osName = "iOS";
        }
        
        setBrowserInfo(`${browserName} on ${osName}`);
        
        // Format current date and time
        const now = new Date();
        setCurrentDateTime(now.toLocaleString());
        
        // In a real app, you would fetch the IP address from an API
        // For demonstration, we're using a placeholder IP
    }, []);

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
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Current Login Session</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                          <div>
                            <div className="font-medium">Current Session</div>
                            <div className="text-sm text-gray-400">
                              {browserInfo} • IP: {ipAddress}
                            </div>
                            <div className="text-xs text-emerald-400 mt-1">
                              Login Time: {currentDateTime}
                            </div>
                          </div>
                          <div>
                            <button className="text-gray-400 hover:text-gray-300">
                              This is you
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