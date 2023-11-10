const hre = require("hardhat");

async function main() {
  const multisig = await hre.ethers.deployContract("Multisig", []);
  await multisig.waitForDeployment();
  console.log(
    `Multisig: ${await multisig.getAddress()}`
  );

  // Sign

  const [wallet] = await hre.ethers.getSigners();
  console.log(`Signer: ${wallet.address}`);

  const msg = "Hello, World";
  const sign = await wallet.signMessage(msg);
  console.log(
    `- Message: "${msg}"
- Sign: ${sign}`
  );

  const verified = hre.ethers.verifyMessage(msg, sign);
  console.log(`Verified: ${verified}`);

  // Contract

  const digest = hre.ethers.hashMessage(msg);
  const res = await multisig.connect(wallet).recover(
    digest,
    sign
  );
  console.log(`Res: ${res}`);

  console.log(`Success: ${wallet.address == verified && wallet.address == res}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
