"""
Blockchain interaction client for AI Safety Empire
"""

import os
import hashlib
from web3 import Web3
from .contract_abis import (
    AI_DECISION_LOGGER_ABI,
    AEGIS_TOKEN_ABI,
    JABULON_COIN_ABI,
    GOVERNANCE_VOTING_ABI
)


class BlockchainClient:
    """Client for interacting with AI Safety Empire smart contracts"""
    
    def __init__(
        self,
        rpc_url: str,
        logger_address: str = None,
        governance_address: str = None,
        aegis_address: str = None,
        jabulon_address: str = None
    ):
        self.rpc_url = rpc_url
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        # Contract addresses
        self.logger_address = logger_address
        self.governance_address = governance_address
        self.aegis_address = aegis_address
        self.jabulon_address = jabulon_address
        
        # Initialize contracts
        if logger_address:
            self.logger_contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(logger_address),
                abi=AI_DECISION_LOGGER_ABI
            )
        else:
            self.logger_contract = None
        
        if aegis_address:
            self.aegis_contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(aegis_address),
                abi=AEGIS_TOKEN_ABI
            )
        else:
            self.aegis_contract = None
        
        if jabulon_address:
            self.jabulon_contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(jabulon_address),
                abi=JABULON_COIN_ABI
            )
        else:
            self.jabulon_contract = None
        
        if governance_address:
            self.governance_contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(governance_address),
                abi=GOVERNANCE_VOTING_ABI
            )
        else:
            self.governance_contract = None
    
    def is_connected(self) -> bool:
        """Check if connected to blockchain"""
        try:
            return self.w3.is_connected()
        except:
            return False
    
    def get_chain_id(self) -> int:
        """Get chain ID"""
        return self.w3.eth.chain_id
    
    def get_block_number(self) -> int:
        """Get current block number"""
        return self.w3.eth.block_number
    
    def generate_decision_hash(self, decision_id: str, decision_type: str, input_data: dict) -> str:
        """Generate a deterministic hash for a decision"""
        data = f"{decision_id}:{decision_type}:{str(input_data)}"
        return "0x" + hashlib.sha256(data.encode()).hexdigest()
    
    def log_decision(
        self,
        decision_hash: str,
        ipfs_hash: str,
        is_robot_decision: bool = False,
        parent_hash: str = "0x" + "0" * 64
    ) -> str:
        """Log a decision to the blockchain"""
        if not self.logger_contract:
            raise Exception("Logger contract not initialized")
        
        # Get deployer account (for testing)
        deployer = os.getenv("DEPLOYER_ADDRESS")
        private_key = os.getenv("DEPLOYER_PRIVATE_KEY")
        
        # Build transaction
        tx = self.logger_contract.functions.logDecision(
            bytes.fromhex(decision_hash[2:]),
            ipfs_hash,
            is_robot_decision,
            bytes.fromhex(parent_hash[2:])
        ).build_transaction({
            'from': deployer,
            'nonce': self.w3.eth.get_transaction_count(deployer),
            'gas': 200000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        return tx_hash.hex()
    
    def verify_transaction(self, tx_hash: str) -> bool:
        """Verify a transaction exists on blockchain"""
        try:
            receipt = self.w3.eth.get_transaction_receipt(tx_hash)
            return receipt is not None and receipt['status'] == 1
        except:
            return False
    
    def get_aegis_balance(self, address: str) -> float:
        """Get AEGIS token balance"""
        if not self.aegis_contract:
            raise Exception("AEGIS contract not initialized")
        
        balance_wei = self.aegis_contract.functions.balanceOf(
            Web3.to_checksum_address(address)
        ).call()
        
        return float(Web3.from_wei(balance_wei, 'ether'))
    
    def get_jabulon_balance(self, address: str) -> float:
        """Get JabulonCoin balance"""
        if not self.jabulon_contract:
            raise Exception("JabulonCoin contract not initialized")
        
        balance_wei = self.jabulon_contract.functions.balanceOf(
            Web3.to_checksum_address(address)
        ).call()
        
        return float(Web3.from_wei(balance_wei, 'ether'))
    
    def get_decision_statistics(self) -> tuple:
        """Get decision statistics from logger contract"""
        if not self.logger_contract:
            raise Exception("Logger contract not initialized")
        
        return self.logger_contract.functions.getStatistics().call()
    
    def convert_jabl_to_aegis(self, amount: float, from_address: str) -> str:
        """Convert JABL to AEGIS tokens"""
        if not self.jabulon_contract:
            raise Exception("JabulonCoin contract not initialized")
        
        # Convert amount to wei
        amount_wei = Web3.to_wei(amount, 'ether')
        
        # Get private key (in production, this would come from user's wallet)
        private_key = os.getenv("DEPLOYER_PRIVATE_KEY")
        
        # Build transaction
        tx = self.jabulon_contract.functions.convertToAEGIS(
            amount_wei
        ).build_transaction({
            'from': from_address,
            'nonce': self.w3.eth.get_transaction_count(from_address),
            'gas': 150000,
            'gasPrice': self.w3.eth.gas_price
        })
        
        # Sign and send
        signed_tx = self.w3.eth.account.sign_transaction(tx, private_key)
        tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        
        return tx_hash.hex()
