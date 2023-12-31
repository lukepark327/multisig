const hre = require("hardhat"); // v5

async function main() {
  const Multisig = await hre.ethers.getContractFactory("Multisig");
  const multisig = await Multisig.deploy();
  console.log(
    `Multisig: ${await multisig.address}`
  );

  // Sign

  const wallets = await hre.ethers.getSigners();
  console.log(`Signer 0: ${wallets[0].address}`);
  console.log(`Signer 1: ${wallets[1].address}`);
  console.log(`Signer 2: ${wallets[2].address}`);
  console.log(`Signer 3: ${wallets[3].address}`);

  // const msg = "Hello, World";
  const msg = Math.random().toString(36).substring(2, 12);
  let signs = [];

  for (let i = 0; i < 4; i++) {
    signs.push(await wallets[i].signMessage(msg));
    console.log(`- Sign: ${signs[i]}`);
  }
  for (let i = 0; i < 4; i++) {
    const verified = hre.ethers.utils.verifyMessage(msg, signs[i]);
    console.log(`Verified: ${verified}`);
  }

  // Contract

  const digest = hre.ethers.utils.hashMessage(msg);
  const res = await multisig.connect(wallets[0]).multisigMofN(
    digest,
    signs,
    wallets.slice(0, 4).map((wallet) => { return wallet.address; }),
    4
  );
  console.log(`Res: ${res}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
