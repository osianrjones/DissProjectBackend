async function main() {
    const { ethers } = require("hardhat");  // Use ethers from Hardhat

    // Get contract instances
    const [deployer] = await ethers.getSigners();
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const votingAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    // Get token and voting contract instances
    const token = await ethers.getContractAt("VoteToken", tokenAddress);
    const voting = await ethers.getContractAt("Vote", votingAddress);

    const totalSupply = await token.totalSupply();
    console.log("total supply: ", totalSupply)

    // Transfer 100 tokens from the token contract to the voting contract
    //const amount = ethers.utils.parseUnits("100", 18);  // Convert amount to smallest unit
    const tx = await token.transfer(votingAddress, 100);
    await tx.wait();
   // console.log(`Transferred ${ethers.utils.formatUnits(amount, 18)} tokens to the voting contract`);

    // Confirm the transfer
    const newVotingBalance = await token.balanceOf(votingAddress);
    console.log("newVotingBalanace: ", newVotingBalance);
    //console.log("New voting contract token balance:", ethers.utils.formatUnits(newVotingBalance, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
