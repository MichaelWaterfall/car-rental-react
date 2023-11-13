const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('CarRental', function () {
  let deployer, user1, user2, user3, etherFailedUser, user4;
  let carRentalFactory;
  let carRental;

  before(async function () {
    [deployer, user1, user2, user3, etherFailedUser, user4] = await ethers.getSigners();

    carRentalFactory = await ethers.getContractFactory('CarRental', deployer);
    carRental = await carRentalFactory.deploy(10);
  });

  it('should deploy and set owner correctly', async () => {
    expect(await carRental.owner()).to.be.equal(deployer.address);
  });

  it('should NOT add renter if called by owner', async () => {
    expect(await carRental.addRenter).to.be.revertedWith('The owner cannot rent a car');
  });

  it('should add renter', async () => {
    await carRental.connect(user1).addRenter();
    expect(await carRental.connect(user1).getRenterId()).to.be.equal(1);

    await carRental.connect(user2).addRenter();
    expect(await carRental.connect(user2).getRenterId()).to.be.equal(2);
    await expect(carRental.connect(user1).checkInCar()).to.be.revertedWith('Please check out a car first');
  });

  it('should NOT check in car if car has been rented for less than one minute', async () => {
    await carRental.connect(user1).checkOutCar();
    await expect(carRental.connect(user1).checkInCar()).to.be.revertedWith(
      'You must rent a car for a minimum of 1 minute'
    );
    await carRental.connect(user1).makePayment();
  });

  it('should NOT change price if not called by owner and price is less than zero', async () => {
    await expect(carRental.connect(user1).changePrice(20)).to.be.revertedWith('Only owner');
    await expect(carRental.connect(deployer).changePrice(0)).to.be.revertedWith('Price must be greater than zero');
  });

  it('should change price if called by owner', async () => {
    await carRental.changePrice(20);
    expect(await carRental.price()).to.be.equal(20);
  });

  it('should NOT change owner if called by user, owner or owner tries to change to renter', async () => {
    await expect(carRental.connect(user1).changeOwner(user1.address)).to.be.revertedWith('Only owner');
    await expect(carRental.connect(deployer).changeOwner(deployer.address)).to.be.revertedWith(
      'The new owner must be different to the orignal owner'
    );
    await expect(carRental.connect(deployer).changeOwner(user1.address)).to.be.revertedWith(
      'Renter cannot become the owner'
    );
  });

  it('should change owner if called by owner', async () => {
    await carRental.changeOwner(user3.address);
    expect(await carRental.owner()).to.be.equal(user3.address);

    await carRental.connect(user3).changeOwner(deployer.address);
    expect(await carRental.owner()).to.be.equal(deployer.address);
  });

  it('should NOT be able to make payment if owner and or no payment is due', async () => {
    await expect(carRental.connect(deployer).makePayment()).to.be.revertedWith('Owner cannot make a payment');
    /*await expect(carRental.connect(user1).makePayment()).to.be.revertedWith(
      'You do not have anything due at this time'
    );*/
  });

  it('should be able to check out a car', async () => {
    //await expect(carRental.connect(user1).checkInCar()).to.be.revertedWith('Please check out a car first');
    await carRental.connect(user1).checkOutCar();
    let user1Id, user1CanRent, user1Active;
    [user1Id, user1CanRent, user1Active] = await carRental.connect(user1).getRenter();
    expect(user1Id).to.be.equal(1);
    expect(user1CanRent).to.be.equal(false);
    expect(user1Active).to.be.equal(true);
    await expect(carRental.connect(user3).checkOutCar()).to.be.revertedWith('Not a renter');
    await expect(carRental.connect(user1).checkOutCar()).to.be.revertedWith('You cannot rent at this time');
  });

  it('should be able to check in a car', async () => {
    await network.provider.send('evm_increaseTime', [3600]);
    await carRental.connect(user1).checkInCar();
    let user1Id, user1CanRent, user1Active;
    [user1Id, user1CanRent, user1Active] = await carRental.connect(user1).getRenter();
    expect(user1Id).to.be.equal(1);
    expect(user1CanRent).to.be.equal(false);
    expect(user1Active).to.be.equal(false);
    expect(await carRental.getDue(user1.address)).to.be.equal(1200);
    await expect(carRental.connect(user1).checkOutCar()).to.be.revertedWith('You have a pending balance');
  });

  it('should NOT be able to make payment without funds', async () => {
    await expect(carRental.connect(user1).makePayment()).to.be.revertedWith('Please only send the amount due');
  });
  /*
  it('should be able to make deposit', async () => {
    const user1InitialBalance = await carRental.connect(user1).balanceOfRenter();
    console.log('Before: ' + user1InitialBalance);
    const user1Deposit = await ethers.utils.parseEther('1');
    await carRental.connect(user1).deposit({ value: user1Deposit });
    expect(await carRental.connect(user1).balanceOfRenter()).to.be.equal(user1InitialBalance.add(user1Deposit));
    expect(await carRental.connect(deployer).balanceOf()).to.be.equal(user1Deposit);
    console.log('After: ' + (await carRental.connect(user1).balanceOfRenter()));
  });
  */
  it('should be able to make payment', async () => {
    console.log('Due: ', await carRental.getDue(user1.address));
    const user1InitialBalance = await carRental.connect(user1).balanceOfRenter();
    const ownerInitialBalance = await ethers.provider.getBalance(deployer.address);
    await carRental.connect(user1).makePayment({ value: await carRental.getDue(user1.address) });
    console.log('Due1: ', await carRental.getDue(user1.address));
    const ownerAfterBalance = await ethers.provider.getBalance(deployer.address);
    console.log(ownerInitialBalance, ownerAfterBalance);
    expect(ownerAfterBalance).to.be.equal(ownerInitialBalance.add(1200));
    //expect(await carRental.connect(user1).balanceOfRenter()).to.be.equal(user1InitialBalance.sub(240));
  });
  /*
  it('should let owner withdraw balance', async () => {
    const deployerInitialBalance = await ethers.provider.getBalance(deployer.address);
    console.log("ContractOwnerBalance: ", await carRental.connect(deployer).getOwnerBalance());
    console.log("Before: ", deployerInitialBalance);
    await carRental.withdrawOwnerBalance();
    //const receipt = await tx.wait();
    //const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    const deployerBalance = await ethers.provider.getBalance(deployer.address);
    console.log("ContractOwnerBalance: ", await carRental.connect(deployer).getOwnerBalance());
    console.log("After: ", deployerBalance);
    console.log("Difference: ", deployerInitialBalance - deployerBalance);
    expect(deployerInitialBalance).to.be.equal(deployerBalance.add(240));
  });
  */
  it('should check if renter can rent a car', async () => {
    expect(await carRental.canRentCar(user1.address)).to.be.equal(true);
  });

  it('should revert if adding owner as renter', async () => {
    await expect(carRental.connect(deployer).addRenter()).to.be.revertedWith('The owner cannot rent a car');
  });
  /*
  it('should NOT be able to get owner balance or with owner balance unless owmer', async () => {
    await expect(carRental.connect(user1).getOwnerBalance()).to.be.revertedWith("Only owner");
    await expect(carRental.connect(user1).withdrawOwnerBalance()).to.be.revertedWith("Only owner")
  });
  */

  it('should REVERT when ether fails to send in makePayment function', async () => {
    const etherFailedFactory = await ethers.getContractFactory('EtherFailed', etherFailedUser);
    const etherFailedContract = await etherFailedFactory.deploy();
    await carRental.connect(deployer).changeOwner(etherFailedContract.address);
    await carRental.connect(user1).checkOutCar();
    await network.provider.send('evm_increaseTime', [3600]);
    await carRental.connect(user1).checkInCar();
    await expect(
      carRental.connect(user1).makePayment({ value: await carRental.getDue(user1.address) })
    ).to.be.revertedWith('Ether failed to send');
  });

  it('should getTimer', async () => {
    expect(await carRental.getTimer(user1.address)).to.be.equal(false);
  });

  it('should NOT allow user to make payment if lacking funds', async () => {
    await carRental.connect(user4).addRenter();
    await carRental.connect(user4).checkOutCar();
    await network.provider.send('evm_increaseTime', [999999999999999999999999999999999999999999999999]);
    await carRental.connect(user4).checkInCar();
    await expect(carRental.connect(user4).makePayment({ value: 0 })).to.be.revertedWith(
      'You do not have enough funds to cover payment. Please make a deposit'
    );
  });
});