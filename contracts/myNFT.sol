// SPDX-License-Identifier: MIT 
pragma solidity 0.8.14;

import "./OpenZeppelin/NFT/ERC721URIStorage.sol";
import "./OpenZeppelin/Utils/Counters.sol";
import "./OpenZeppelin/Access/Ownable.sol";

contract myNFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    Counters.Counter internal _tokenIds;
    address contractAddress;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {
        _owner=_msgSender();
    }

    function mint(string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function burn(uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
    }
}
