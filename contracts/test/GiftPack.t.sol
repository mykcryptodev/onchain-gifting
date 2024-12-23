//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/GiftPack.sol";
import "../src/mocks/MockERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BadERC20 {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        if (balanceOf[msg.sender] < amount) return false;
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (balanceOf[from] < amount || allowance[from][msg.sender] < amount) return false;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
}

contract MockERC721 is ERC721 {
    uint256 private _tokenIdCounter;

    constructor() ERC721("Mock NFT", "MNFT") {}

    function mint(address to) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _mint(to, tokenId);
        return tokenId;
    }
}

contract MockERC1155 is ERC1155 {
    constructor() ERC1155("https://token-cdn-domain/{id}.json") {}

    function mint(address to, uint256 id, uint256 amount) external {
        _mint(to, id, amount, "");
    }
}

contract GiftPackTest is Test {
    GiftPack public pack;
    MockERC20 public token1;
    MockERC20 public token2;
    MockERC721 public erc721;
    MockERC1155 public erc1155;
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

    function setUp() public {
        pack = new GiftPack();
        token1 = new MockERC20("Token1", "TK1");
        token2 = new MockERC20("Token2", "TK2");
        erc721 = new MockERC721();
        erc1155 = new MockERC1155();

        // Give tokens to alice
        token1.mint(alice, 1000);
        token2.mint(alice, 1000);
        uint256 nftId = erc721.mint(alice);
        erc1155.mint(alice, 1, 10);

        // Give ETH to alice
        vm.deal(alice, 10 ether);
    }

    function test_CreatePackWithTokens() public {
        vm.startPrank(alice);

        // Approve tokens
        token1.approve(address(pack), 100);
        token2.approve(address(pack), 200);

        // Create pack with tokens
        GiftPack.ERC20Token[] memory tokens = new GiftPack.ERC20Token[](2);
        tokens[0] = GiftPack.ERC20Token(address(token1), 100);
        tokens[1] = GiftPack.ERC20Token(address(token2), 200);

        uint256 tokenId = pack.createPack(
            tokens,
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0)
        );

        // Verify pack creation
        assertEq(pack.ownerOf(tokenId), alice);
        assertEq(token1.balanceOf(address(pack)), 100);
        assertEq(token2.balanceOf(address(pack)), 200);

        vm.stopPrank();
    }

    function test_CreatePackWithERC721() public {
        vm.startPrank(alice);

        // Approve NFTs
        erc721.approve(address(pack), 0);

        // Create pack with ERC721
        GiftPack.ERC721Token[] memory erc721Tokens = new GiftPack.ERC721Token[](1);
        erc721Tokens[0] = GiftPack.ERC721Token(address(erc721), 0);

        uint256 tokenId = pack.createPack(
            new GiftPack.ERC20Token[](0),
            erc721Tokens,
            new GiftPack.ERC1155Token[](0)
        );

        // Verify pack creation
        assertEq(pack.ownerOf(tokenId), alice);
        assertEq(erc721.ownerOf(0), address(pack));

        vm.stopPrank();
    }

    function test_CreatePackWithERC1155() public {
        vm.startPrank(alice);

        // Approve NFTs
        erc1155.setApprovalForAll(address(pack), true);

        // Create pack with ERC1155
        GiftPack.ERC1155Token[] memory erc1155Tokens = new GiftPack.ERC1155Token[](1);
        erc1155Tokens[0] = GiftPack.ERC1155Token(address(erc1155), 1, 5);

        uint256 tokenId = pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            erc1155Tokens
        );

        // Verify pack creation
        assertEq(pack.ownerOf(tokenId), alice);
        assertEq(erc1155.balanceOf(address(pack), 1), 5);

        vm.stopPrank();
    }

    function test_CreatePackWithEverything() public {
        vm.startPrank(alice);

        // Approve all tokens
        token1.approve(address(pack), 100);
        token2.approve(address(pack), 200);
        erc721.approve(address(pack), 0);
        erc1155.setApprovalForAll(address(pack), true);

        // Create pack with everything
        GiftPack.ERC20Token[] memory tokens = new GiftPack.ERC20Token[](2);
        tokens[0] = GiftPack.ERC20Token(address(token1), 100);
        tokens[1] = GiftPack.ERC20Token(address(token2), 200);

        GiftPack.ERC721Token[] memory erc721Tokens = new GiftPack.ERC721Token[](1);
        erc721Tokens[0] = GiftPack.ERC721Token(address(erc721), 0);

        GiftPack.ERC1155Token[] memory erc1155Tokens = new GiftPack.ERC1155Token[](1);
        erc1155Tokens[0] = GiftPack.ERC1155Token(address(erc1155), 1, 5);

        uint256 tokenId = pack.createPack{value: 1 ether}(tokens, erc721Tokens, erc1155Tokens);

        // Verify pack creation
        assertEq(pack.ownerOf(tokenId), alice);
        assertEq(token1.balanceOf(address(pack)), 100);
        assertEq(token2.balanceOf(address(pack)), 200);
        assertEq(erc721.ownerOf(0), address(pack));
        assertEq(erc1155.balanceOf(address(pack), 1), 5);
        assertEq(address(pack).balance, 1 ether);
        assertEq(pack.getPackEthAmount(tokenId), 1 ether);

        vm.stopPrank();
    }

    function test_OpenPackWithEverything() public {
        vm.startPrank(alice);

        // Approve all tokens
        token1.approve(address(pack), 100);
        token2.approve(address(pack), 200);
        erc721.approve(address(pack), 0);
        erc1155.setApprovalForAll(address(pack), true);

        // Create pack with everything
        GiftPack.ERC20Token[] memory tokens = new GiftPack.ERC20Token[](2);
        tokens[0] = GiftPack.ERC20Token(address(token1), 100);
        tokens[1] = GiftPack.ERC20Token(address(token2), 200);

        GiftPack.ERC721Token[] memory erc721Tokens = new GiftPack.ERC721Token[](1);
        erc721Tokens[0] = GiftPack.ERC721Token(address(erc721), 0);

        GiftPack.ERC1155Token[] memory erc1155Tokens = new GiftPack.ERC1155Token[](1);
        erc1155Tokens[0] = GiftPack.ERC1155Token(address(erc1155), 1, 5);

        uint256 tokenId = pack.createPack{value: 1 ether}(tokens, erc721Tokens, erc1155Tokens);

        // Record bob's initial balance
        uint256 bobInitialBalance = bob.balance;

        // Open pack
        pack.openPack(tokenId, bob);

        // Verify pack opening
        assertTrue(pack.isPackOpened(tokenId));
        assertEq(token1.balanceOf(bob), 100);
        assertEq(token2.balanceOf(bob), 200);
        assertEq(erc721.ownerOf(0), bob);
        assertEq(erc1155.balanceOf(bob, 1), 5);
        assertEq(bob.balance, bobInitialBalance + 1 ether);
        assertEq(address(pack).balance, 0);

        vm.stopPrank();
    }

    function test_RevertWhen_OpeningPackTwice() public {
        vm.startPrank(alice);

        // Create pack
        uint256 tokenId = pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0)
        );

        // Open pack once
        pack.openPack(tokenId, bob);

        // Try to open pack again
        vm.expectRevert(GiftPack.PackAlreadyOpened.selector);
        pack.openPack(tokenId, bob);

        vm.stopPrank();
    }

    function test_RevertWhen_NonOwnerOpensPackage() public {
        vm.startPrank(alice);

        // Create pack
        uint256 tokenId = pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0)
        );

        vm.stopPrank();
        vm.startPrank(bob);

        // Try to open pack as non-owner
        vm.expectRevert(GiftPack.NotPackOwnerOrOpener.selector);
        pack.openPack(tokenId, bob);

        vm.stopPrank();
    }

    function test_OpenerRoleCanOpenOthersPacks() public {
        vm.startPrank(alice);

        // Setup pack with tokens
        uint256 erc20Amount = 100;
        token1.approve(address(pack), erc20Amount);

        GiftPack.ERC20Token[] memory tokens = new GiftPack.ERC20Token[](1);
        tokens[0] = GiftPack.ERC20Token({
            tokenAddress: address(token1),
            amount: erc20Amount
        });

        // Create pack
        uint256 tokenId = pack.createPack(tokens, new GiftPack.ERC721Token[](0), new GiftPack.ERC1155Token[](0));
        vm.stopPrank();

        // Setup opener account
        address opener = makeAddr("opener");
        pack.grantRole(pack.OPENER_ROLE(), opener);
        assertTrue(pack.hasRole(pack.OPENER_ROLE(), opener));

        // Setup recipient
        address recipient = makeAddr("recipient");

        // Opener opens pack
        vm.prank(opener);
        pack.openPack(tokenId, recipient);

        // Verify recipient received tokens
        assertEq(token1.balanceOf(recipient), erc20Amount);
        assertTrue(pack.isPackOpened(tokenId));
    }
}