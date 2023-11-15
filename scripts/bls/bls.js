const hre = require("hardhat"); // v5

const mcl = require("./mcl");

async function main() {
  const Bundle = await hre.ethers.getContractFactory("Bundle");
  const bundle = await Bundle.deploy();
  console.log(
    `Bundle: ${bundle.address}`
  );

  DOMAIN_STR = 'testing-evmbls';
  await mcl.init();
  mcl.setDomain(DOMAIN_STR);
  mcl.setMappingMode(mcl.MAPPING_MODE_TI);
  mcl.setDomain('testing evmbls');

  // Sign

  const wallets = await hre.ethers.getSigners();
  console.log(`Signer 0: ${wallets[0].address}`);
  console.log(`Signer 1: ${wallets[1].address}`);
  console.log(`Signer 2: ${wallets[2].address}`);
  console.log(`Signer 3: ${wallets[3].address}`);

  // const msg = "Hello, World";
  const msg = Math.random().toString(36).substring(2, 12);
  const digest = hre.ethers.utils.hashMessage(msg);

  let messages = [];
  const pubkeys = [];
  let aggSignature = mcl.newG1();
  for (let i = 0; i < 4; i++) {
    // const { pubkey, secret } = mcl.newKeyPair();
    const strSecret = "0".repeat(64 - Math.floor(i / 10) - 1) + i.toString(); // use pre-existed secret (via `pubkeyFromSecret(secret)`)
    const { pubkey, secret } = mcl.pubkeyFromSecret(strSecret);
    const { signature, M } = mcl.sign(digest, secret);
    aggSignature = mcl.aggreagate(aggSignature, signature);
    messages.push(M);
    pubkeys.push(pubkey);
  }

  let messages_ser = messages.map((p) => mcl.g1ToBN(p));
  let pubkeys_ser = pubkeys.map((p) => mcl.g2ToBN(p));
  let sig_ser = mcl.g1ToBN(aggSignature);

  // Contract

  // console.log("sig_ser:", sig_ser);
  // console.log("pubkeys_ser:", pubkeys_ser);
  // console.log("messages_ser:", messages_ser);

  // Spoiling
  // sig_ser[0] = sig_ser[0].add(1);
  // console.log("sig_ser:", sig_ser);

  const res = await bundle.verifyBundle(
    sig_ser,
    pubkeys_ser,
    messages_ser
  );
  console.log(`Res: ${res}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
