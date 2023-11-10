require('dotenv').config();
require('@nomiclabs/hardhat-ethers');
require("@nomicfoundation/hardhat-chai-matchers")

module.exports = {
  solidity: '0.8.19',
  //defaultNetwork: "sepolia",
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};