const { ethers } = require("hardhat");

async function main() {
  console.log("🔑 Generating deployment wallet...\n");

  // Generate a new random wallet
  const wallet = ethers.Wallet.createRandom();

  console.log("✅ Wallet generated successfully!\n");
  console.log("📋 Wallet Details:");
  console.log("   Address:", wallet.address);
  console.log("   Private Key:", wallet.privateKey);
  console.log("   Mnemonic:", wallet.mnemonic.phrase);
  console.log("");
  console.log("⚠️  IMPORTANT: Save these details securely!");
  console.log("   Never share your private key or mnemonic with anyone.");
  console.log("");
  console.log("📝 Next Steps:");
  console.log("   1. Add private key to .env file:");
  console.log(`      PRIVATE_KEY=${wallet.privateKey}`);
  console.log("");
  console.log("   2. Get test MATIC from faucet:");
  console.log(`      https://faucet.polygon.technology/`);
  console.log(`      Address: ${wallet.address}`);
  console.log("");
  console.log("   3. Wait for MATIC to arrive (check on PolygonScan Mumbai)");
  console.log("");
  console.log("   4. Deploy contracts:");
  console.log("      npx hardhat run scripts/deploy-all.js --network mumbai");
  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

