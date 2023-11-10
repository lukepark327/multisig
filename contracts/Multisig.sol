// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Multisig {
    function recover(
        bytes32 digest,
        bytes memory signature
    ) public pure returns (address) {
        return ECDSA.recover(digest, signature);
    }

    // uint256 N
    function multisigMofN(
        bytes32 digest,
        bytes[] calldata signatures,
        address[] calldata signers,
        uint256 M
    ) public pure returns (bool) {
        // require(M <= N, "Multisig::multisigMofN: Invalid M or N.");
        uint256 len = signatures.length;
        require(
            len >= M,
            "Multisig::multisigMofN: Invalid length of signatures."
        );
        require(
            len == signers.length,
            "Multisig::multisigMofN: Invalid length of signatures or signers."
        );

        uint256 wins;
        for (uint256 i = 0; i < len; ) {
            // TODO(@lukepark327): skip array range check.

            (address signer, ECDSA.RecoverError err, ) = ECDSA.tryRecover(
                digest,
                signatures[i]
            );
            if (signer == signers[i] && err == ECDSA.RecoverError.NoError) {
                ++wins;
            }

            unchecked {
                ++i;
            }
        }

        return wins >= M;
    }
}
