require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-foundry");
require('hardhat-deploy');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

const pkey = "0ba6a014abf9f887bd1cb9c268df16e15cba6b91cc535be4970db489c5378168";    //nice try silly. Not real. This is a hackathon project :p
const forkingAccounts = [
  {
    privateKey: pkey,
    balance: `100${"0".repeat(18)}`,
  }
];

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.19",
  networks:{
    maticTest: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/aCvV1nhZVqfb5aVk9Wju6d8WEtV8j33c`,
      chainId: 80001,
      accounts: [pkey]
    },  
    hardhat: {
      accounts: forkingAccounts,
      forking: {
        url: `https://polygon-mainnet.g.alchemy.com/v2/iQn6fZKGOVV0MFqU45Grq9KV6TaeblWr`,
        enabled: true,
        timeout: 0,
      },
    },  
  },
  etherscan: {
    apiKey: "4Y42Z4WA94GHR6M5279Y64HYI5SMJGPJ88"
  },
  namedAccounts: {
    deployer: 0
  }

};
