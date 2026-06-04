const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // ✅ FIXED LINE (ethers v6)
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Balance:", balance.toString());

  const Contract = await ethers.getContractFactory("CertificateNFT");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  console.log("Deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});