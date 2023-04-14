module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    const plgn_swap_uniswap = await deploy('Plgn_swap_uniswap', {
      from: deployer,
      args: ['0xE592427A0AEce92De3Edee1F18E0157C05861564'],
      log: true,
    });
    console.log("PLGN Swap Uniswap: ",plgn_swap_uniswap.address);
  
  };

  module.exports.tags = ['Uni'];