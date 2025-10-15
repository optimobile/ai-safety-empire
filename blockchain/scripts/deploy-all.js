const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AI Safety Empire Smart Contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString(), "\n");

  // Deploy AIDecisionLogger
  console.log("1️⃣  Deploying AIDecisionLogger...");
  const AIDecisionLogger = await hre.ethers.getContractFactory("AIDecisionLogger");
  const decisionLogger = await AIDecisionLogger.deploy();
  await decisionLogger.deployed();
  console.log("✅ AIDecisionLogger deployed to:", decisionLogger.address);
  console.log("");

  // Deploy GovernanceVoting (requires AEGIS token address, will update later)
  console.log("2️⃣  Deploying GovernanceVoting...");
  const GovernanceVoting = await hre.ethers.getContractFactory("GovernanceVoting");
  const governance = await GovernanceVoting.deploy(
    "0x0000000000000000000000000000000000000000", // Placeholder, will update
    7 * 24 * 60 * 60, // 7 days voting period
    10, // 10% quorum
    66  // 66% approval threshold
  );
  await governance.deployed();
  console.log("✅ GovernanceVoting deployed to:", governance.address);
  console.log("");

  // Deploy AEGIS Token
  console.log("3️⃣  Deploying AEGIS Token...");
  const AEGISToken = await hre.ethers.getContractFactory("AEGISToken");
  const aegisToken = await AEGISToken.deploy();
  await aegisToken.deployed();
  console.log("✅ AEGIS Token deployed to:", aegisToken.address);
  console.log("");

  // Deploy JABULON COIN
  console.log("4️⃣  Deploying JABULON COIN...");
  
  // Create pool addresses (in production, these would be multisig wallets)
  const communityRewardsPool = deployer.address; // Placeholder
  const liquidityPool = deployer.address; // Placeholder
  const teamVesting = deployer.address; // Placeholder
  const marketingPool = deployer.address; // Placeholder
  const charityPool = deployer.address; // Placeholder
  const platformDevelopmentPool = deployer.address; // Placeholder
  
  const JabulonCoin = await hre.ethers.getContractFactory("JabulonCoin");
  const kekCoin = await JabulonCoin.deploy(
    communityRewardsPool,
    liquidityPool,
    teamVesting,
    marketingPool,
    charityPool,
    platformDevelopmentPool
  );
  await kekCoin.deployed();
  console.log("✅ JABULON COIN deployed to:", kekCoin.address);
  console.log("");

  // Link JABULON COIN to AEGIS Token
  console.log("5️⃣  Linking JABULON COIN to AEGIS Token...");
  await kekCoin.setAEGISTokenAddress(aegisToken.address);
  console.log("✅ JABULON COIN linked to AEGIS Token");
  console.log("");

  // Update GovernanceVoting with AEGIS token address
  console.log("6️⃣  Updating GovernanceVoting with AEGIS address...");
  // Note: This would require a setter function in GovernanceVoting
  // For now, we'll redeploy with correct address
  const governanceUpdated = await GovernanceVoting.deploy(
    aegisToken.address,
    7 * 24 * 60 * 60,
    10,
    66
  );
  await governanceUpdated.deployed();
  console.log("✅ GovernanceVoting updated to:", governanceUpdated.address);
  console.log("");

  // Summary
  console.log("=" * 70);
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" * 70);
  console.log("");
  console.log("📋 Contract Addresses:");
  console.log("   AIDecisionLogger:", decisionLogger.address);
  console.log("   GovernanceVoting:", governanceUpdated.address);
  console.log("   AEGIS Token:", aegisToken.address);
  console.log("   JABULON COIN:", kekCoin.address);
  console.log("");
  console.log("💾 Save these addresses to your .env file:");
  console.log(`   CONTRACT_ADDRESS_LOGGER=${decisionLogger.address}`);
  console.log(`   CONTRACT_ADDRESS_GOVERNANCE=${governanceUpdated.address}`);
  console.log(`   CONTRACT_ADDRESS_AEGIS=${aegisToken.address}`);
  console.log(`   CONTRACT_ADDRESS_JABL=${kekCoin.address}`);
  console.log("");
  console.log("📊 Token Information:");
  console.log("   AEGIS Total Supply:", (await aegisToken.totalSupply()).toString());
  console.log("   JABL Total Supply:", (await kekCoin.totalSupply()).toString());
  console.log("");
  console.log("🔗 Next Steps:");
  console.log("   1. Verify contracts on PolygonScan");
  console.log("   2. Update .env with contract addresses");
  console.log("   3. Set up liquidity pools for JABULON COIN");
  console.log("   4. Configure governance parameters");
  console.log("   5. Start backend API with new addresses");
  console.log("");
  console.log("🌐 Verify on PolygonScan:");
  console.log(`   npx hardhat verify --network mumbai ${decisionLogger.address}`);
  console.log(`   npx hardhat verify --network mumbai ${governanceUpdated.address} "${aegisToken.address}" 604800 10 66`);
  console.log(`   npx hardhat verify --network mumbai ${aegisToken.address}`);
  console.log(`   npx hardhat verify --network mumbai ${kekCoin.address} "${communityRewardsPool}" "${liquidityPool}" "${teamVesting}" "${marketingPool}" "${charityPool}" "${platformDevelopmentPool}"`);
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

