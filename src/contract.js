import { ethers } from "ethers";  // Import ethers directly

// Contract Address and ABI
// OLD: const contractAddress = "0xF033F321E14456ef555bE9Ca30f369690c518fD0";
const contractAddress = "0x4ac164a0bC80ED69DF3da7cFa86BF9795C09d334";
/*OLD:
const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "enum Escrow.ArbitratorDecision",
				"name": "_decision",
				"type": "uint8"
			}
		],
		"name": "complete",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_bob",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_alice",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "newAgreement",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "agreements",
		"outputs": [
			{
				"internalType": "address",
				"name": "bob",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "alice",
				"type": "address"
			},
			{
				"internalType": "enum Escrow.ArbitratorDecision",
				"name": "arbitratorDecision",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "bobIn",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "aliceIn",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastAgreement",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "bob",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "alice",
						"type": "address"
					},
					{
						"internalType": "enum Escrow.ArbitratorDecision",
						"name": "arbitratorDecision",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "bobIn",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "aliceIn",
						"type": "bool"
					}
				],
				"internalType": "struct Escrow.Agreement",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
*/

const abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "enum Escrow.ArbitratorDecision",
				"name": "_decision",
				"type": "uint8"
			}
		],
		"name": "complete",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_bob",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_alice",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "newAgreement",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"name": "agreements",
		"outputs": [
			{
				"internalType": "address",
				"name": "bob",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "alice",
				"type": "address"
			},
			{
				"internalType": "enum Escrow.ArbitratorDecision",
				"name": "arbitratorDecision",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "bobIn",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "aliceIn",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastAgreement",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "bob",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "alice",
						"type": "address"
					},
					{
						"internalType": "enum Escrow.ArbitratorDecision",
						"name": "arbitratorDecision",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "bobIn",
						"type": "bool"
					},
					{
						"internalType": "bool",
						"name": "aliceIn",
						"type": "bool"
					}
				],
				"internalType": "struct Escrow.Agreement",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];


// Create a provider and signer for interacting with the blockchain
export const getContract = async () => {
    if (typeof window.ethereum !== "undefined") {
        // Request access to the user's Ethereum account
        await window.ethereum.request({ method: "eth_requestAccounts" });
        
        // Create a new provider instance using the browser's MetaMask provider
        const provider = new ethers.BrowserProvider(window.ethereum);  // Use BrowserProvider
        
        // Get the user's wallet address and signer
        const signer = await provider.getSigner();

        // Create and return a new contract instance with the signer
        const contract = new ethers.Contract(contractAddress, abi, signer);
        return contract;
    } else {
        alert("Please install MetaMask to use this feature!");
    }
};





