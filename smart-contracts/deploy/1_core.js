module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    const router = await deploy('Router', {
      from: deployer,
      log: true,
    });
    console.log("Router: ",router.address);
      
  };

  module.exports.tags = ['Core'];