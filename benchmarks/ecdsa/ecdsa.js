const hre = require("hardhat");
const { expect } = require("chai");

describe("ECDSA", function () {
    let wallets;
    let multisig;
    // const msg = "Hello, World";
    const msgs = Array.from({ length: 100 }, () => Math.random().toString(36).substring(2, 12));

    async function set() {
        const Multisig = await hre.ethers.getContractFactory("Multisig");
        multisig = await Multisig.deploy();

        wallets = await hre.ethers.getSigners();
    }

    describe("Test", function () {
        it("Multisig_100", async function () {
            await set();

            for (let round = 0; round < 100; round++) {
                // Sign

                let signs = [];

                for (let i = 0; i < 4; i++) {
                    signs.push(await wallets[i].signMessage(msgs[round]));
                }

                // Contract

                const digest = hre.ethers.utils.hashMessage(msgs[round]);

                const res = await multisig.connect(wallets[0]).multisigMofN(
                    digest,
                    signs,
                    wallets.slice(0, 4).map((wallet) => { return wallet.address; }),
                    4
                );
                expect(res).true;

                const txRes = await multisig.connect(wallets[0]).multisig(
                    digest,
                    signs,
                    wallets.slice(0, 4).map((wallet) => { return wallet.address; }),
                    4
                );
                await txRes.wait();
            }
        });
        it("Opt_Multisig_100", async function () {
            await set();

            for (let round = 0; round < 100; round++) {
                // Sign

                let signs = [];

                for (let i = 0; i < 4; i++) {
                    signs.push(await wallets[i].signMessage(msgs[round]));
                }

                // Contract

                const digest = hre.ethers.utils.hashMessage(msgs[round]);

                const res = await multisig.connect(wallets[0]).optMultisigMofN(
                    digest,
                    signs,
                    wallets.slice(0, 4).map((wallet) => { return wallet.address; }),
                    4
                );
                expect(res).to.equal(4);

                const txRes = await multisig.connect(wallets[0]).optMultisig(
                    digest,
                    signs,
                    wallets.slice(0, 4).map((wallet) => { return wallet.address; }),
                    4
                );
                await txRes.wait();
            }
        });
        it("Opt_Multisig_Fail", async function () {
            await set();

            // Sign

            // const msg = "Hello, World";
            const msg = Math.random().toString(36).substring(2, 12);
            let signs = [];

            for (let i = 0; i < 4; i++) {
                let signMsg = (await wallets[i].signMessage(msg));
                signs.push(signMsg);
            }

            // Contract

            let digest = hre.ethers.utils.hashMessage(msg);
            digest = digest.substring(0, 2) + "c0ffee" + digest.substring(8);

            const res = await multisig.connect(wallets[0]).optMultisigMofN(
                digest,
                signs,
                wallets.slice(0, 4).map((wallet) => { return wallet.address; }),
                4
            );
            expect(res).to.equal(0);
        });
    });
});
