// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title AEGISToken
 * @dev The native utility and governance token for the AI Safety Ecosystem
 * @notice AEGIS = AI Ecosystem Governance & Integrity System
 * 
 * Token Utility:
 * - Governance voting on platform policies
 * - Access to premium platform features
 * - Staking for validator rewards
 * - Payment for API usage across all 15 platforms
 * - Incentives for safety reporting and bug bounties
 */
contract AEGISToken is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Token economics
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;  // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10**18; // 100 million (10%)
    
    // Distribution tracking
    uint256 public teamAllocation = 150_000_000 * 10**18;      // 15% - 4 year vest
    uint256 public ecosystemAllocation = 300_000_000 * 10**18; // 30% - platform rewards
    uint256 public publicSaleAllocation = 200_000_000 * 10**18;// 20% - public sale
    uint256 public liquidityAllocation = 150_000_000 * 10**18; // 15% - DEX liquidity
    uint256 public reserveAllocation = 100_000_000 * 10**18;   // 10% - treasury
    
    uint256 public teamReleased;
    uint256 public ecosystemReleased;
    uint256 public publicSaleReleased;
    uint256 public liquidityReleased;
    uint256 public reserveReleased;
    
    // Vesting
    uint256 public immutable vestingStart;
    uint256 public constant VESTING_DURATION = 4 * 365 days;
    
    // Staking
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lockPeriod;
        uint256 rewardRate;
    }
    
    mapping(address => Stake[]) public stakes;
    uint256 public totalStaked;
    
    // Events
    event TokensStaked(address indexed staker, uint256 amount, uint256 lockPeriod);
    event TokensUnstaked(address indexed staker, uint256 amount, uint256 reward);
    event RewardsClaimed(address indexed staker, uint256 reward);
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    /**
     * @dev Constructor - mints initial supply
     */
    constructor() ERC20("AEGIS Token", "AEGIS") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        vestingStart = block.timestamp;
        
        // Mint initial supply to deployer
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Mint new tokens (respects max supply)
     */
    function mint(address to, uint256 amount, string memory reason) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Stake tokens for rewards
     * @param amount Amount to stake
     * @param lockPeriod Lock period in seconds (30/90/180/365 days)
     */
    function stake(uint256 amount, uint256 lockPeriod) external nonReentrant whenNotPaused {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(
            lockPeriod == 30 days || 
            lockPeriod == 90 days || 
            lockPeriod == 180 days || 
            lockPeriod == 365 days,
            "Invalid lock period"
        );
        
        // Calculate reward rate based on lock period
        uint256 rewardRate;
        if (lockPeriod == 30 days) rewardRate = 5;      // 5% APY
        else if (lockPeriod == 90 days) rewardRate = 10; // 10% APY
        else if (lockPeriod == 180 days) rewardRate = 15;// 15% APY
        else if (lockPeriod == 365 days) rewardRate = 25;// 25% APY
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Create stake
        stakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            lockPeriod: lockPeriod,
            rewardRate: rewardRate
        }));
        
        totalStaked += amount;
        
        emit TokensStaked(msg.sender, amount, lockPeriod);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     * @param stakeIndex Index of the stake to unstake
     */
    function unstake(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        
        Stake memory userStake = stakes[msg.sender][stakeIndex];
        require(
            block.timestamp >= userStake.startTime + userStake.lockPeriod,
            "Stake still locked"
        );
        
        // Calculate rewards
        uint256 stakeDuration = block.timestamp - userStake.startTime;
        uint256 reward = (userStake.amount * userStake.rewardRate * stakeDuration) / (100 * 365 days);
        
        // Remove stake
        stakes[msg.sender][stakeIndex] = stakes[msg.sender][stakes[msg.sender].length - 1];
        stakes[msg.sender].pop();
        
        totalStaked -= userStake.amount;
        
        // Transfer tokens back
        _transfer(address(this), msg.sender, userStake.amount);
        
        // Mint rewards (if within max supply)
        if (totalSupply() + reward <= MAX_SUPPLY) {
            _mint(msg.sender, reward);
        }
        
        emit TokensUnstaked(msg.sender, userStake.amount, reward);
    }
    
    /**
     * @dev Get all stakes for an address
     */
    function getStakes(address account) 
        external 
        view 
        returns (Stake[] memory) 
    {
        return stakes[account];
    }
    
    /**
     * @dev Calculate pending rewards for a stake
     */
    function calculateRewards(address account, uint256 stakeIndex) 
        external 
        view 
        returns (uint256) 
    {
        require(stakeIndex < stakes[account].length, "Invalid stake index");
        
        Stake memory userStake = stakes[account][stakeIndex];
        uint256 stakeDuration = block.timestamp - userStake.startTime;
        uint256 reward = (userStake.amount * userStake.rewardRate * stakeDuration) / (100 * 365 days);
        
        return reward;
    }
    
    /**
     * @dev Release vested team tokens
     */
    function releaseTeamTokens(address to, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(teamReleased + amount <= teamAllocation, "Exceeds team allocation");
        
        uint256 vestedAmount = (teamAllocation * (block.timestamp - vestingStart)) / VESTING_DURATION;
        require(teamReleased + amount <= vestedAmount, "Tokens not yet vested");
        
        teamReleased += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Release ecosystem tokens for platform rewards
     */
    function releaseEcosystemTokens(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(ecosystemReleased + amount <= ecosystemAllocation, "Exceeds ecosystem allocation");
        ecosystemReleased += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Release public sale tokens
     */
    function releasePublicSaleTokens(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(publicSaleReleased + amount <= publicSaleAllocation, "Exceeds public sale allocation");
        publicSaleReleased += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Release liquidity tokens
     */
    function releaseLiquidityTokens(address to, uint256 amount) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(liquidityReleased + amount <= liquidityAllocation, "Exceeds liquidity allocation");
        liquidityReleased += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Release reserve tokens
     */
    function releaseReserveTokens(address to, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(reserveReleased + amount <= reserveAllocation, "Exceeds reserve allocation");
        reserveReleased += amount;
        _mint(to, amount);
    }
    
    /**
     * @dev Pause token transfers (emergency only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Get token distribution status
     */
    function getDistributionStatus() 
        external 
        view 
        returns (
            uint256 _teamReleased,
            uint256 _ecosystemReleased,
            uint256 _publicSaleReleased,
            uint256 _liquidityReleased,
            uint256 _reserveReleased,
            uint256 _totalSupply,
            uint256 _maxSupply
        ) 
    {
        return (
            teamReleased,
            ecosystemReleased,
            publicSaleReleased,
            liquidityReleased,
            reserveReleased,
            totalSupply(),
            MAX_SUPPLY
        );
    }
    
    // Required overrides
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}

