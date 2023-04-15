module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const plgn_swap_superfluid = await deploy('Plgn_payment_superfluid', {
      from: deployer,
      log: true,
    });
    console.log("PLGN Swap Superfluid: ",plgn_swap_superfluid.address);
  
  };

  module.exports.tags = ['Superfluid'];