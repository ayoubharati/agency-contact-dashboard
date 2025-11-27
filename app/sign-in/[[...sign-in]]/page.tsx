import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="h-screen bg-gray-50 flex items-center justify-center font-sans text-gray-900 overflow-hidden">
            <main className="flex flex-col md:flex-row justify-center items-stretch p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full h-auto max-h-screen">

                {/* Left Column: Sign In Form */}
                <div className="w-full md:w-[400px] flex flex-col justify-center gap-6">

                    <SignIn
                        appearance={{
                            variables: { borderRadius: "0" },
                            elements: {
                                rootBox: "w-full",

                                // Turn Clerk's card into your container
                                card:
                                    "shadow-sm border border-gray-200 rounded-md bg-white px-6 pt-4 pb-6",

                                // Add the header text manually
                                headerTitle:
                                    "text-lg font-medium text-gray-800 mb-3 block before:content-['Sign In']",

                                headerSubtitle: "hidden",

                                formButtonPrimary:
                                    "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-none shadow-none transition-all",

                                formFieldInput:
                                    "rounded-none border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 focus:ring-2",

                                footer: "hidden",
                            },
                        }}
                    />


                    <div className="text-center text-sm text-gray-500">
                        <p>
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a>{" "}
                            and{" "}
                            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>

                </div>



                {/* Right Column: Marketing Banner */}
                <div className="hidden md:flex flex-1 w-full max-w-[600px] bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden text-white p-12 flex-col justify-center shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

                    <div className="relative z-10">
                        <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-sm font-medium mb-6 border border-white/30">
                            New Features Available
                        </div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Manage your Agency Contacts with ease.</h2>
                        <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                            Access a comprehensive database of agencies and contacts. Streamline your outreach and grow your business with our powerful dashboard tools.
                        </p>
                    </div>
                </div>


            </main>
        </div>
    );
}