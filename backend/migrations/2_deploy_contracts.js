var BottleCoin = artifacts.require("./BottleCoin.sol");

module.exports = function(deployer) {
  deployer.deploy(BottleCoin, 1000000000000000); // 0.001 ETH per token in Wei
};
