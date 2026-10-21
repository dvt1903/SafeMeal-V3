// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SafeMealAnchor
 * @notice Minimal Ethereum Sepolia teaching contract. It anchors a digest for one
 * lot exactly once. It DOES NOT certify food safety or independently inspect food.
 * Only the deployer's wallet can anchor; each organization signature and a
 * registry-based governance system must be added before real deployment.
 */
contract SafeMealAnchor {
    address public immutable owner;
    mapping(bytes32 => bytes32) public anchoredRoot;
    mapping(bytes32 => address) public anchoredBy;
    event InspectionAnchored(bytes32 indexed lotHash, bytes32 indexed root, address indexed signer, uint256 timestamp);

    constructor() { owner = msg.sender; }

    function anchor(bytes32 lotHash, bytes32 root) external {
        require(msg.sender == owner, "Only contract owner");
        require(lotHash != bytes32(0) && root != bytes32(0), "Empty hash");
        require(anchoredRoot[lotHash] == bytes32(0), "Lot already anchored");
        anchoredRoot[lotHash] = root;
        anchoredBy[lotHash] = msg.sender;
        emit InspectionAnchored(lotHash, root, msg.sender, block.timestamp);
    }

    function verify(bytes32 lotHash, bytes32 root) external view returns (bool) {
        return anchoredRoot[lotHash] != bytes32(0) && anchoredRoot[lotHash] == root;
    }
}
