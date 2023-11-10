// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Multisig {
    function recover(
        bytes32 hash,
        bytes memory signature
    ) public pure returns (address) {
        return ECDSA.recover(hash, signature);
    }
}
