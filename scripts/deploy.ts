require('dotenv').config();
import { ethers } from 'hardhat';
/*
let num: number;

if (network.name === 'mainnet') {
  num = 1;
} else if (network.name === 'localhost') {
  num = 2;
} else {
  throw new Error('Unsupported network');
}
*/
async function main(): Promise<void> {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contract with account:', deployer.address);
  const factory = await ethers.getContractFactory('CarRental');
  const contract = await factory.deploy(1);
  console.log('Contract address:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });