// scripts/transferTokens.ts

import { ethers, network } from "hardhat";

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Must be called from Avalanche Fuji`);
    return 1;
  }

  const ccipSenderAddress = '0xfBE3320DEe3bAe6B90Ea18830930b3A34a02AAC9';
  const receiver = `0x152C6C12e242114b7618d11758dcC517926D74D2`;
  const ccipBnMAddress = `0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4`;
  const amount = 100n;
  const destinationChainSelector = ethers.BigNumber.from('16015286601757825753');

  const ccipTokenSenderFactory = await ethers.getContractFactory("CCIPTokenSender");
  const ccipTokenSender =  ccipTokenSenderFactory.attach(ccipSenderAddress)
  ccipTokenSender.connect(ethers.provider);
 // const ccipTokenSender = await ccipTokenSenderFactory.connect(ccipSenderAddress, ethers.provider);
  
  const whitelistTx = await ccipTokenSender.whitelistChain(
      destinationChainSelector
  );
  
  console.log(`Whitelisted Sepolia, transaction hash: ${whitelistTx.hash}`);

  const transferTx = await ccipTokenSender.transferTokens(
      destinationChainSelector, 
      receiver,
      ccipBnMAddress,
      amount,
      { gasLimit: 3000000 }
  );

  console.log(`Tokens sent, transaction hash: ${transferTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
