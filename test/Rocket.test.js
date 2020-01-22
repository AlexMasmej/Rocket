const { expectRevert } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const Proxy = artifacts.require('Proxy');
const Rocket = artifacts.require('Rocket'); // Loads a compiled contract
const MyNFTContract = artifacts.require('NFToken');

contract('Rocket', accounts => {
  const owner = accounts[0];
  let rocket;
  let rokectLogic;
  let myNFT;
  before(async function() {
    console.log('Owner: ', owner);
    this.timeout(50000);
    myNFT = await MyNFTContract.new();
    console.log('MyNFT deployed at: ', myNFT.address);

    rocketLogic = await Rocket.new();
    console.log('rocketLogic deployed at: ', rocketLogic.address);
    // Get the init code for rocket
    const rocketConstructCode = rocketLogic.contract.methods
      .initialize('Rocket')
      .encodeABI();
    // Deploy the Proxy, using the init code for rocket
    const proxy = await Proxy.new(rocketConstructCode, rocketLogic.address);
    // Create the rocket contract object using the proxy address
    rocket = await Rocket.at(proxy.address);
    console.log('Proxy Rocket deployed at: ', rocket.address);
  });

  it('deployer is owner, mintToken', async function() {
    await myNFT.mintToken(owner, 0);
    expect(await myNFT.ownerOf(0)).to.equal(owner);
  });

  it('should be able to transfer token to bank', async function() {
    await myNFT.safeTransferFrom(owner, rocket.address, 0, { from: owner });
    expect(await myNFT.ownerOf(0)).to.equal(rocket.address);
  });

  it('contract bank is owner', async function() {
    expect(await myNFT.ownerOf(0)).to.equal(rocket.address);
  });

  it('contract bank understands who is owner internally', async function() {
    expect(await rocket.ownerOf(myNFT.address, 0)).to.equal(owner);
  });

  it('original owner is owner in bank', async function() {
    expect(await rocket.ownerOf(myNFT.address, 0)).to.equal(owner);
  });

  it('should be able to transfer from bank to original contract', async function() {
    await rocket.safeTransferFrom(myNFT.address, owner, owner, 0, '0x0a', {
      from: owner
    }),
      expect(await myNFT.ownerOf(0)).to.equal(owner);
  });

  it('original owner is owner', async function() {
    expect(await myNFT.ownerOf(0)).to.equal(owner);
  });

  it('original owner is not owner after he has transferred it', async function() {
    expectRevert(
      rocket.ownerOf(myNFT.address, 0),
      'ERC721: owner query for nonexistent token'
    );
  });
});
