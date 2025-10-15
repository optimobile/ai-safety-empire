// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title JabulonCoin
 * @dev The community-driven meme token for AI safety with real utility
 * 
 * JABULON COIN - Enforcing AI Safety Through Community Power
 * 
 * The community token for the AI Safety Empire that rewards good actors:
 * - Reward deepfake reporters
 * - Tip content creators for authentic content
 * - Stake for premium AI safety features
 * - Convert to AEGIS governance tokens
 * - Support deepfake victims through charity
 * 
 * Total Supply: 1,000,000,000 JABL (aligned with governance)
 * 
 * Distribution:
 * - 50% Community Rewards (reporting, creating, protecting)
 * - 20% Liquidity Pools (DEX trading)
 * - 15% Team (4-year vesting, aligned incentives)
 * - 10% Marketing (viral campaigns, influencers)
 * - 5% Charity (mental health, deepfake victims)
 */
contract JabulonCoin is ERC20, ERC20Burnable, ERC20Pausable, AccessControl, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Maximum supply: 1,000,000,000 JABL
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;
    
    // Distribution addresses
    address public communityRewardsPool;
    address public liquidityPool;
    address public teamVesting;
    address public marketingPool;
    address public charityPool;
    
    // Conversion rate: 100 JABL = 1 AEGIS
    uint256 public constant JABL_TO_AEGIS_RATE = 100;
    address public aegisTokenAddress;
    
    // Transaction fee: 1% goes to platform development
    uint256 public constant TRANSACTION_FEE_PERCENT = 1;
    address public platformDevelopmentPool;
    
    // Staking
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lockPeriod; // in days
        uint256 rewardRate; // APY in basis points
    }
    
    mapping(address => Stake[]) public stakes;
    
    // Reward tracking
    mapping(address => uint256) public deepfakeReportsRewarded;
    mapping(address => uint256) public contentCreationRewarded;
    
    // Events
    event Staked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 rewardRate);
    event Unstaked(address indexed user, uint256 amount, uint256 reward);
    event ConvertedToAEGIS(address indexed user, uint256 kekAmount, uint256 aegisAmount);
    event DeepfakeReported(address indexed reporter, uint256 reward);
    event ContentCreatorRewarded(address indexed creator, uint256 reward);
    event CharityDonation(address indexed charity, uint256 amount);
    
    constructor(
        address _communityRewardsPool,
        address _liquidityPool,
        address _teamVesting,
        address _marketingPool,
        address _charityPool,
        address _platformDevelopmentPool
    ) ERC20("JABL Coin", "JABL") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        communityRewardsPool = _communityRewardsPool;
        liquidityPool = _liquidityPool;
        teamVesting = _teamVesting;
        marketingPool = _marketingPool;
        charityPool = _charityPool;
        platformDevelopmentPool = _platformDevelopmentPool;
        
        // Initial distribution
        _mint(_communityRewardsPool, (MAX_SUPPLY * 50) / 100); // 50% community
        _mint(_liquidityPool, (MAX_SUPPLY * 20) / 100);        // 20% liquidity
        _mint(_teamVesting, (MAX_SUPPLY * 15) / 100);          // 15% team
        _mint(_marketingPool, (MAX_SUPPLY * 10) / 100);        // 10% marketing
        _mint(_charityPool, (MAX_SUPPLY * 5) / 100);           // 5% charity
    }
    
    /**
     * @dev Stake JABL tokens to earn rewards
     * @param amount Amount of JABL to stake
     * @param lockPeriodDays Lock period in days (30, 90, 180, 365)
     */
    function stake(uint256 amount, uint256 lockPeriodDays) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Determine reward rate based on lock period
        uint256 rewardRate;
        if (lockPeriodDays == 30) {
            rewardRate = 500; // 5% APY
        } else if (lockPeriodDays == 90) {
            rewardRate = 1000; // 10% APY
        } else if (lockPeriodDays == 180) {
            rewardRate = 1500; // 15% APY
        } else if (lockPeriodDays == 365) {
            rewardRate = 2500; // 25% APY
        } else {
            revert("Invalid lock period");
        }
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Create stake
        stakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            lockPeriod: lockPeriodDays * 1 days,
            rewardRate: rewardRate
        }));
        
        emit Staked(msg.sender, amount, lockPeriodDays, rewardRate);
    }
    
    /**
     * @dev Unstake JABL tokens and claim rewards
     * @param stakeIndex Index of the stake to unstake
     */
    function unstake(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        
        Stake memory userStake = stakes[msg.sender][stakeIndex];
        require(block.timestamp >= userStake.startTime + userStake.lockPeriod, "Lock period not ended");
        
        // Calculate reward
        uint256 stakingDuration = block.timestamp - userStake.startTime;
        uint256 reward = (userStake.amount * userStake.rewardRate * stakingDuration) / (365 days * 10000);
        
        // Remove stake
        stakes[msg.sender][stakeIndex] = stakes[msg.sender][stakes[msg.sender].length - 1];
        stakes[msg.sender].pop();
        
        // Transfer staked amount + reward
        _transfer(address(this), msg.sender, userStake.amount);
        _mint(msg.sender, reward); // Mint reward tokens
        
        emit Unstaked(msg.sender, userStake.amount, reward);
    }
    
    /**
     * @dev Convert JABL to AEGIS tokens
     * @param kekAmount Amount of JABL to convert
     */
    function convertToAEGIS(uint256 kekAmount) external nonReentrant {
        require(aegisTokenAddress != address(0), "AEGIS token not set");
        require(balanceOf(msg.sender) >= kekAmount, "Insufficient JABL balance");
        
        uint256 aegisAmount = kekAmount / JABL_TO_AEGIS_RATE;
        require(aegisAmount > 0, "Amount too small to convert");
        
        // Burn JABL tokens
        _burn(msg.sender, kekAmount);
        
        // Mint AEGIS tokens (requires MINTER_ROLE on AEGIS contract)
        // This would call the AEGIS contract's mint function
        // For now, we emit an event for off-chain processing
        
        emit ConvertedToAEGIS(msg.sender, kekAmount, aegisAmount);
    }
    
    /**
     * @dev Reward user for reporting a deepfake
     * @param reporter Address of the reporter
     * @param rewardAmount Amount of JABL to reward
     */
    function rewardDeepfakeReport(address reporter, uint256 rewardAmount) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(reporter != address(0), "Invalid reporter address");
        
        // Transfer from community rewards pool
        _transfer(communityRewardsPool, reporter, rewardAmount);
        
        deepfakeReportsRewarded[reporter] += rewardAmount;
        
        emit DeepfakeReported(reporter, rewardAmount);
    }
    
    /**
     * @dev Reward content creator for authentic content
     * @param creator Address of the content creator
     * @param rewardAmount Amount of JABL to reward
     */
    function rewardContentCreator(address creator, uint256 rewardAmount) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(creator != address(0), "Invalid creator address");
        
        // Transfer from community rewards pool
        _transfer(communityRewardsPool, creator, rewardAmount);
        
        contentCreationRewarded[creator] += rewardAmount;
        
        emit ContentCreatorRewarded(creator, rewardAmount);
    }
    
    /**
     * @dev Donate to charity from charity pool
     * @param charity Address of the charity
     * @param amount Amount to donate
     */
    function donateToCharity(address charity, uint256 amount) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(charity != address(0), "Invalid charity address");
        
        _transfer(charityPool, charity, amount);
        
        emit CharityDonation(charity, amount);
    }
    
    /**
     * @dev Set AEGIS token address for conversion
     * @param _aegisTokenAddress Address of AEGIS token contract
     */
    function setAEGISTokenAddress(address _aegisTokenAddress) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        aegisTokenAddress = _aegisTokenAddress;
    }
    
    /**
     * @dev Get user's stakes
     * @param user Address of the user
     */
    function getUserStakes(address user) external view returns (Stake[] memory) {
        return stakes[user];
    }
    
    /**
     * @dev Pause token transfers
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
     * @dev Override transfer to apply transaction fee
     */
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        // Apply fee only on regular transfers (not minting/burning)
        if (from != address(0) && to != address(0)) {
            uint256 fee = (value * TRANSACTION_FEE_PERCENT) / 100;
            
            // Transfer fee to platform development pool
            super._update(from, platformDevelopmentPool, fee);
            
            // Transfer remaining amount to recipient
            super._update(from, to, value - fee);
        } else {
            super._update(from, to, value);
        }
    }
}

