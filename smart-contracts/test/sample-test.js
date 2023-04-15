const { account } = require("@brinkninja/sdk");
const { expect } = require("chai");
const { ethers, network } = require("hardhat");

let router;
let plugin;
let inToken, outToken;
let acc; 

const sampleTX = [
        {
            smartContract: "",
            in_token: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
            in_am: "5000000000000000",
            out_token: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
            min_out_am: "0",
            receiver: "0xAEB478F060B582d3E8d752bcb3430B59FAe4cAF3",
            data: "0x"
        }
      ]
describe("Web4", function () {

  before(async()=>{
    
    acc = await ethers.getImpersonatedSigner("0x62ac55b745f9b08f1a81dcbbe630277095cf4be1");
    const Router = await ethers.getContractFactory("Router");
    router = await Router.deploy();

    const uniPLGN = await ethers.getContractFactory("Plgn_swap_uniswap");
    plugin = await uniPLGN.deploy("0xE592427A0AEce92De3Edee1F18E0157C05861564");
    sampleTX[0].smartContract = plugin.address;
    inToken = await ethers.getContractAt("IERC20", "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619");
    outToken = await ethers.getContractAt("IERC20", "0xb33EaAd8d922B1083446DC23f610c2567fB5180f");
  });

  it("Should accept a swap transaction", async function () {
    const inTokenBalBefore = await inToken.balanceOf(acc.address);
    const outTokenBalBefore = await outToken.balanceOf(sampleTX[0].receiver);
    console.log(inTokenBalBefore);
    console.log(outTokenBalBefore);

    await inToken.connect(acc).approve(router.address, sampleTX[0].in_am);

    await router.connect(acc).executeTransactions(sampleTX);

    const inTokenBalAfter = await inToken.balanceOf(acc.address);
    const outTokenBalAfter = await outToken.balanceOf(sampleTX[0].receiver);
    console.log(inTokenBalAfter);
    console.log(outTokenBalAfter)


  });
});
