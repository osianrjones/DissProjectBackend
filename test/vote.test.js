const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3 = require("web3");

describe("Vote Contract", function () {
  let Vote, vote, Token, deployToken, owner, addr1, addr2;

  before(async function () {

    [owner, addr1, addr2, _] = await ethers.getSigners();

   //Deploy Vote
   const proposals = ["Ronald", "Barack", "Bill", "George"];

   const proposalNamesBytes32 = proposals.map((name) =>
       Web3.utils.rightPad(Web3.utils.asciiToHex(name), 64)
   );

    Vote = await ethers.getContractFactory("Vote");
    vote = await Vote.deploy(proposalNamesBytes32, "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

   await vote.waitForDeployment();

   console.log("Vote contract deployed to:", vote.target);

   //Deploy VoteToken
   const VoteToken = await ethers.getContractFactory("VoteToken");
   const tokenAmount = Web3.utils.toWei("1000", 'ether');
   deployToken = await VoteToken.deploy(tokenAmount, vote.target);
   await deployToken.waitForDeployment();
   console.log("VoteToken deployed to address: ", deployToken.target);
  });

  describe("Voting and Registration", function () {
    it("Should register a user and mint tokens", async function () {
      await vote.connect(addr1).register({ value: Web3.utils.toWei("1", 'ether') });

      expect(await vote.hasRegistered(addr1.address)).to.be.true;
      expect(await deployToken.balanceOf(addr1.address)).to.equal(Web3.utils.toWei("1", 'ether')); // Assuming mintForUser mints 1 token
    });

    it("Should not allow a user to register twice", async function () {
      await expect(vote.connect(addr1).register({ value: Web3.utils.toWei("1", 'ether') }))
        .to.be.revertedWith("User already registered");
    });

    it("Should allow a user to vote", async function () {
      await deployToken.connect(addr1).approve(vote.target, Web3.utils.toWei("1", "ether"));

      await vote.connect(addr1).vote("Encrypted Vote 1");

      const encryptedVotes = await vote.getAllEncryptedVotes();
      expect(encryptedVotes.length).to.equal(1);
    });

    it("Should fail if a user tries to vote twice", async function () {
        const encryptedVotes = await vote.getAllEncryptedVotes();
        console.log(encryptedVotes.length);
      await expect(vote.connect(addr1).vote("Encrypted Vote 2"))
        .to.be.revertedWith("User has voted already.");
    });

    it("Should handle multiple transactions", async function () {
      const TRANSACTION_NUM = 1000;
      const expectedResult = "Ronald";

      for (let i = 0; i < TRANSACTION_NUM; i++) {
        const bytes32Result = await vote.winningProposal();
        const asciiResult = Web3.utils.hexToAscii(bytes32Result).replace(/\u0000/g, "");
        expect(asciiResult).to.equal(expectedResult);
      }

    });
    
  });

  describe("Proposals", function () {
    it("Should return all proposals", async function () {
      const proposals = await vote.getAllProposals();
      expect(proposals.length).to.equal(4);
      expect(Web3.utils.hexToUtf8(proposals[0].name.replace(/0+$/, ''))).to.equal("Ronald");
      expect(Web3.utils.hexToUtf8(proposals[1].name.replace(/0+$/, ''))).to.equal("Barack");
      expect(Web3.utils.hexToUtf8(proposals[2].name.replace(/0+$/, ''))).to.equal("Bill");
      expect(Web3.utils.hexToUtf8(proposals[3].name.replace(/0+$/, ''))).to.equal("George");
    });
  });
});
