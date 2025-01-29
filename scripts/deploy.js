const Web3 = require("web3");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const proposals = ["Maple", "Pixie", "Molly", "Charlie"]

    const proposalNamesBytes32 = proposals.map((name) =>
        Web3.utils.rightPad(Web3.utils.asciiToHex(name), 64)
    );

    const Vote = await ethers.getContractFactory("Vote");

    try {
    const vote = await Vote.deploy(proposalNamesBytes32, "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    await vote.waitForDeployment();

    console.log("Vote contract deployed to:", vote.target);
    } catch (error) {
        console.error("Error during deployment: ", error);
    }
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  