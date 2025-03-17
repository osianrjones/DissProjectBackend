
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      mining: {
        auto : true,
      },
    },
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200, // Adjust based on contract complexity
    },
  },
};
