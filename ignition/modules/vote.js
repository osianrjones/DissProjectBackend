// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const Web3 = require("web3");

//const web3 = new Web3("http://127.0.0.1:8545");

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI = 1_000_000_000n;

module.exports = buildModule("VoteModule", (m) => {
  const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);

  //Candidates to pass to constructor
  const candidateNames = ["Maple", "Pixie"].map((name) => 
    Web3.utils.rightPad(Web3.utils.asciiToHex(name), 64)
  );

  console.log(candidateNames.length);

  const vote = null;

try {
   vote = m.contract("Vote", [candidateNames], {
    value: lockedAmount,
    gas: 600000000,
  });
} catch (error) {
    console.error("error: ", error);
}
  return { vote };
});
