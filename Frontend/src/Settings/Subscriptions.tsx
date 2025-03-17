import {motion} from 'framer-motion';
import {CreditCard, CheckCircle} from "lucide-react";

interface SubscriptionItem {
  plan: string;
  price: string;
  features: string[];
  current: boolean;
}

interface SubscriptionsProps {
  activeTab: string;
  subscription: SubscriptionItem[];
  setSubscription: React.Dispatch<React.SetStateAction<SubscriptionItem[]>>;
}

const Subscriptions = ({ activeTab, subscription, setSubscription }: SubscriptionsProps) => {
    // Function to handle subscription updates
    const handleSubscriptionChange = (selectedPlan: string) => {
        setSubscription(prevSubscriptions => 
            prevSubscriptions.map(sub => ({
                ...sub,
                current: sub.plan === selectedPlan
            }))
        );
    };
    
    return (
        <>
        {activeTab === "subscriptions" && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">
              Subscription Plans
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {subscription.map((sub, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-6 transition-all ${
                    sub.current
                      ? "border-2 border-emerald-500 bg-emerald-500/10"
                      : "border border-gray-700 hover:border-emerald-500/50 bg-white/5"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{sub.plan}</h3>
                  <div className="text-2xl font-bold mb-4 text-emerald-400">
                    {sub.price}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {sub.features.map((feature, j) => (
                      <li key={j} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      sub.current
                        ? "bg-gray-700 text-gray-300 cursor-default"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
                    disabled={sub.current}
                    onClick={() => !sub.current && handleSubscriptionChange(sub.plan)}
                  >
                    {sub.current ? "Current Plan" : "Upgrade"}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Billing Information</h3>
              <div className="flex justify-between items-center p-4 border border-gray-700 rounded-lg mb-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded mr-4">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-medium">Visa ending in 4242</div>
                    <div className="text-sm text-gray-400">
                      Expires 09/26
                    </div>
                  </div>
                </div>
                <button className="text-emerald-400 hover:text-emerald-300">
                  Edit
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <button className="text-gray-400 hover:text-white">
                  + Add Payment Method
                </button>
                <button className="text-emerald-400 hover:text-emerald-300">
                  View Billing History
                </button>
              </div>
            </div>
          </motion.div>
          )}
        </>
    );
}

export default Subscriptions;