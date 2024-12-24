//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract GiftPack is ERC721, ERC1155Holder, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using Strings for uint256;

    error InvalidTokenAmount();
    error InvalidTokenAddress();
    error InvalidRecipient();
    error PackAlreadyOpened();
    error NotPackOwner();
    error TransferFailed();
    error HashAlreadyUsed();
    error HashNotFound();
    error TokenNotMinted();

    string private _baseTokenURI;

    struct ERC20Token {
        address tokenAddress;
        uint256 amount;
    }

    struct ERC721Token {
        address tokenAddress;
        uint256 tokenId;
    }

    struct ERC1155Token {
        address tokenAddress;
        uint256 tokenId;
        uint256 amount;
    }

    struct Pack {
        address creator;
        ERC20Token[] erc20Tokens;
        ERC721Token[] erc721Tokens;
        ERC1155Token[] erc1155Tokens;
        bool opened;
        uint256 ethAmount;
    }

    uint256 private _nextTokenId;
    mapping(uint256 => Pack) public packs;

    mapping(bytes32 => uint256) private tokenIdByHash;
    mapping(bytes32 => bool) private hashUsed;

    event PackCreated(
        uint256 indexed tokenId, 
        address indexed creator, 
        ERC20Token[] erc20Tokens, 
        ERC721Token[] erc721Tokens,
        ERC1155Token[] erc1155Tokens,
        uint256 ethAmount
    );
    event PackOpened(uint256 indexed tokenId, address indexed opener);

    constructor() ERC721("GiftPack", "GIFT") Ownable(msg.sender) {}

    function createPack(
        ERC20Token[] calldata erc20Tokens,
        ERC721Token[] calldata erc721Tokens,
        ERC1155Token[] calldata erc1155Tokens,
        bytes32 hash
    ) external payable returns (uint256) {
        // if there is already a pack with this hash, revert
        if (hashUsed[hash]) revert HashAlreadyUsed();

        uint256 tokenId = _nextTokenId++;

        // store the hash to tokenId mapping
        tokenIdByHash[hash] = tokenId;
        hashUsed[hash] = true;

        // Validate and transfer tokens
        for (uint256 i = 0; i < erc20Tokens.length; i++) {
            ERC20Token memory token = erc20Tokens[i];
            if (token.amount == 0) revert InvalidTokenAmount();
            if (token.tokenAddress == address(0)) revert InvalidTokenAddress();

            IERC20(token.tokenAddress).safeTransferFrom(msg.sender, address(this), token.amount);
        }

        // Validate and transfer ERC721 tokens
        for (uint256 i = 0; i < erc721Tokens.length; i++) {
            ERC721Token memory token = erc721Tokens[i];
            if (token.tokenAddress == address(0)) revert InvalidTokenAddress();

            IERC721(token.tokenAddress).transferFrom(msg.sender, address(this), token.tokenId);
        }

        // Validate and transfer ERC1155 tokens
        for (uint256 i = 0; i < erc1155Tokens.length; i++) {
            ERC1155Token memory token = erc1155Tokens[i];
            if (token.amount == 0) revert InvalidTokenAmount();
            if (token.tokenAddress == address(0)) revert InvalidTokenAddress();

            IERC1155(token.tokenAddress).safeTransferFrom(
                msg.sender,
                address(this),
                token.tokenId,
                token.amount,
                ""
            );
        }

        // Store pack data
        Pack storage newPack = packs[tokenId];
        newPack.creator = msg.sender;
        newPack.opened = false;
        newPack.ethAmount = msg.value;

        // Copy arrays
        for (uint256 i = 0; i < erc20Tokens.length; i++) {
            newPack.erc20Tokens.push(erc20Tokens[i]);
        }
        for (uint256 i = 0; i < erc721Tokens.length; i++) {
            newPack.erc721Tokens.push(erc721Tokens[i]);
        }
        for (uint256 i = 0; i < erc1155Tokens.length; i++) {
            newPack.erc1155Tokens.push(erc1155Tokens[i]);
        }

        _safeMint(msg.sender, tokenId);

        emit PackCreated(tokenId, msg.sender, erc20Tokens, erc721Tokens, erc1155Tokens, msg.value);
        return tokenId;
    }

    function openPackWithPassword(string calldata password, address recipient) external nonReentrant {
        bytes32 hash = keccak256(abi.encode(password));
        if (!hashUsed[hash]) revert HashNotFound();
        uint256 tokenId = tokenIdByHash[hash];

        _openPack(tokenId, recipient);
    }

    function openPackAsOwner(uint256 tokenId, address recipient) external nonReentrant {
        if (ownerOf(tokenId) != msg.sender) revert NotPackOwner();

        _openPack(tokenId, recipient);
    }

    function _openPack(uint256 tokenId, address recipient) internal {
        if (recipient == address(0)) revert InvalidRecipient();
        
        Pack storage pack = packs[tokenId];
        if (pack.opened) revert PackAlreadyOpened();

        pack.opened = true;

        // Transfer ERC20 tokens to recipient
        for (uint256 i = 0; i < pack.erc20Tokens.length; i++) {
            ERC20Token memory token = pack.erc20Tokens[i];
            IERC20(token.tokenAddress).safeTransfer(recipient, token.amount);
        }

        // Transfer ERC721 tokens to recipient
        for (uint256 i = 0; i < pack.erc721Tokens.length; i++) {
            ERC721Token memory token = pack.erc721Tokens[i];
            IERC721(token.tokenAddress).transferFrom(address(this), recipient, token.tokenId);
        }

        // Transfer ERC1155 tokens to recipient
        for (uint256 i = 0; i < pack.erc1155Tokens.length; i++) {
            ERC1155Token memory token = pack.erc1155Tokens[i];
            IERC1155(token.tokenAddress).safeTransferFrom(
                address(this),
                recipient,
                token.tokenId,
                token.amount,
                ""
            );
        }

        // Transfer ETH if any
        if (pack.ethAmount > 0) {
            (bool success, ) = recipient.call{value: pack.ethAmount}("");
            if (!success) revert TransferFailed();
        }

        emit PackOpened(tokenId, recipient);
    }

    function getPackERC20Tokens(uint256 tokenId) external view returns (ERC20Token[] memory) {
        return packs[tokenId].erc20Tokens;
    }

    function getPackERC721Tokens(uint256 tokenId) external view returns (ERC721Token[] memory) {
        return packs[tokenId].erc721Tokens;
    }

    function getPackERC1155Tokens(uint256 tokenId) external view returns (ERC1155Token[] memory) {
        return packs[tokenId].erc1155Tokens;
    }

    function getPackEthAmount(uint256 tokenId) external view returns (uint256) {
        return packs[tokenId].ethAmount;
    }

    function getPackCreator(uint256 tokenId) external view returns (address) {
        return packs[tokenId].creator;
    }

    function getPack(uint256 tokenId) external view returns (Pack memory) {
        return packs[tokenId];
    }

    function getPackByHash(bytes32 hash) external view returns (Pack memory) {
        if (!hashUsed[hash]) revert HashNotFound();
        uint256 tokenId = tokenIdByHash[hash];
        return packs[tokenId];
    }

    function isHashUsed(bytes32 hash) external view returns (bool) {
        return hashUsed[hash];
    }

    function isPackOpened(uint256 tokenId) external view returns (bool) {
        return packs[tokenId].opened;
    }

    /**
     * @dev Sets the base URI for token metadata
     * @param baseURI The new base URI
     */
    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev Returns the base URI for token metadata
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId The ID of the token
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (_nextTokenId <= tokenId) revert TokenNotMinted();

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC1155Holder)
        returns (bool)
    {
        return ERC721.supportsInterface(interfaceId) || 
               ERC1155Holder.supportsInterface(interfaceId);
    }

    receive() external payable {}
} 