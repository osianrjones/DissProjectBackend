const Web3 = require("web3");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Token = await ethers.getContractFactory("VoteToken");

    try {
    const mintValue = 10000;
    const token = await Token.deploy(mintValue);

    await token.waitForDeployment();

    console.log("Vote contract deployed to:", token.target);
    
    } catch (error) {
        console.error("Error during deployment: ", error);
    }
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  