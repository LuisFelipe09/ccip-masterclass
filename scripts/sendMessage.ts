// scripts/sendMessage.ts

import { ethers, network } from "hardhat";

async function main() {
  if(network.name !== `avalancheFuji`) {
    console.error(`❌ Must be called from Avalanche Fuji`);
    return 1;
  }

  const ccipSenderAddress = `0xA6403f4F3051ed80640380F00fB606225965F1a7`;
  const ccipReceiverAddress = `0x1582702fDBf5dBbA4191D3dA70f6681f9AcC6E22`;
  const someText = `CCIP Masterclass`;
  const destinationChainSelector = ethers.BigNumber.from("16015286601757825753");

  const ccipSenderFactory = await ethers.getContractFactory( "CCIPSender_Unsafe");
  const ccipSender =  ccipSenderFactory.attach(ccipSenderAddress)
  ccipSender.connect(ethers.provider);
  //const ccipSender = await ccipSenderFactory.connect(ccipSenderAddress, ethers.provider);

  const tx = await ccipSender.send(
      ccipReceiverAddress, 
      someText,
      destinationChainSelector, 
      {gasLimit: 200000}
  );

  console.log(`Transaction hash: ${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
