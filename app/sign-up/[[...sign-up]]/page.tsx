import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center text-[#232f3e] font-sans overflow-auto py-8">
      <main className="flex flex-col md:flex-row justify-center items-stretch p-4 md:p-8 gap-8 max-w-7xl mx-auto w-full">

        {/* Left Column: Sign Up Form */}
        <div className="w-full md:w-[400px] flex flex-col gap-4">
          <div className="w-full">
            {/* Clerk Sign Up Component */}
            <SignUp
              appearance={{
                variables: { borderRadius: "0" },
                elements: {
                  rootBox: "w-full",

                  // Make Clerk's card blend into your own wrapper
                  card: "bg-white border border-gray-300 rounded-sm shadow-md px-6 pt-4 pb-6",

                  // Inject custom header text
                  headerTitle:
                    "text-xl font-semibold text-[#232f3e] mb-4 block before:content-['Create\\ Account']",

                  headerSubtitle: "hidden",

                  formButtonPrimary:
                    "bg-[#ff9900] hover:bg-[#ec8d00] text-[#232f3e] font-bold border border-[#b86c00] rounded-none shadow-none",

                  formFieldInput:
                    "rounded-none border-gray-400 focus:border-[#e77600] focus:ring-[#e77600] focus:ring-1",

                  footer: "hidden",
                },
              }}
            />

          </div>

          <div className="text-xs text-gray-600 mt-4">
            <p className="mb-2">
              By continuing, you agree to the <a href="#" className="text-[#007eb9] hover:underline hover:text-[#e47911]">AWS Customer Agreement</a> or other agreement for AWS services, and the <a href="#" className="text-[#007eb9] hover:underline hover:text-[#e47911]">Privacy Notice</a>. This site uses essential cookies. See our <a href="#" className="text-[#007eb9] hover:underline hover:text-[#e47911]">Cookie Notice</a> for more information.
            </p>
          </div>

          <div className="my-4 border-t border-gray-300"></div>

        </div>

        {/* Right Column: Marketing Banner */}
        <div className="hidden md:flex flex-1 w-full max-w-[600px] bg-gradient-to-br from-[#232f3e] to-[#5a3fb0] relative overflow-hidden rounded-sm text-white p-10 flex-col justify-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <h2 className="text-4xl font-bold mb-4 relative z-10">Scale AI with Amazon Bedrock AgentCore, now GA</h2>
          <p className="text-lg mb-8 text-gray-200 relative z-10">
            Deploy and operate AI agents securely at scale. Use any framework or model you want.
          </p>

          <a href="#" className="text-white font-bold hover:underline flex items-center gap-1 relative z-10">
            Learn about AgentCore
            <span className="text-xs">›</span>
          </a>
        </div>

      </main>
    </div>
  );
}