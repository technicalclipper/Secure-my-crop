"use client";
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export default function Navbar() {

  const { address, isConnected } = useAccount();
  const { connect, pendingConnector } = useConnect({ connectors: [injected()] });
  const { disconnect } = useDisconnect();

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 bg-white shadow-md mb-8">
      <div className="flex items-center gap-4">
        <span className="font-bold text-xl text-green-700">Secure My Crop</span>
        <Link href="/" className="text-gray-700 hover:text-green-700 font-medium">Home</Link>
        <Link href="/farm" className="text-gray-700 hover:text-green-700 font-medium">Farm Details</Link>
        <Link href="/dashboard" className="text-gray-700 hover:text-green-700 font-medium">Dashboard</Link>
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Connect Wallet</button>
    </nav>
  );
} 