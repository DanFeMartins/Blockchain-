var Healthchain = artifacts.require("Healthchain");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    await deployer.deploy(Healthchain);
  });
};
