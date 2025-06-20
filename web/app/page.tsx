import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 float">
              <span className="text-4xl">🌾</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Secure My Crop</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Revolutionizing agriculture with <span className="text-green-400 font-semibold">blockchain-powered</span> crop insurance. 
              Protect your farm from climate risks with <span className="text-blue-400 font-semibold">instant coverage</span> and 
              <span className="text-purple-400 font-semibold"> transparent claims</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/farm">
                <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 pulse-glow">
                  🚀 Get Started
                </button>
              </a>
              <button className="glass px-8 py-4 rounded-xl text-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300">
                📖 Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
          <div className="glass-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">📍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Location Mapping</h3>
            <p className="text-gray-600 leading-relaxed">
              Pin your farm location with precision using our interactive map. Get instant risk assessment based on your exact coordinates and local climate data.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Instant Risk Assessment</h3>
            <p className="text-gray-600 leading-relaxed">
              AI-powered algorithms analyze your farm data and provide real-time risk percentages. Get transparent premium calculations instantly.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-300 group">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Web3 Integration</h3>
            <p className="text-gray-600 leading-relaxed">
              Secure your policies on the blockchain. Transparent, immutable, and trustless insurance contracts with instant claim processing.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 w-full max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Platform Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">500+</div>
                <div className="text-gray-600">Farms Protected</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-500 mb-2">$2.5M</div>
                <div className="text-gray-600">Claims Paid</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-500 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="glass-card p-12 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Ready to Secure Your Future?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Join thousands of farmers who trust Secure My Crop for their insurance needs.
            </p>
            <a href="/farm">
              <button className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-10 py-4 rounded-xl text-xl font-semibold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105">
                🌾 Start Protecting Your Crops
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
