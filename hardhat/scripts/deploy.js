const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const CropNFT = await hre.ethers.getContractFactory("CropNFT");
  const cropNFT = await CropNFT.deploy();
  await cropNFT.deployed();
  console.log("the address for nft contract is: " + cropNFT.address);

  const Market = await hre.ethers.getContractFactory("Market");
  const market = await Market.deploy();

  await market.deployed();

  // console.log("MemeNFT deployed to:", memeNFT.address);
  console.log("Market deployed to:", market.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
