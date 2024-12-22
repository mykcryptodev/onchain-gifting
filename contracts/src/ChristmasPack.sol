//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC165.sol";

contract ChristmasPack is ERC721, ERC1155Holder, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // Custom errors
    error EmptyPack();
    error NotPackOwner();
    error PackAlreadyOpened();

    // Struct to represent an ERC20 token asset
    struct ERC20Asset {
        address token;
        uint256 amount;
    }

    // Struct to represent an ERC721 token asset
    struct ERC721Asset {
        address token;
        uint256 tokenId;
    }

    // Struct to represent an ERC1155 token asset
    struct ERC1155Asset {
        address token;
        uint256 tokenId;
        uint256 amount;
    }

    // Struct to store all assets in a pack
    struct Pack {
        ERC20Asset[] erc20Assets;
        ERC721Asset[] erc721Assets;
        ERC1155Asset[] erc1155Assets;
        bool isOpened;
    }

    // Mapping from pack ID to Pack struct
    mapping(uint256 => Pack) public packs;
    
    // Counter for pack IDs
    uint256 private _nextPackId;

    // Events
    event PackCreated(
        address indexed creator,
        uint256 indexed packId,
        uint256 erc20Count,
        uint256 erc721Count,
        uint256 erc1155Count
    );
    event PackOpened(uint256 indexed packId, address indexed opener);

    constructor() ERC721("Christmas Pack", "XPACK") Ownable(msg.sender) {}

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC1155Holder)
        returns (bool)
    {
        return ERC721.supportsInterface(interfaceId) || ERC1155Holder.supportsInterface(interfaceId);
    }

    /**
     * @dev Creates a new pack containing the specified assets
     * @param erc20Assets Array of ERC20 assets to include
     * @param erc721Assets Array of ERC721 assets to include
     * @param erc1155Assets Array of ERC1155 assets to include
     * @return packId The ID of the newly created pack
     */
    function createPack(
        ERC20Asset[] calldata erc20Assets,
        ERC721Asset[] calldata erc721Assets,
        ERC1155Asset[] calldata erc1155Assets
    ) external nonReentrant returns (uint256 packId) {
        if (erc20Assets.length == 0 && erc721Assets.length == 0 && erc1155Assets.length == 0) {
            revert EmptyPack();
        }

        packId = _nextPackId++;
        Pack storage newPack = packs[packId];

        // Transfer ERC20 tokens
        for (uint i = 0; i < erc20Assets.length; i++) {
            IERC20(erc20Assets[i].token).safeTransferFrom(
                msg.sender,
                address(this),
                erc20Assets[i].amount
            );
            newPack.erc20Assets.push(erc20Assets[i]);
        }

        // Transfer ERC721 tokens
        for (uint i = 0; i < erc721Assets.length; i++) {
            IERC721(erc721Assets[i].token).transferFrom(
                msg.sender,
                address(this),
                erc721Assets[i].tokenId
            );
            newPack.erc721Assets.push(erc721Assets[i]);
        }

        // Transfer ERC1155 tokens
        for (uint i = 0; i < erc1155Assets.length; i++) {
            IERC1155(erc1155Assets[i].token).safeTransferFrom(
                msg.sender,
                address(this),
                erc1155Assets[i].tokenId,
                erc1155Assets[i].amount,
                ""
            );
            newPack.erc1155Assets.push(erc1155Assets[i]);
        }

        _mint(this.owner(), packId);
        emit PackCreated(
            msg.sender,
            packId,
            erc20Assets.length,
            erc721Assets.length,
            erc1155Assets.length
        );

        return packId;
    }

    /**
     * @dev Opens a pack and transfers all assets to the opener
     * @param packId The ID of the pack to open
     */
    function openPack(uint256 packId) external nonReentrant{
        if (ownerOf(packId) != msg.sender) {
            revert NotPackOwner();
        }
        if (packs[packId].isOpened) {
            revert PackAlreadyOpened();
        }

        Pack storage pack = packs[packId];
        pack.isOpened = true;

        // Transfer ERC20 tokens
        for (uint i = 0; i < pack.erc20Assets.length; i++) {
            IERC20(pack.erc20Assets[i].token).safeTransfer(
                msg.sender,
                pack.erc20Assets[i].amount
            );
        }

        // Transfer ERC721 tokens
        for (uint i = 0; i < pack.erc721Assets.length; i++) {
            IERC721(pack.erc721Assets[i].token).transferFrom(
                address(this),
                msg.sender,
                pack.erc721Assets[i].tokenId
            );
        }

        // Transfer ERC1155 tokens
        for (uint i = 0; i < pack.erc1155Assets.length; i++) {
            IERC1155(pack.erc1155Assets[i].token).safeTransferFrom(
                address(this),
                msg.sender,
                pack.erc1155Assets[i].tokenId,
                pack.erc1155Assets[i].amount,
                ""
            );
        }

        _burn(packId);
        emit PackOpened(packId, msg.sender);
    }

    /**
     * @dev Returns the contents of a pack
     * @param packId The ID of the pack to query
     */
    function getPackContents(uint256 packId) external view returns (
        ERC20Asset[] memory erc20Assets,
        ERC721Asset[] memory erc721Assets,
        ERC1155Asset[] memory erc1155Assets,
        bool isOpened
    ) {
        Pack storage pack = packs[packId];
        return (
            pack.erc20Assets,
            pack.erc721Assets,
            pack.erc1155Assets,
            pack.isOpened
        );
    }
} 
