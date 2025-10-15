// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AIDecisionLogger
 * @dev Immutable logging of all AI decisions for Jabulon's Law enforcement
 * @notice This contract stores cryptographic hashes of AI decisions on-chain
 * for permanent audit trails and compliance verification
 */
contract AIDecisionLogger is AccessControl, ReentrancyGuard, Pausable {
    
    // Role definitions
    bytes32 public constant LOGGER_ROLE = keccak256("LOGGER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    
    // Decision status enum
    enum DecisionStatus {
        PENDING,
        APPROVED,
        REJECTED,
        CONDITIONAL,
        EXECUTED,
        FAILED
    }
    
    // Decision struct
    struct AIDecision {
        bytes32 decisionHash;        // Hash of decision content
        address platform;             // Platform that made the decision
        uint256 timestamp;            // When decision was logged
        DecisionStatus status;        // Current status
        uint8 approvalCount;          // Number of council approvals
        uint8 rejectionCount;         // Number of council rejections
        string ipfsHash;              // IPFS hash for full decision data
        bool isRobotDecision;         // True if physical robot decision
        bytes32 parentDecisionHash;   // For linked decisions
    }
    
    // Council member struct
    struct CouncilMember {
        address memberAddress;
        string platformName;
        bool isActive;
        uint256 totalVotes;
        uint256 joinedAt;
    }
    
    // Storage
    mapping(bytes32 => AIDecision) public decisions;
    mapping(address => CouncilMember) public councilMembers;
    mapping(bytes32 => mapping(address => bool)) public hasVoted;
    
    bytes32[] public decisionHistory;
    address[] public councilAddresses;
    
    // Configuration
    uint8 public requiredApprovals = 5;  // 5 out of 6 council members
    uint8 public totalCouncilMembers = 6;
    
    // Statistics
    uint256 public totalDecisions;
    uint256 public totalApproved;
    uint256 public totalRejected;
    uint256 public totalRobotDecisions;
    
    // Events
    event DecisionLogged(
        bytes32 indexed decisionHash,
        address indexed platform,
        uint256 timestamp,
        bool isRobotDecision
    );
    
    event DecisionVoted(
        bytes32 indexed decisionHash,
        address indexed councilMember,
        bool approved,
        uint8 currentApprovals,
        uint8 currentRejections
    );
    
    event DecisionFinalized(
        bytes32 indexed decisionHash,
        DecisionStatus finalStatus,
        uint256 timestamp
    );
    
    event CouncilMemberAdded(
        address indexed memberAddress,
        string platformName,
        uint256 timestamp
    );
    
    event CouncilMemberRemoved(
        address indexed memberAddress,
        uint256 timestamp
    );
    
    /**
     * @dev Constructor - sets up initial roles
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(LOGGER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
    }
    
    /**
     * @dev Log a new AI decision to the blockchain
     * @param _decisionHash Hash of the decision content
     * @param _ipfsHash IPFS hash containing full decision data
     * @param _isRobotDecision True if this is a physical robot decision
     * @param _parentDecisionHash Optional parent decision for linked decisions
     */
    function logDecision(
        bytes32 _decisionHash,
        string memory _ipfsHash,
        bool _isRobotDecision,
        bytes32 _parentDecisionHash
    ) external onlyRole(LOGGER_ROLE) whenNotPaused nonReentrant {
        require(_decisionHash != bytes32(0), "Invalid decision hash");
        require(decisions[_decisionHash].timestamp == 0, "Decision already logged");
        
        decisions[_decisionHash] = AIDecision({
            decisionHash: _decisionHash,
            platform: msg.sender,
            timestamp: block.timestamp,
            status: DecisionStatus.PENDING,
            approvalCount: 0,
            rejectionCount: 0,
            ipfsHash: _ipfsHash,
            isRobotDecision: _isRobotDecision,
            parentDecisionHash: _parentDecisionHash
        });
        
        decisionHistory.push(_decisionHash);
        totalDecisions++;
        
        if (_isRobotDecision) {
            totalRobotDecisions++;
        }
        
        emit DecisionLogged(_decisionHash, msg.sender, block.timestamp, _isRobotDecision);
    }
    
    /**
     * @dev Council member votes on a decision
     * @param _decisionHash Hash of the decision to vote on
     * @param _approve True to approve, false to reject
     */
    function voteOnDecision(
        bytes32 _decisionHash,
        bool _approve
    ) external whenNotPaused nonReentrant {
        require(councilMembers[msg.sender].isActive, "Not an active council member");
        require(decisions[_decisionHash].timestamp != 0, "Decision does not exist");
        require(!hasVoted[_decisionHash][msg.sender], "Already voted");
        require(
            decisions[_decisionHash].status == DecisionStatus.PENDING,
            "Decision already finalized"
        );
        
        hasVoted[_decisionHash][msg.sender] = true;
        councilMembers[msg.sender].totalVotes++;
        
        if (_approve) {
            decisions[_decisionHash].approvalCount++;
        } else {
            decisions[_decisionHash].rejectionCount++;
        }
        
        emit DecisionVoted(
            _decisionHash,
            msg.sender,
            _approve,
            decisions[_decisionHash].approvalCount,
            decisions[_decisionHash].rejectionCount
        );
        
        // Check if decision can be finalized
        _checkAndFinalizeDecision(_decisionHash);
    }
    
    /**
     * @dev Internal function to check and finalize decision
     */
    function _checkAndFinalizeDecision(bytes32 _decisionHash) internal {
        AIDecision storage decision = decisions[_decisionHash];
        
        // If enough approvals, mark as approved
        if (decision.approvalCount >= requiredApprovals) {
            decision.status = DecisionStatus.APPROVED;
            totalApproved++;
            emit DecisionFinalized(_decisionHash, DecisionStatus.APPROVED, block.timestamp);
        }
        // If any rejection (strict enforcement for safety)
        else if (decision.rejectionCount > 0) {
            decision.status = DecisionStatus.REJECTED;
            totalRejected++;
            emit DecisionFinalized(_decisionHash, DecisionStatus.REJECTED, block.timestamp);
        }
    }
    
    /**
     * @dev Update decision status after execution
     * @param _decisionHash Hash of the decision
     * @param _status New status (EXECUTED or FAILED)
     */
    function updateDecisionStatus(
        bytes32 _decisionHash,
        DecisionStatus _status
    ) external onlyRole(LOGGER_ROLE) whenNotPaused {
        require(
            _status == DecisionStatus.EXECUTED || _status == DecisionStatus.FAILED,
            "Invalid status update"
        );
        require(
            decisions[_decisionHash].status == DecisionStatus.APPROVED,
            "Decision not approved"
        );
        
        decisions[_decisionHash].status = _status;
        emit DecisionFinalized(_decisionHash, _status, block.timestamp);
    }
    
    /**
     * @dev Add a new council member
     * @param _memberAddress Address of the council member
     * @param _platformName Name of the platform (e.g., "Safetyof.ai")
     */
    function addCouncilMember(
        address _memberAddress,
        string memory _platformName
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_memberAddress != address(0), "Invalid address");
        require(!councilMembers[_memberAddress].isActive, "Member already exists");
        
        councilMembers[_memberAddress] = CouncilMember({
            memberAddress: _memberAddress,
            platformName: _platformName,
            isActive: true,
            totalVotes: 0,
            joinedAt: block.timestamp
        });
        
        councilAddresses.push(_memberAddress);
        _grantRole(LOGGER_ROLE, _memberAddress);
        
        emit CouncilMemberAdded(_memberAddress, _platformName, block.timestamp);
    }
    
    /**
     * @dev Remove a council member
     * @param _memberAddress Address of the council member to remove
     */
    function removeCouncilMember(
        address _memberAddress
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(councilMembers[_memberAddress].isActive, "Member not active");
        
        councilMembers[_memberAddress].isActive = false;
        _revokeRole(LOGGER_ROLE, _memberAddress);
        
        emit CouncilMemberRemoved(_memberAddress, block.timestamp);
    }
    
    /**
     * @dev Get decision details
     * @param _decisionHash Hash of the decision
     */
    function getDecision(bytes32 _decisionHash) 
        external 
        view 
        returns (
            address platform,
            uint256 timestamp,
            DecisionStatus status,
            uint8 approvalCount,
            uint8 rejectionCount,
            string memory ipfsHash,
            bool isRobotDecision
        ) 
    {
        AIDecision memory decision = decisions[_decisionHash];
        return (
            decision.platform,
            decision.timestamp,
            decision.status,
            decision.approvalCount,
            decision.rejectionCount,
            decision.ipfsHash,
            decision.isRobotDecision
        );
    }
    
    /**
     * @dev Get recent decisions
     * @param _count Number of recent decisions to retrieve
     */
    function getRecentDecisions(uint256 _count) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        uint256 length = decisionHistory.length;
        uint256 count = _count > length ? length : _count;
        bytes32[] memory recent = new bytes32[](count);
        
        for (uint256 i = 0; i < count; i++) {
            recent[i] = decisionHistory[length - 1 - i];
        }
        
        return recent;
    }
    
    /**
     * @dev Get all active council members
     */
    function getActiveCouncilMembers() external view returns (address[] memory) {
        uint256 activeCount = 0;
        
        // Count active members
        for (uint256 i = 0; i < councilAddresses.length; i++) {
            if (councilMembers[councilAddresses[i]].isActive) {
                activeCount++;
            }
        }
        
        // Build array of active members
        address[] memory activeMembers = new address[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < councilAddresses.length; i++) {
            if (councilMembers[councilAddresses[i]].isActive) {
                activeMembers[index] = councilAddresses[i];
                index++;
            }
        }
        
        return activeMembers;
    }
    
    /**
     * @dev Get statistics
     */
    function getStatistics() 
        external 
        view 
        returns (
            uint256 _totalDecisions,
            uint256 _totalApproved,
            uint256 _totalRejected,
            uint256 _totalRobotDecisions,
            uint256 _pendingDecisions
        ) 
    {
        uint256 pending = totalDecisions - totalApproved - totalRejected;
        return (
            totalDecisions,
            totalApproved,
            totalRejected,
            totalRobotDecisions,
            pending
        );
    }
    
    /**
     * @dev Pause contract (emergency only)
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}

