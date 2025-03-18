import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
    onClose: () => void;
}

const AuthModal = ({ onClose }: AuthModalProps) => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
            <div className="bg-[#111827] rounded-xl p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>
        <form className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
          />
          <button className="w-full py-3 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>
        <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="mt-4 text-sm text-gray-400 hover:text-white"
                >
                    {isLogin
                        ? "Need an account? Sign up"
                        : "Already have an account? Login"}
                </button>
            </div>
        </motion.div>
    );
};

export default AuthModal;