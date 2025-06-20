"use client";
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function Navbar() {

  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <nav className="glass sticky top-0 z-50 w-full backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌾</span>
              </div>
              <span className="text-xl font-bold gradient-text">Secure My Crop</span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                Home
              </Link>
              <Link href="/farm" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                Farm Details
              </Link>
              <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                Dashboard
              </Link>
              <Link href="/claims" className="text-white/80 hover:text-white transition-colors duration-200 font-medium">
                Claims
              </Link>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="glass px-3 py-1 rounded-full">
                  <span className="text-sm text-white/90 font-medium">
                    {shortAddress}
                  </span>
                </div>
                <button 
                  onClick={() => disconnect()}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={() => connect({ connector: injected() })}
                disabled={isPending}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>🔗</span>
                    <span>Connect Wallet</span>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 