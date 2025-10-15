const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment of AI Safety Empire smart contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log();

  // Deploy AEGIS Token
  console.log("📝 Deploying AEGIS Token...");
  const AEGISToken = await hre.ethers.getContractFactory("AEGISToken");
  const aegisToken = await AEGISToken.deploy();
  await aegisToken.deployed();
  console.log("✅ AEGIS Token deployed to:", aegisToken.address);
  console.log();

  // Deploy AI Decision Logger
  console.log("📝 Deploying AI Decision Logger...");
  const AIDecisionLogger = await hre.ethers.getContractFactory("AIDecisionLogger");
  const decisionLogger = await AIDecisionLogger.deploy();
  await decisionLogger.deployed();
  console.log("✅ AI Decision Logger deployed to:", decisionLogger.address);
  console.log();

  // Deploy Governance Voting
  console.log("📝 Deploying Governance Voting...");
  const GovernanceVoting = await hre.ethers.getContractFactory("GovernanceVoting");
  const governance = await GovernanceVoting.deploy();
  await governance.deployed();
  console.log("✅ Governance Voting deployed to:", governance.address);
  console.log();

  // Link AEGIS token to Governance
  console.log("🔗 Linking AEGIS Token to Governance...");
  const setTokenTx = await governance.setAegisToken(aegisToken.address);
  await setTokenTx.wait();
  console.log("✅ AEGIS Token linked to Governance");
  console.log();

  // Set up Council Members
  console.log("👥 Setting up Council Members...");
  const councilMembers = [
    { name: "Safetyof.ai", address: deployer.address },
    { name: "Ethicalgovernanceof.ai", address: deployer.address },
    { name: "Accountabilityof.ai", address: deployer.address },
    { name: "RoboticsLaw.ai", address: deployer.address },
    { name: "RoboticsSafety.ai", address: deployer.address },
    { name: "RoboticsEthics.ai", address: deployer.address },
  ];

  for (const member of councilMembers) {
    const tx = await decisionLogger.addCouncilMember(member.address, member.name);
    await tx.wait();
    console.log(`  ✅ Added council member: ${member.name}`);
  }
  console.log();

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      AEGISToken: {
        address: aegisToken.address,
        name: "AEGIS Token",
        symbol: "AEGIS",
        maxSupply: "1000000000",
        initialSupply: "100000000",
      },
      AIDecisionLogger: {
        address: decisionLogger.address,
        name: "AI Decision Logger",
        councilMembers: councilMembers.length,
      },
      GovernanceVoting: {
        address: governance.address,
        name: "Governance Voting",
        votingPeriod: "7 days",
        quorum: "10%",
        approvalThreshold: "66%",
      },
    },
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const filename = `${hre.network.name}-${Date.now()}.json`;
  fs.writeFileSync(
    path.join(deploymentsDir, filename),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Save latest deployment
  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}-latest.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📄 Deployment info saved to:", filename);
  console.log();

  // Print summary
  console.log("=" .repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(60));
  console.log();
  console.log("Contract Addresses:");
  console.log("  AEGIS Token:        ", aegisToken.address);
  console.log("  AI Decision Logger: ", decisionLogger.address);
  console.log("  Governance Voting:  ", governance.address);
  console.log();
  console.log("Next Steps:");
  console.log("  1. Verify contracts on PolygonScan");
  console.log("  2. Update backend .env with contract addresses");
  console.log("  3. Test contract interactions");
  console.log("  4. Set up monitoring and alerts");
  console.log();

  // Verification commands
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("To verify contracts, run:");
    console.log(`  npx hardhat verify --network ${hre.network.name} ${aegisToken.address}`);
    console.log(`  npx hardhat verify --network ${hre.network.name} ${decisionLogger.address}`);
    console.log(`  npx hardhat verify --network ${hre.network.name} ${governance.address}`);
    console.log();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

