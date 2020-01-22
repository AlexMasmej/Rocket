const { accounts, contract } = require('@openzeppelin/test-environment');
const { expectRevert } = require('@openzeppelin/test-helpers');

const [ owner, receiver ] = accounts;

const { expect } = require('chai');

const MyBankContract = contract.fromArtifact('bank'); // Loads a compiled contract
const MyNFTContract = contract.fromArtifact('NFToken'); 

let mybank
let myNFT

describe('MyContract', function () {

    before(async function() {
      this.timeout(50000); 
      mybank = await MyBankContract.new({ from: owner });
      myNFT = await MyNFTContract.new({ from: owner });
    });
    

  it('deployer is owner, mintToken', async function () {
    await myNFT.mintToken(owner, 0) 
    expect(await myNFT.ownerOf(0)).to.equal(owner);
  });

  it('should be able to transfer token to bank', async function () {
    // need test to handle not using safe transfer from to be able to redeem tokens 
    await myNFT.safeTransferFrom(owner, mybank.address, 0,{ from: owner }) 
    expect(await myNFT.ownerOf(0)).to.equal(mybank.address);
  });

  it('contract bank is owner', async function () {
    expect(await myNFT.ownerOf(0)).to.equal(mybank.address);
  });

  it('contract bank understands who is owner internally', async function () {
    expect(await mybank.ownerOf(myNFT.address, 0)).to.equal(owner);
  });

  it('original owner is owner in bank', async function () {
    expect(await mybank.ownerOf(myNFT.address, 0)).to.equal(owner);
  });

  it('Should not be able to transfer token that was deposited to bank safely with recoverNonSafeTransferredERC721', async function () {
    expectRevert(
      mybank.recoverNonSafeTransferredERC721(myNFT.address, 0, owner, { from: owner }),
      'token is owned'
    );
  });

  it('should be able to transfer from bank to original contract', async function () {
    await mybank.safeTransferFrom(myNFT.address, owner, owner, 0, '0x0a', { from: owner }),
    expect(await myNFT.ownerOf(0)).to.equal(owner);
  });

  it('original owner is owner', async function () {
    expect(await myNFT.ownerOf(0)).to.equal(owner);
  });

  it('original owner is not owner after he has transferred it', async function () {
    expectRevert(
        mybank.ownerOf(myNFT.address, 0),
        "ERC721: owner query for nonexistent token",
    );
  });

  it('deployer is owner, mintToken', async function () {
    await myNFT.mintToken(owner, 1) 
    expect(await myNFT.ownerOf(1)).to.equal(owner);
  });

  it('should be able to transfer token to bank unsafely', async function () {
    await myNFT.transferFrom(owner, mybank.address, 1,{ from: owner }) 
    expect(await myNFT.ownerOf(1)).to.equal(mybank.address);
  });

  it('contract bank is owner', async function () {
    expect(await myNFT.ownerOf(1)).to.equal(mybank.address);
  });

  it('contract bank misunderstands who is owner internally', async function () {
    expectRevert(
      mybank.ownerOf(myNFT.address, 1),
      "ERC721: owner query for nonexistent token"
    );
  });

  it('Should be able to transfer token that was deposited to bank unsafely', async function () {
    await mybank.recoverNonSafeTransferredERC721(myNFT.address, 1, owner, { from: owner }),
    expect(await myNFT.ownerOf(1)).to.equal(owner);
  });    
});