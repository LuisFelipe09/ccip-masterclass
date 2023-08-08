// scripts/transferTokens.ts

import { ethers, network } from "hardhat";

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Must be called from Avalanche Fuji`);
    return 1;
  }

  const ccipSenderAddress = '0x048e557f8a7325092C32Aec47D921a363bEE67A2';
  const receiver = `0x38aC3a3d17e38b7B4fFc07c28Ad6f3aECeD5A4d8`;
  const ccipBnMAddress = `0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4`;
  const amount = 100n;
  const destinationChainSelector = ethers.BigNumber.from('16015286601757825753');

  const ccipTokenSenderFactory = await ethers.getContractFactory("CCIPTokenAndDataSender");
  const ccipTokenSender =  ccipTokenSenderFactory.attach(ccipSenderAddress)
  ccipTokenSender.connect(ethers.provider);
 // const ccipTokenSender = await ccipTokenSenderFactory.connect(ccipSenderAddress, ethers.provider);


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
