//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MemeNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter _tokenId;
    
    constructor () ERC721("CropNFT" , "CNFT") {}
    
    struct Item {
        uint256 id;
        address creator;
        string uri;
    }
    
    mapping (uint256 => Item) public Items;
    
    function createItem (string memory _uri) public returns(uint256){
        _tokenId.increment();
        uint256 newItemId = _tokenId.current();
        _safeMint(msg.sender, newItemId);
        
        Items[newItemId] = Item(newItemId ,msg.sender , _uri);
        
        
        return newItemId;
        
    }
    
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return Items[tokenId].uri;
    }
    
}