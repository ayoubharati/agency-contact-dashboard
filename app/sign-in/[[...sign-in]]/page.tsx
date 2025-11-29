import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="h-screen bg-transparent flex items-center justify-center font-sans text-gray-900 overflow-hidden">
            <main className="flex flex-col md:flex-row justify-center items-stretch p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full h-auto max-h-screen">

                {/* Left Column: Sign In Form */}
                <div className="w-full md:w-[400px] flex flex-col justify-center gap-6">

                    <SignIn
                        appearance={{
                            variables: { borderRadius: "0.375rem" },
                            elements: {
                                rootBox: "w-full",

                                // Turn Clerk's card into your container
                                card:
                                    "shadow-lg border border-gray-200 rounded-lg bg-white/95 backdrop-blur-sm px-6 pt-4 pb-6",

                                // Add the header text manually
                                headerTitle:
                                    "text-lg font-semibold text-gray-800 mb-3 block before:content-['Sign In']",

                                headerSubtitle: "hidden",

                                formButtonPrimary:
                                    "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md shadow-sm transition-all",

                                formFieldInput:
                                    "rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2",

                                footer: "hidden",
                            },
                        }}
                    />


                    <div className="text-center text-sm text-gray-500">
                        <p>
                            By continuing, you agree to our{" "}
                            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>

                </div>



                {/* Right Column: Marketing Banner */}
                <div className="hidden md:flex flex-1 w-full max-w-[600px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden text-white p-12 flex-col justify-center shadow-2xl rounded-lg">
                    {/* Geometric Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300 blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-sm font-medium mb-6 border border-white/30 rounded">
                            Professional Dashboard
                        </div>
                        <h2 className="text-4xl font-bold mb-6 leading-tight">Streamline Your Agency Outreach</h2>
                        <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                            Access comprehensive agency and contact information. Manage your outreach efficiently with our powerful dashboard tools designed for professionals.
                        </p>
                    </div>
                </div>


            </main>
        </div>
    );
}