const hre = require("hardhat");
const { expect } = require("chai");

const mcl = require("../../scripts/bls/mcl");

describe("BLS", function () {
    let wallets;
    let bundle;
    // const msg = "Hello, World";
    const msgs = Array.from({ length: 100 }, () => Math.random().toString(36).substring(2, 12));
    const digests = msgs.map((msg) => { return hre.ethers.utils.hashMessage(msg); });

    async function set() {
        const Bundle = await hre.ethers.getContractFactory("Bundle");
        bundle = await Bundle.deploy();

        wallets = await hre.ethers.getSigners();

        DOMAIN_STR = 'testing-evmbls';
        await mcl.init();
        mcl.setDomain(DOMAIN_STR);
        mcl.setMappingMode(mcl.MAPPING_MODE_TI);
        mcl.setDomain('testing evmbls');
    }

    describe("Test", function () {
        it("BLS_100", async function () {
            await set();

            for (let round = 0; round < 100; round++) {
                // Sign

                let messages = [];
                const pubkeys = [];
                let aggSignature = mcl.newG1();
                for (let i = 0; i < 4; i++) {
                    // const { pubkey, secret } = mcl.newKeyPair();
                    const strSecret = "0".repeat(64 - Math.floor(i / 10) - 1) + i.toString(); // use pre-existed secret (via `pubkeyFromSecret(secret)`)
                    const { pubkey, secret } = mcl.pubkeyFromSecret(strSecret);
                    const { signature, M } = mcl.sign(digests[round], secret);
                    aggSignature = mcl.aggreagate(aggSignature, signature);
                    messages.push(M);
                    pubkeys.push(pubkey);
                }

                let messages_ser = messages.map((p) => mcl.g1ToBN(p));
                let pubkeys_ser = pubkeys.map((p) => mcl.g2ToBN(p));
                let sig_ser = mcl.g1ToBN(aggSignature);

                // Contract

                const res = await bundle.connect(wallets[4]).verifyBundle(
                    sig_ser,
                    pubkeys_ser,
                    messages_ser
                );
                expect(res).true;

                const txRes = await bundle.connect(wallets[4]).verifyMultipleTest(
                    sig_ser,
                    pubkeys_ser,
                    messages_ser
                );
                await txRes.wait();
            }
        });
        it("BLS_Fail", async function () {
            await set();

            // Sign

            // const msg = "Hello, World";
            const msg = Math.random().toString(36).substring(2, 12);
            let digest = hre.ethers.utils.hashMessage(msg);

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

            // Spoiling
            sig_ser[0] = sig_ser[0].add(1);

            // Contract

            try {
                const res = await bundle.connect(wallets[0]).verifyBundle(
                    sig_ser,
                    pubkeys_ser,
                    messages_ser
                );
                expect(res).to.equal(0);
            } catch {
                return true;
            }
        });
    });
});
