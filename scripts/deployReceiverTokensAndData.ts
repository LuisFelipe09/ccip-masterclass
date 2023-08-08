// scripts/deployReceiver.ts

import { ethers, network, run } from "hardhat";

async function main() {
  if(network.name !== `ethereumSepolia`) {
    console.error(`❌ Receiver must be deployed to Ethereum Sepolia`);
    return 1;
  }

  const sepoliaRouterAddress = `0xD0daae2231E9CB96b94C8512223533293C3693Bf`;
  const addressTokenAndDataSender = `0x048e557f8a7325092C32Aec47D921a363bEE67A2`;
  const amount = 100n;
  
  await run("compile");

  const ccipReceiverFactory = await ethers.getContractFactory("CCIPTokenAndDataReceiver");
  const ccipReceiver = await ccipReceiverFactory.deploy(sepoliaRouterAddress, amount);

  await ccipReceiver.deployed();

  console.log(`CCIPTokenAndDataReceiver deployed to ${ccipReceiver.address}`);

  await new Promise(f => setTimeout(f, 30000));

  const whitelistTx = await ccipReceiver.whitelistSourceChain(
      '14767482510784806043'
  );
  
  console.log(`Whitelisted Avalanche Fuji, transaction hash: ${whitelistTx.hash}`);

  await new Promise(f => setTimeout(f, 30000));

  const whitelistSenderTx = await ccipReceiver.whitelistSender(
    addressTokenAndDataSender
  );
  
  console.log(`Whitelisted Sender, transaction hash: ${whitelistTx.hash}`);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
