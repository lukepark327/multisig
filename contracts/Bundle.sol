// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.6.10;

import "../evmbls/contracts/BLS.sol";

// TODO(@lukepark327): add multisig
// TODO(@lukepark327): migrate 0.8
contract Bundle is BLS {
    function verifyBundle(
        uint256[2] memory signature,
        uint256[4][] memory pubkeys,
        uint256[2][] memory messages
    ) external view returns (bool) {
        return verifyMultiple(signature, pubkeys, messages);
    }
    
    // test purpose
    function verifyMultipleTest(
        uint256[2] memory signature,
        uint256[4][] memory pubkeys,
        uint256[2][] memory messages
    ) external returns (bool) {
        return verifyMultiple(signature, pubkeys, messages);
    }
}
