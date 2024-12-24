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
        erc721.mint(alice);
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

        bytes32 hash = keccak256("test-hash");
        uint256 tokenId = pack.createPack(tokens, new GiftPack.ERC721Token[](0), new GiftPack.ERC1155Token[](0), hash);

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

        bytes32 hash1 = keccak256("test-hash-erc721");
        uint256 tokenId1 = pack.createPack(
            new GiftPack.ERC20Token[](0),
            erc721Tokens,
            new GiftPack.ERC1155Token[](0),
            hash1
        );

        // Verify pack creation
        assertEq(pack.ownerOf(tokenId1), alice);
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

        bytes32 hash2 = keccak256("test-hash-erc1155");
        uint256 tokenId2 = pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            erc1155Tokens,
            hash2
        );

        // Verify pack creation
        assertEq(pack.ownerOf(tokenId2), alice);
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

        bytes32 hash3 = keccak256("test-hash-everything");
        uint256 tokenId3 = pack.createPack{value: 1 ether}(tokens, erc721Tokens, erc1155Tokens, hash3);

        // Verify pack creation
        assertEq(pack.ownerOf(tokenId3), alice);
        assertEq(token1.balanceOf(address(pack)), 100);
        assertEq(token2.balanceOf(address(pack)), 200);
        assertEq(erc721.ownerOf(0), address(pack));
        assertEq(erc1155.balanceOf(address(pack), 1), 5);
        assertEq(address(pack).balance, 1 ether);
        assertEq(pack.getPackEthAmount(tokenId3), 1 ether);

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

        bytes32 hash4 = keccak256("test-hash-open-everything");
        uint256 tokenId4 = pack.createPack{value: 1 ether}(tokens, erc721Tokens, erc1155Tokens, hash4);

        // Record bob's initial balance
        uint256 bobInitialBalance = bob.balance;

        // Open pack
        pack.openPackAsOwner(tokenId4, bob);

        // Verify pack opening
        assertTrue(pack.isPackOpened(tokenId4));
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
        bytes32 hash = keccak256("test-hash-twice");
        uint256 tokenId = pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0),
            hash
        );

        // Open pack once
        pack.openPackAsOwner(tokenId, bob);

        // Try to open pack again
        vm.expectRevert(GiftPack.PackAlreadyOpened.selector);
        pack.openPackAsOwner(tokenId, bob);

        vm.stopPrank();
    }

    function test_RevertWhen_NonOwnerOpensPackage() public {
        vm.startPrank(alice);

        // Create pack
        bytes32 hash = keccak256("test-hash-non-owner");
        uint256 tokenId = pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0),
            hash
        );

        vm.stopPrank();
        vm.startPrank(bob);

        // Try to open pack as non-owner
        vm.expectRevert(GiftPack.NotPackOwner.selector);
        pack.openPackAsOwner(tokenId, bob);

        vm.stopPrank();
    }

    function test_OpenPackAsOwner() public {
        vm.startPrank(alice);

        // Create pack with tokens
        token1.approve(address(pack), 100);
        GiftPack.ERC20Token[] memory tokens = new GiftPack.ERC20Token[](1);
        tokens[0] = GiftPack.ERC20Token(address(token1), 100);

        bytes32 hash = keccak256("test-hash");
        uint256 tokenId = pack.createPack(tokens, new GiftPack.ERC721Token[](0), new GiftPack.ERC1155Token[](0), hash);

        // Open pack as owner
        pack.openPackAsOwner(tokenId, bob);

        // Verify pack was opened
        assertEq(token1.balanceOf(bob), 100);
        assertTrue(pack.isPackOpened(tokenId));

        vm.stopPrank();
    }

    function test_OpenPackWithPassword() public {
        vm.startPrank(alice);

        // Approve tokens
        token1.approve(address(pack), 100);

        // Create pack with tokens and password
        GiftPack.ERC20Token[] memory tokens = new GiftPack.ERC20Token[](1);
        tokens[0] = GiftPack.ERC20Token(address(token1), 100);

        string memory password = "secret123";
        bytes32 hash = keccak256(abi.encode(password));
        
        uint256 tokenId = pack.createPack(tokens, new GiftPack.ERC721Token[](0), new GiftPack.ERC1155Token[](0), hash);
        vm.stopPrank();

        // Anyone can open with correct password
        vm.prank(bob);
        pack.openPackWithPassword(password, bob);

        // Verify pack was opened
        assertEq(token1.balanceOf(bob), 100);
        assertTrue(pack.isPackOpened(tokenId));
    }

    function test_RevertWhen_OpeningWithWrongPassword() public {
        vm.startPrank(alice);

        // Create pack with password
        string memory password = "secret123";
        bytes32 hash = keccak256(abi.encode(password));
        
        pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0),
            hash
        );
        vm.stopPrank();

        // Try to open with wrong password
        vm.prank(bob);
        vm.expectRevert(GiftPack.HashNotFound.selector);
        pack.openPackWithPassword("wrong-password", bob);
    }

    function test_RevertWhen_ReusingHash() public {
        vm.startPrank(alice);

        bytes32 hash = keccak256(abi.encode("test-hash"));
        
        // Create first pack with hash
        pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0),
            hash
        );

        // Try to create second pack with same hash
        vm.expectRevert(GiftPack.HashAlreadyUsed.selector);
        pack.createPack(
            new GiftPack.ERC20Token[](0),
            new GiftPack.ERC721Token[](0),
            new GiftPack.ERC1155Token[](0),
            hash
        );

        vm.stopPrank();
    }

    function test_TokenURI_RevertWhen_TokenNotMinted() public {
        vm.expectRevert(GiftPack.TokenNotMinted.selector);
        pack.tokenURI(0);
    }

    function test_TokenURI_EmptyWhen_NoBaseURI() public {
        bytes32 hash = keccak256(abi.encode("password"));
        GiftPack.ERC20Token[] memory erc20Tokens = new GiftPack.ERC20Token[](0);
        GiftPack.ERC721Token[] memory erc721Tokens = new GiftPack.ERC721Token[](0);
        GiftPack.ERC1155Token[] memory erc1155Tokens = new GiftPack.ERC1155Token[](0);

        vm.prank(alice);
        uint256 tokenId = pack.createPack(erc20Tokens, erc721Tokens, erc1155Tokens, hash);

        assertEq(pack.tokenURI(tokenId), "");
    }

    function test_TokenURI_ReturnsCorrectURI() public {
        // Create a pack first
        bytes32 hash = keccak256(abi.encode("password"));
        GiftPack.ERC20Token[] memory erc20Tokens = new GiftPack.ERC20Token[](0);
        GiftPack.ERC721Token[] memory erc721Tokens = new GiftPack.ERC721Token[](0);
        GiftPack.ERC1155Token[] memory erc1155Tokens = new GiftPack.ERC1155Token[](0);

        vm.prank(alice);
        uint256 tokenId = pack.createPack(erc20Tokens, erc721Tokens, erc1155Tokens, hash);

        // Set base URI
        string memory baseURI = "https://api.example.com/metadata/";
        pack.setBaseURI(baseURI);

        // Check token URI
        assertEq(pack.tokenURI(tokenId), string(abi.encodePacked(baseURI, vm.toString(tokenId))));
    }

    function test_SetBaseURI_OnlyAdmin() public {
        string memory baseURI = "https://api.example.com/metadata/";
        
        // Non-admin should not be able to set base URI
        vm.prank(alice);
        vm.expectRevert();
        pack.setBaseURI(baseURI);

        // Admin should be able to set base URI
        pack.setBaseURI(baseURI);
        
        // Create a pack and verify URI
        bytes32 hash = keccak256(abi.encode("password"));
        GiftPack.ERC20Token[] memory erc20Tokens = new GiftPack.ERC20Token[](0);
        GiftPack.ERC721Token[] memory erc721Tokens = new GiftPack.ERC721Token[](0);
        GiftPack.ERC1155Token[] memory erc1155Tokens = new GiftPack.ERC1155Token[](0);

        vm.prank(alice);
        uint256 tokenId = pack.createPack(erc20Tokens, erc721Tokens, erc1155Tokens, hash);

        assertEq(pack.tokenURI(tokenId), string(abi.encodePacked(baseURI, vm.toString(tokenId))));
    }

    function test_SetBaseURI_CanUpdate() public {
        string memory baseURI1 = "https://api.example.com/metadata/";
        string memory baseURI2 = "https://new-api.example.com/metadata/";
        
        // Set initial base URI
        pack.setBaseURI(baseURI1);
        
        // Create a pack
        bytes32 hash = keccak256(abi.encode("password"));
        GiftPack.ERC20Token[] memory erc20Tokens = new GiftPack.ERC20Token[](0);
        GiftPack.ERC721Token[] memory erc721Tokens = new GiftPack.ERC721Token[](0);
        GiftPack.ERC1155Token[] memory erc1155Tokens = new GiftPack.ERC1155Token[](0);

        vm.prank(alice);
        uint256 tokenId = pack.createPack(erc20Tokens, erc721Tokens, erc1155Tokens, hash);

        // Verify initial URI
        assertEq(pack.tokenURI(tokenId), string(abi.encodePacked(baseURI1, vm.toString(tokenId))));

        // Update base URI
        pack.setBaseURI(baseURI2);

        // Verify updated URI
        assertEq(pack.tokenURI(tokenId), string(abi.encodePacked(baseURI2, vm.toString(tokenId))));
    }
}