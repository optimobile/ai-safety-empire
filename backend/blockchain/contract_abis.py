"""
Smart contract ABIs for Web3 interaction
"""

# Simplified ABIs with only the functions we need

AI_DECISION_LOGGER_ABI = [
    {
        "inputs": [
            {"internalType": "bytes32", "name": "_decisionHash", "type": "bytes32"},
            {"internalType": "string", "name": "_ipfsHash", "type": "string"},
            {"internalType": "bool", "name": "_isRobotDecision", "type": "bool"},
            {"internalType": "bytes32", "name": "_parentDecisionHash", "type": "bytes32"}
        ],
        "name": "logDecision",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getStatistics",
        "outputs": [
            {"internalType": "uint256", "name": "totalDecisions", "type": "uint256"},
            {"internalType": "uint256", "name": "totalApproved", "type": "uint256"},
            {"internalType": "uint256", "name": "totalRejected", "type": "uint256"},
            {"internalType": "uint256", "name": "totalRobotDecisions", "type": "uint256"},
            {"internalType": "uint256", "name": "activePlatforms", "type": "uint256"}
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

AEGIS_TOKEN_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]

JABULON_COIN_ABI = [
    {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "uint256", "name": "jablAmount", "type": "uint256"}],
        "name": "convertToAEGIS",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

GOVERNANCE_VOTING_ABI = [
    {
        "inputs": [],
        "name": "proposalCount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]

