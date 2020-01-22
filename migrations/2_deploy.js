const Proxy = artifacts.require('Proxy');
const Rocket = artifacts.require('Rocket');
const NFToken = artifacts.require('NFToken');

module.exports = async deployer => {
  deployer.deploy(NFToken);
  await deployer.deploy(Rocket);
  const rocketLogic = await Rocket.deployed();
  // const rocketConstructCode = await rocketLogic.contract.methods
  //   .initialize('Rocket')
  //   .encodeABI();
  // deployer.deploy(Proxy); //, rocketConstructCode, rocketLogic.contract.address);
  // const proxy = await Proxy.deployed();
  // console.log(proxy.contract.address);
};
