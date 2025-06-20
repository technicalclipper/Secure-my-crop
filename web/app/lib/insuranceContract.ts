export const contractAddress = "0x37138CC978D3984386Cf890a7EAF0f540351125f";
export const abi=[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "policyId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "payoutAmount",
				"type": "uint256"
			}
		],
		"name": "PayoutIssued",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "policyId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "premiumPaid",
				"type": "uint256"
			}
		],
		"name": "PolicyCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "farmName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "lat",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lng",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "acreage",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "riskType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "rainfallThreshold",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "premiumPaid",
				"type": "uint256"
			}
		],
		"name": "createPolicy",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			}
		],
		"name": "getFarmerPolicies",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "policyId",
				"type": "uint256"
			}
		],
		"name": "getPolicy",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "farmer",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "farmName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "lat",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lng",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "acreage",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "riskType",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "rainfallThreshold",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "startDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "endDate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "premiumPaid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "payout",
						"type": "uint256"
					},
					{
						"internalType": "uint8",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct CropInsurance.Policy",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "policyId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "damagePercent",
				"type": "uint256"
			}
		],
		"name": "issuePayout",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "policies",
		"outputs": [
			{
				"internalType": "address",
				"name": "farmer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "farmName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "lat",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lng",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "acreage",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "riskType",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "rainfallThreshold",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "startDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "premiumPaid",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "payout",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "policyCounter",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
]