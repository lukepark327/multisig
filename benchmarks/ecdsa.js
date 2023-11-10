const hre = require("hardhat");
const { expect } = require("chai");

describe("ECDSA", function () {
    let wallets;
    let multisig;

    async function set() {
        multisig = await hre.ethers.deployContract("Multisig", []);
        await multisig.waitForDeployment();
        // console.log(
        //     `Multisig: ${await multisig.getAddress()}`
        // );

        wallets = await hre.ethers.getSigners();
        // console.log(`Signer 0: ${wallets[0].address}`);
        // console.log(`Signer 1: ${wallets[1].address}`);
        // console.log(`Signer 2: ${wallets[2].address}`);
        // console.log(`Signer 3: ${wallets[3].address}`);
    }

    describe("Test", function () {
        it("Multisig_100", async function () {
            await set();

            for (let round = 0; round < 100; round++) {
                // Sign

                // const msg = "Hello, World";
                const msg = Math.random().toString(36).substring(2, 12);;
                let signs = [];

                for (let i = 0; i < 4; i++) {
                    signs.push(await wallets[i].signMessage(msg));
                    //     console.log(
                    //       `- Message: "${msg}"
                    // - Sign: ${sign}`
                    //     );
                }
                // for (let i = 0; i < 4; i++) {
                //     const verified = hre.ethers.verifyMessage(msg, signs[i]);
                //     console.log(`Verified: ${verified}`);
                // }

                // Contract

                const digest = hre.ethers.hashMessage(msg);
                const txRes = await multisig.connect(wallets[0]).multisig(
                    digest,
                    signs,
                    wallets.slice(0, 4).map((wallet) => { return wallet.address; }),
                    4
                );
                await txRes.wait();
                // expect(res).true;
            }
        });
    });
});
