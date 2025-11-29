import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center text-gray-900 font-sans overflow-auto py-8">
      <main className="flex flex-col md:flex-row justify-center items-stretch p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full">

        {/* Left Column: Sign Up Form */}
        <div className="w-full md:w-[400px] flex flex-col gap-4">
          <div className="w-full">
            {/* Clerk Sign Up Component */}
            <SignUp
              appearance={{
                variables: { borderRadius: "0.375rem" },
                elements: {
                  rootBox: "w-full",

                  // Make Clerk's card blend into your own wrapper
                  card: "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-6 pt-4 pb-6",

                  // Inject custom header text
                  headerTitle:
                    "text-xl font-semibold text-gray-800 mb-4 block before:content-['Create\\ Account']",

                  headerSubtitle: "hidden",

                  formButtonPrimary:
                    "bg-blue-600 hover:bg-blue-700 text-white font-semibold border border-blue-700 rounded-md shadow-sm transition-all",

                  formFieldInput:
                    "rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 focus:ring-2",

                  footer: "hidden",
                },
              }}
            />

          </div>

          <div className="text-xs text-gray-600 mt-4">
            <p className="mb-2">
              By continuing, you agree to the <a href="#" className="text-blue-600 hover:underline hover:text-blue-700">Terms of Service</a> and the <a href="#" className="text-blue-600 hover:underline hover:text-blue-700">Privacy Policy</a>. This site uses essential cookies. See our <a href="#" className="text-blue-600 hover:underline hover:text-blue-700">Cookie Notice</a> for more information.
            </p>
          </div>

          <div className="my-4 border-t border-gray-300"></div>

        </div>

        {/* Right Column: Marketing Banner */}
        <div className="hidden md:flex flex-1 w-full max-w-[600px] bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 relative overflow-hidden rounded-lg text-white p-10 flex-col justify-center shadow-2xl">
          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-sm font-medium mb-6 border border-white/30 rounded">
              Professional Tools
            </div>
            <h2 className="text-4xl font-bold mb-4">Access Thousands of Agency Contacts</h2>
            <p className="text-lg mb-8 text-gray-200">
              Streamline your outreach with comprehensive agency data. Connect with decision-makers and grow your business efficiently.
            </p>

            <a href="#" className="text-white font-semibold hover:underline flex items-center gap-2">
              Learn More
              <span className="text-lg">›</span>
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}