export default function UpgradePrompt() {
    return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Daily Limit Reached
                </h2>
                <p className="text-sm text-gray-600 mb-6">
                    You have viewed your maximum of 50 contacts for today. Upgrade to get unlimited access.
                </p>

                <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-start">
                        <span className="text-gray-700">• Unlimited contact views</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700">• Advanced search and filtering</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700">• Export contacts to CSV</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-gray-700">• Priority support</span>
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded text-sm hover:bg-blue-700 transition-colors">
                    Upgrade Now
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                    Your limit will reset tomorrow at midnight UTC
                </p>
            </div>
        </div>
    );
}
