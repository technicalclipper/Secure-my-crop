# Secure My Crop - Web3 Crop Insurance Platform

A decentralized crop insurance platform built with Next.js and Web3 technologies, allowing farmers to protect their crops from drought and rainfall risks.

## Features

- **Farm Details Submission**: Farmers can input their farm information including location, crop type, acreage, and risk factors
- **Interactive Map**: Click-to-pin location selection with coordinate capture
- **Location Search**: Search for cities or enter coordinates manually
- **Risk Assessment**: AI-powered risk calculation based on farm details and historical data
- **Premium Calculation**: Transparent premium calculation based on risk percentage
- **Policy Management**: View and manage active insurance policies
- **Claims Submission**: Easy claim submission process with detailed forms
- **Claims History**: Track the status of all submitted claims
- **Web3 Integration**: MetaMask wallet connection for secure transactions

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Web3**: Wagmi for Ethereum wallet integration
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- MetaMask browser extension
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd secure-my-crop/web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Map Integration (Optional)

The current implementation includes a basic map interface with mock data. For enhanced functionality with Google Maps:

1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a `.env.local` file in the `web` directory:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```
3. Update the `MapComponent.tsx` to use the Google Maps API instead of mock data

### Usage

1. **Connect Wallet**: Click "Connect Wallet" in the navigation bar to connect your MetaMask wallet
2. **Enter Farm Details**: Navigate to "Farm Details" to input your farm information
3. **Select Location**: Use the interactive map to click and pin your farm location, or search for a city
4. **Get Risk Assessment**: Submit the form to receive your risk percentage and premium calculation
5. **View Policies**: Check your "Dashboard" to see all active policies
6. **Submit Claims**: Use the "Submit Claim" button on active policies to file claims
7. **Track Claims**: Visit the "Claims" page to view your claims history

## Project Structure

```
web/
├── app/
│   ├── farm/page.tsx          # Farm details form with map
│   ├── dashboard/page.tsx     # Policy dashboard
│   ├── claims/page.tsx        # Claims history
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Landing page
│   └── providers.tsx          # Web3 providers
├── components/
│   ├── Navbar.tsx             # Navigation component
│   └── MapComponent.tsx       # Interactive map component
└── public/                    # Static assets
```

## Smart Contract Integration

This UI is currently using mock data. To integrate with actual smart contracts:

1. Deploy the insurance smart contracts
2. Update the wagmi configuration in `app/providers.tsx`
3. Replace mock data with contract calls
4. Implement actual transaction handling for policy purchases and claims

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
