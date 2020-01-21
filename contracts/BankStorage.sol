pragma solidity ^0.5.12;

contract BankStorage {
    /* WARNING: NEVER RE-ORDER VARIABLES! Always double-check that new variables are added APPEND-ONLY. Re-ordering variables can permanently BREAK your deployed proxy contract.*/
    mapping(bytes4 => bool) private _supportedInterfaces;
    mapping(address => mapping(uint256 => address)) public escrowBalance;
    // smart contract where the NFT is stored, and who deposited it
    mapping(address => mapping(uint256 => address)) public _tokenOwner;
    mapping(address => mapping(uint256 => address)) public escrowExpiration;
}
