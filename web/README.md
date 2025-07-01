# Secure My Crop - Web3 Crop Insurance Platform

A decentralized crop insurance platform built with Next.js and Web3 technologies, allowing farmers to protect their crops from drought and rainfall risks.

## Features

- **Farm Details Submission**: Farmers can input their farm information including location, crop type, acreage, and risk factors
- **Interactive Map**: Click-to-pin location selection with coordinate capture
- **Location Search**: Search for cities or enter coordinates manually
- **Real-time Weather Data**: Integration with WeatherXM for accurate, real-time weather information
- **Drone Damage Assessment**: Spexi drone imagery analysis for precise crop damage evaluation
- **Risk Assessment**: AI-powered risk calculation based on farm details, weather data, and historical patterns
- **Premium Calculation**: Transparent premium calculation based on risk percentage
- **Policy Management**: View and manage active insurance policies
- **Claims Submission**: Easy claim submission process with detailed forms and automated damage assessment
- **Claims History**: Track the status of all submitted claims
- **Web3 Integration**: MetaMask wallet connection for secure transactions

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Web3**: Wagmi for Ethereum wallet integration
- **Weather Data**: WeatherXM API for real-time weather information
- **Damage Assessment**: Spexi drone imagery and AI analysis
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

### Weather Data Integration

The platform integrates with WeatherXM for real-time weather data:

1. Get a WeatherXM API key from [WeatherXM](https://weatherxm.com/)
2. Add to your `.env.local` file:
```bash
NEXT_PUBLIC_WEATHERXM_API_KEY=your_weatherxm_api_key_here
```
3. Weather data is automatically fetched for risk assessment and claims processing

### Drone Damage Assessment

Spexi drone imagery is used for automated damage assessment:

1. Upload drone images through the claims interface
2. AI analysis provides precise damage evaluation
3. Automated claim processing based on visual evidence

### Usage

1. **Connect Wallet**: Click "Connect Wallet" in the navigation bar to connect your MetaMask wallet
2. **Enter Farm Details**: Navigate to "Farm Details" to input your farm information
3. **Select Location**: Use the interactive map to click and pin your farm location, or search for a city
4. **Get Risk Assessment**: Submit the form to receive your risk percentage and premium calculation based on real-time weather data
5. **View Policies**: Check your "Dashboard" to see all active policies
6. **Submit Claims**: Use the "Submit Claim" button on active policies to file claims with drone imagery upload
7. **Track Claims**: Visit the "Claims" page to view your claims history and damage assessment results

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

The insurance contract is deployed on the Flow testnet with the following details:

- **Network**: Flow Testnet
- **Contract Address**: `0x37138CC978D3984386Cf890a7EAF0f540351125f`
- **Status**: Deployed and ready for integration

To integrate with the deployed smart contract:

1. Update the wagmi configuration in `app/providers.tsx` to connect to Flow testnet
2. Replace mock data with contract calls using the deployed contract address
3. Implement actual transaction handling for policy purchases and claims
4. Ensure your MetaMask is configured for Flow testnet

## API Routes

The platform includes several API endpoints for automated processing:

### `/api/claim_with_ai` (POST)
**Purpose**: Automated claim processing with AI-powered damage assessment
**Input**:
```json
{
  "address": "farmer_wallet_address",
  "policyId": "policy_id",
  "lat": "latitude",
  "lng": "longitude"
}
```
**Process**:
1. Fetches real-time weather data from WeatherXM API
2. Analyzes weather conditions for damage assessment
3. Calls damage estimation AI
4. Automatically issues payout if damage > 20%
5. Records transaction on Flow blockchain

**Response**:
```json
{
  "success": true,
  "damage": "damage_assessment_data",
  "payoutIssued": true,
  "transactionHash": "blockchain_tx_hash",
  "damagePercent": 80
}
```

### `/api/estimate_damage` (POST)
**Purpose**: AI-powered crop damage percentage calculation
**Input**:
```json
{
  "data": "weather_data_json_string"
}
```
**Process**:
- Uses OpenAI GPT-4 to analyze weather conditions
- Returns damage percentage (0-100) based on weather data
- Optimized for agricultural damage assessment

**Response**:
```json
{
  "res": "85"
}
```

### `/api/spexi_analyse` (POST)
**Purpose**: Drone imagery analysis using OpenAI Vision
**Input**: Requires `spexi_farm.jpg` in the public folder
**Process**:
- Analyzes uploaded drone images using OpenAI Vision
- Provides detailed damage assessment including:
  - Damage detection and percentage
  - Damage type classification
  - Crop condition analysis
  - Infrastructure assessment
  - Recovery estimates

**Response**:
```json
{
  "success": true,
  "image_analyzed": "spexi_farm.jpg",
  "analysis": {
    "damage_detected": true,
    "damage_percentage": 75,
    "damage_type": "flood",
    "crop_condition": "severely_damaged",
    "infrastructure_affected": true,
    "recovery_estimate": "6-12 months",
    "detailed_analysis": "..."
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Environment Variables Required

Add these to your `.env.local` file:

```bash
# Weather Data
WEATHERXM_API_KEY=your_weatherxm_api_key

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Blockchain
AGENT_PRIVATE_KEY=your_agent_private_key
RPC_URL=your_flow_testnet_rpc_url
```

## Contributing
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
