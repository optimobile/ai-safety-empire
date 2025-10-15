const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying AI Safety Empire Smart Contracts (LOCAL TESTNET)...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  // Deploy AIDecisionLogger
  console.log("1️⃣  Deploying AIDecisionLogger...");
  const AIDecisionLogger = await hre.ethers.getContractFactory("AIDecisionLogger");
  const decisionLogger = await AIDecisionLogger.deploy();
  await decisionLogger.deployed();
  const loggerAddress = decisionLogger.address;
  console.log("✅ AIDecisionLogger deployed to:", loggerAddress);
  console.log("");

  // Deploy AEGIS Token
  console.log("2️⃣  Deploying AEGIS Token...");
  const AEGISToken = await hre.ethers.getContractFactory("AEGISToken");
  const aegisToken = await AEGISToken.deploy();
  await aegisToken.deployed();
  const aegisAddress = aegisToken.address;
  console.log("✅ AEGIS Token deployed to:", aegisAddress);
  console.log("");

  // Deploy GovernanceVoting
  console.log("3️⃣  Deploying GovernanceVoting...");
  const GovernanceVoting = await hre.ethers.getContractFactory("GovernanceVoting");
  const governance = await GovernanceVoting.deploy();
  await governance.deployed();
  const governanceAddress = governance.address;
  console.log("✅ GovernanceVoting deployed to:", governanceAddress);
  console.log("");

  // Deploy JabulonCoin
  console.log("4️⃣  Deploying JabulonCoin...");
  
  // Use deployer address for all pools in local testing
  const JabulonCoin = await hre.ethers.getContractFactory("JabulonCoin");
  const jabulonCoin = await JabulonCoin.deploy(
    deployer.address, // communityRewardsPool
    deployer.address, // liquidityPool
    deployer.address, // teamVesting
    deployer.address, // marketingPool
    deployer.address, // charityPool
    deployer.address  // platformDevelopmentPool
  );
  await jabulonCoin.deployed();
  const jabulonAddress = jabulonCoin.address;
  console.log("✅ JabulonCoin deployed to:", jabulonAddress);
  console.log("");

  // Link JabulonCoin to AEGIS Token
  console.log("5️⃣  Linking JabulonCoin to AEGIS Token...");
  await jabulonCoin.setAEGISTokenAddress(aegisAddress);
  console.log("✅ JabulonCoin linked to AEGIS Token");
  console.log("");

  // Test contracts
  console.log("6️⃣  Testing contracts...");
  
  // Test AEGIS Token
  const aegisSupply = await aegisToken.totalSupply();
  console.log("   AEGIS Total Supply:", hre.ethers.utils.formatEther(aegisSupply), "AEGIS");
  
  // Test JabulonCoin
  const jablSupply = await jabulonCoin.totalSupply();
  console.log("   JABL Total Supply:", hre.ethers.utils.formatEther(jablSupply), "JABL");
  
  // Test AIDecisionLogger
  // Grant LOGGER_ROLE to deployer first
  const LOGGER_ROLE = await decisionLogger.LOGGER_ROLE();
  await decisionLogger.grantRole(LOGGER_ROLE, deployer.address);
  
  const tx = await decisionLogger.logDecision(
    "0x1234567890123456789012345678901234567890123456789012345678901234",
    "QmTest123", // IPFS hash
    false, // Not a robot decision
    "0x0000000000000000000000000000000000000000000000000000000000000000" // No parent
  );
  await tx.wait();
  const stats = await decisionLogger.getStatistics();
  console.log("   Decisions logged:", stats[0].toString()); // totalDecisions is first element
  
  console.log("✅ All tests passed!");
  console.log("");

  // Summary
  console.log("=".repeat(70));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(70));
  console.log("");
  console.log("📋 Contract Addresses:");
  console.log("   AIDecisionLogger:", loggerAddress);
  console.log("   GovernanceVoting:", governanceAddress);
  console.log("   AEGIS Token:", aegisAddress);
  console.log("   JabulonCoin:", jabulonAddress);
  console.log("");
  console.log("💾 Environment Variables:");
  console.log(`CONTRACT_ADDRESS_LOGGER=${loggerAddress}`);
  console.log(`CONTRACT_ADDRESS_GOVERNANCE=${governanceAddress}`);
  console.log(`CONTRACT_ADDRESS_AEGIS=${aegisAddress}`);
  console.log(`CONTRACT_ADDRESS_JABULON=${jabulonAddress}`);
  console.log("");
  console.log("📊 Token Information:");
  console.log("   AEGIS Total Supply:", hre.ethers.utils.formatEther(aegisSupply), "AEGIS");
  console.log("   JABL Total Supply:", hre.ethers.utils.formatEther(jablSupply), "JABL");
  console.log("   Conversion Rate: 100 JABL = 1 AEGIS");
  console.log("");
  console.log("✅ Ready for integration with backend API!");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

