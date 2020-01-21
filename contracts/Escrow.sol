pragma solidity ^0.5.12;

import {ERC165} from './erc165.sol';
import {RocketStorage} from './RocketStorage.sol';

contract Escrow is ERC165, RocketStorage {
    constructor() public {
        _registerInterface(_ERC721_RECEIVED);
    }

    bytes4 private constant _ERC721_RECEIVED = 0x150b7a02;

    /**
     * @dev Gets the owner of the specified token ID at specified smart contract address.
     * @param tokenId uint256 ID of the token to query the owner of
     * @param contractAddress address of the smart contract to query the owner of given token
     * @return address currently marked as the owner of the given token ID
     */
    function ownerOf(address contractAddress, uint256 tokenId)
        public
        view
        returns (address)
    {
        address owner = _tokenOwner[contractAddress][tokenId];
        require(
            owner != address(0),
            'ERC721: owner query for nonexistent token'
        );

        return owner;
    }

    mapping(address => mapping(uint256 => address)) public escrowExpiration;

    /**
    * @dev When someone sends us a token record it so that we have an internal record of who owns what
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        _tokenOwner[msg.sender][tokenId] = from;
        return _ERC721_RECEIVED;
    }
}
