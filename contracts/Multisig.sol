// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// import "hardhat/console.sol";

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
            (address signer, ECDSA.RecoverError err, ) = ECDSA.tryRecover(
                digest,
                signatures[i]
            );
            if (signer == signers[i] && err == ECDSA.RecoverError.NoError) {
                ++wins;
                if (wins >= M) {
                    return true;
                }
            }

            unchecked {
                ++i;
            }
        }

        return wins >= M;
    }

    // test purpose
    function multisig(
        bytes32 digest,
        bytes[] calldata signatures,
        address[] calldata signers,
        uint256 M
    ) external returns (bool) {
        return multisigMofN(digest, signatures, signers, M);
    }

    // TODO(@lukepark327): bytes and address array => bytes (multiply of multiple length)
    // uint256 N
    function optMultisigMofN(
        bytes32 digest,
        bytes[] calldata signatures,
        address[] calldata signers,
        uint256 M
    ) public pure returns (uint256 wins) {
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

        for (uint256 i = 0; i < len; ) {
            // skip array range check.
            address _signer;
            // bytes memory _signature;
            assembly {
                _signer := calldataload(add(signers.offset, mul(i, 0x20)))
            }

            (address signer, ECDSA.RecoverError err, ) = ECDSA.tryRecover(
                digest,
                signatures[i]
            );
            if (signer == _signer && err == ECDSA.RecoverError.NoError) {
                if (++wins >= M) {
                    return wins;
                }
            }

            unchecked {
                ++i;
            }
        }
    }

    // test purpose
    function optMultisig(
        bytes32 digest,
        bytes[] calldata signatures,
        address[] calldata signers,
        uint256 M
    ) external returns (bool) {
        return multisigMofN(digest, signatures, signers, M);
    }
}
