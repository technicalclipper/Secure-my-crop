import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-10">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-green-700 mb-4">Welcome to Secure My Crop</h1>
        <p className="text-lg text-gray-700 mb-6">
          Empowering farmers with blockchain-based crop insurance. Protect your farm from drought and rainfall risks, get instant risk assessment, pay fair premiums, and claim easily—all on-chain.
        </p>
        <a href="/farm">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow hover:bg-green-700 transition">
            Get Started
          </button>
        </a>
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        <div className="bg-white rounded-lg shadow p-6 w-64">
          <h2 className="text-xl font-semibold text-green-700 mb-2">1. Enter Farm Details</h2>
          <p className="text-gray-600">Provide your farm location, crop type, and risk factors.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 w-64">
          <h2 className="text-xl font-semibold text-green-700 mb-2">2. Get Risk & Premium</h2>
          <p className="text-gray-600">See your risk percentage and premium instantly.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 w-64">
          <h2 className="text-xl font-semibold text-green-700 mb-2">3. Buy Policy & Claim</h2>
          <p className="text-gray-600">Purchase insurance and claim easily if disaster strikes.</p>
        </div>
      </div>
    </div>
  );
}
