const hardhat = require("hardhat");
const Web3 = require("web3");

async function main() {
    //Deploy Vote
    const proposals = ["Ronald", "Barack", "Bill", "George"];

    const proposalNamesBytes32 = proposals.map((name) =>
        Web3.utils.rightPad(Web3.utils.asciiToHex(name), 64)
    );

    const Vote = await ethers.getContractFactory("Vote");
    const vote = await Vote.deploy(proposalNamesBytes32, "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

    await vote.waitForDeployment();

    console.log("Vote contract deployed to:", vote.target);

    //Deploy VoteToken
    const VoteToken = await ethers.getContractFactory("VoteToken");
    const tokenAmount = Web3.utils.toWei("1000", 'ether');
    const deployToken = await VoteToken.deploy(tokenAmount, vote.target);
    await deployToken.waitForDeployment();
    console.log("VoteToken deployed to address: ", deployToken.target);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  