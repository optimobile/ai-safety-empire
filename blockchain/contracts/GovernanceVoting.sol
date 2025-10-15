// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title GovernanceVoting
 * @dev Governance system for the AI Safety Ecosystem
 * @notice Enables AEGIS token holders to vote on platform policies and upgrades
 */
contract GovernanceVoting is AccessControl, ReentrancyGuard {
    
    bytes32 public constant PROPOSER_ROLE = keccak256("PROPOSER_ROLE");
    
    // Proposal types
    enum ProposalType {
        POLICY_CHANGE,
        PLATFORM_UPGRADE,
        COUNCIL_MEMBER_CHANGE,
        PARAMETER_ADJUSTMENT,
        EMERGENCY_ACTION
    }
    
    // Proposal status
    enum ProposalStatus {
        PENDING,
        ACTIVE,
        PASSED,
        REJECTED,
        EXECUTED,
        CANCELLED
    }
    
    // Proposal struct
    struct Proposal {
        uint256 id;
        address proposer;
        ProposalType proposalType;
        string title;
        string description;
        string ipfsHash;              // Full proposal details on IPFS
        uint256 startTime;
        uint256 endTime;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 votesAbstain;
        ProposalStatus status;
        bool executed;
        bytes executionData;          // Data for automatic execution
    }
    
    // Vote struct
    struct Vote {
        address voter;
        uint256 proposalId;
        bool support;                 // true = for, false = against
        bool abstain;
        uint256 weight;               // Voting power (token balance)
        uint256 timestamp;
    }
    
    // Storage
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => address[]) public proposalVoters;
    
    uint256 public proposalCount;
    uint256[] public activeProposals;
    
    // Governance parameters
    uint256 public votingPeriod = 7 days;
    uint256 public proposalThreshold = 1000 * 10**18;  // 1000 AEGIS tokens to propose
    uint256 public quorumPercentage = 10;              // 10% of total supply must vote
    uint256 public approvalThreshold = 66;             // 66% approval needed
    
    // AEGIS token reference (will be set after token deployment)
    IERC20 public aegisToken;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight,
        uint256 timestamp
    );
    
    event ProposalExecuted(
        uint256 indexed proposalId,
        uint256 timestamp
    );
    
    event ProposalCancelled(
        uint256 indexed proposalId,
        uint256 timestamp
    );
    
    event ProposalStatusChanged(
        uint256 indexed proposalId,
        ProposalStatus oldStatus,
        ProposalStatus newStatus
    );
    
    /**
     * @dev Constructor
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PROPOSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Set AEGIS token address (can only be set once)
     */
    function setAegisToken(address _tokenAddress) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(aegisToken) == address(0), "Token already set");
        require(_tokenAddress != address(0), "Invalid token address");
        aegisToken = IERC20(_tokenAddress);
    }
    
    /**
     * @dev Create a new governance proposal
     */
    function createProposal(
        ProposalType _proposalType,
        string memory _title,
        string memory _description,
        string memory _ipfsHash,
        bytes memory _executionData
    ) external nonReentrant returns (uint256) {
        require(address(aegisToken) != address(0), "Token not set");
        require(
            aegisToken.balanceOf(msg.sender) >= proposalThreshold,
            "Insufficient tokens to propose"
        );
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + votingPeriod;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            proposalType: _proposalType,
            title: _title,
            description: _description,
            ipfsHash: _ipfsHash,
            startTime: startTime,
            endTime: endTime,
            votesFor: 0,
            votesAgainst: 0,
            votesAbstain: 0,
            status: ProposalStatus.ACTIVE,
            executed: false,
            executionData: _executionData
        });
        
        activeProposals.push(proposalId);
        
        emit ProposalCreated(
            proposalId,
            msg.sender,
            _proposalType,
            _title,
            startTime,
            endTime
        );
        
        return proposalId;
    }
    
    /**
     * @dev Cast a vote on a proposal
     */
    function castVote(
        uint256 _proposalId,
        bool _support,
        bool _abstain
    ) external nonReentrant {
        require(address(aegisToken) != address(0), "Token not set");
        require(proposals[_proposalId].id != 0, "Proposal does not exist");
        require(
            proposals[_proposalId].status == ProposalStatus.ACTIVE,
            "Proposal not active"
        );
        require(block.timestamp <= proposals[_proposalId].endTime, "Voting period ended");
        require(votes[_proposalId][msg.sender].voter == address(0), "Already voted");
        
        uint256 votingPower = aegisToken.balanceOf(msg.sender);
        require(votingPower > 0, "No voting power");
        
        votes[_proposalId][msg.sender] = Vote({
            voter: msg.sender,
            proposalId: _proposalId,
            support: _support,
            abstain: _abstain,
            weight: votingPower,
            timestamp: block.timestamp
        });
        
        proposalVoters[_proposalId].push(msg.sender);
        
        if (_abstain) {
            proposals[_proposalId].votesAbstain += votingPower;
        } else if (_support) {
            proposals[_proposalId].votesFor += votingPower;
        } else {
            proposals[_proposalId].votesAgainst += votingPower;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support, votingPower, block.timestamp);
    }
    
    /**
     * @dev Finalize a proposal after voting period ends
     */
    function finalizeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.id != 0, "Proposal does not exist");
        require(proposal.status == ProposalStatus.ACTIVE, "Proposal not active");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        
        uint256 totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
        uint256 totalSupply = aegisToken.totalSupply();
        
        ProposalStatus oldStatus = proposal.status;
        
        // Check quorum
        if (totalVotes * 100 < totalSupply * quorumPercentage) {
            proposal.status = ProposalStatus.REJECTED;
        }
        // Check approval threshold
        else if (proposal.votesFor * 100 >= (proposal.votesFor + proposal.votesAgainst) * approvalThreshold) {
            proposal.status = ProposalStatus.PASSED;
        }
        else {
            proposal.status = ProposalStatus.REJECTED;
        }
        
        emit ProposalStatusChanged(_proposalId, oldStatus, proposal.status);
    }
    
    /**
     * @dev Execute a passed proposal
     */
    function executeProposal(uint256 _proposalId) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
        nonReentrant 
    {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.id != 0, "Proposal does not exist");
        require(proposal.status == ProposalStatus.PASSED, "Proposal not passed");
        require(!proposal.executed, "Already executed");
        
        proposal.executed = true;
        proposal.status = ProposalStatus.EXECUTED;
        
        // Execute proposal logic here (if executionData is provided)
        // This would typically call other contracts or update parameters
        
        emit ProposalExecuted(_proposalId, block.timestamp);
    }
    
    /**
     * @dev Cancel a proposal (only by proposer or admin)
     */
    function cancelProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        
        require(proposal.id != 0, "Proposal does not exist");
        require(
            msg.sender == proposal.proposer || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        require(
            proposal.status == ProposalStatus.PENDING || 
            proposal.status == ProposalStatus.ACTIVE,
            "Cannot cancel"
        );
        
        ProposalStatus oldStatus = proposal.status;
        proposal.status = ProposalStatus.CANCELLED;
        
        emit ProposalCancelled(_proposalId, block.timestamp);
        emit ProposalStatusChanged(_proposalId, oldStatus, ProposalStatus.CANCELLED);
    }
    
    /**
     * @dev Get proposal details
     */
    function getProposal(uint256 _proposalId)
        external
        view
        returns (
            address proposer,
            ProposalType proposalType,
            string memory title,
            string memory description,
            uint256 startTime,
            uint256 endTime,
            uint256 votesFor,
            uint256 votesAgainst,
            uint256 votesAbstain,
            ProposalStatus status
        )
    {
        Proposal memory proposal = proposals[_proposalId];
        return (
            proposal.proposer,
            proposal.proposalType,
            proposal.title,
            proposal.description,
            proposal.startTime,
            proposal.endTime,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.votesAbstain,
            proposal.status
        );
    }
    
    /**
     * @dev Get all active proposals
     */
    function getActiveProposals() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // Count active proposals
        for (uint256 i = 0; i < activeProposals.length; i++) {
            if (proposals[activeProposals[i]].status == ProposalStatus.ACTIVE) {
                activeCount++;
            }
        }
        
        // Build array of active proposal IDs
        uint256[] memory active = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < activeProposals.length; i++) {
            if (proposals[activeProposals[i]].status == ProposalStatus.ACTIVE) {
                active[index] = activeProposals[i];
                index++;
            }
        }
        
        return active;
    }
    
    /**
     * @dev Get vote details for a specific voter on a proposal
     */
    function getVote(uint256 _proposalId, address _voter)
        external
        view
        returns (
            bool hasVoted,
            bool support,
            bool abstain,
            uint256 weight,
            uint256 timestamp
        )
    {
        Vote memory vote = votes[_proposalId][_voter];
        
        if (vote.voter == address(0)) {
            return (false, false, false, 0, 0);
        }
        
        return (true, vote.support, vote.abstain, vote.weight, vote.timestamp);
    }
    
    /**
     * @dev Update governance parameters
     */
    function updateParameters(
        uint256 _votingPeriod,
        uint256 _proposalThreshold,
        uint256 _quorumPercentage,
        uint256 _approvalThreshold
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_quorumPercentage <= 100, "Invalid quorum");
        require(_approvalThreshold <= 100, "Invalid threshold");
        
        votingPeriod = _votingPeriod;
        proposalThreshold = _proposalThreshold;
        quorumPercentage = _quorumPercentage;
        approvalThreshold = _approvalThreshold;
    }
}

