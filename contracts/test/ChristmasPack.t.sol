//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/ChristmasPack.sol";
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

contract ChristmasPackTest is Test {
    ChristmasPack public pack;
    MockERC20 public token;
    BadERC20 public badToken;
    MockERC721 public nft;
    MockERC1155 public multiToken;
    
    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    
    function setUp() public {
        // Deploy contracts
        pack = new ChristmasPack();
        token = new MockERC20();
        badToken = new BadERC20();
        nft = new MockERC721();
        multiToken = new MockERC1155();
        
        // Setup Alice's assets
        vm.startPrank(alice);
        
        // Get some ETH
        vm.deal(alice, 100 ether);
        
        // Get some ERC20 tokens
        token.mint(alice, 1000 ether);
        badToken.mint(alice, 1000 ether);
        
        // Get some NFTs
        uint256 nftId = nft.mint(alice);
        
        // Get some ERC1155 tokens
        multiToken.mint(alice, 1, 100);
        
        // Approve pack contract
        token.approve(address(pack), type(uint256).max);
        badToken.approve(address(pack), type(uint256).max);
        nft.setApprovalForAll(address(pack), true);
        multiToken.setApprovalForAll(address(pack), true);
        
        vm.stopPrank();
    }

    function test_CreatePack() public {
        vm.startPrank(alice);
        
        ChristmasPack.ERC20Asset[] memory erc20Assets = new ChristmasPack.ERC20Asset[](1);
        erc20Assets[0] = ChristmasPack.ERC20Asset(address(token), 100 ether);
        
        ChristmasPack.ERC721Asset[] memory erc721Assets = new ChristmasPack.ERC721Asset[](1);
        erc721Assets[0] = ChristmasPack.ERC721Asset(address(nft), 0);
        
        ChristmasPack.ERC1155Asset[] memory erc1155Assets = new ChristmasPack.ERC1155Asset[](1);
        erc1155Assets[0] = ChristmasPack.ERC1155Asset(address(multiToken), 1, 50);
        
        uint256 packId = pack.createPack(erc20Assets, erc721Assets, erc1155Assets);
        
        assertEq(pack.ownerOf(packId), alice);
        assertEq(token.balanceOf(address(pack)), 100 ether);
        assertEq(nft.ownerOf(0), address(pack));
        assertEq(multiToken.balanceOf(address(pack), 1), 50);
        
        vm.stopPrank();
    }

    function test_OpenPack() public {
        // First create a pack
        vm.startPrank(alice);
        
        ChristmasPack.ERC20Asset[] memory erc20Assets = new ChristmasPack.ERC20Asset[](1);
        erc20Assets[0] = ChristmasPack.ERC20Asset(address(token), 100 ether);
        
        ChristmasPack.ERC721Asset[] memory erc721Assets = new ChristmasPack.ERC721Asset[](1);
        erc721Assets[0] = ChristmasPack.ERC721Asset(address(nft), 0);
        
        ChristmasPack.ERC1155Asset[] memory erc1155Assets = new ChristmasPack.ERC1155Asset[](1);
        erc1155Assets[0] = ChristmasPack.ERC1155Asset(address(multiToken), 1, 50);
        
        uint256 packId = pack.createPack(erc20Assets, erc721Assets, erc1155Assets);
        
        // Transfer pack to Bob
        pack.transferFrom(alice, bob, packId);
        vm.stopPrank();
        
        // Bob opens the pack
        vm.startPrank(bob);
        pack.openPack(packId);
        
        // Verify assets transferred to Bob
        assertEq(token.balanceOf(bob), 100 ether);
        assertEq(nft.ownerOf(0), bob);
        assertEq(multiToken.balanceOf(bob, 1), 50);
        
        // Verify pack was burned
        vm.expectRevert();
        pack.ownerOf(packId);
        
        vm.stopPrank();
    }

    function test_RevertWhen_EmptyPack() public {
        vm.startPrank(alice);
        
        ChristmasPack.ERC20Asset[] memory erc20Assets = new ChristmasPack.ERC20Asset[](0);
        ChristmasPack.ERC721Asset[] memory erc721Assets = new ChristmasPack.ERC721Asset[](0);
        ChristmasPack.ERC1155Asset[] memory erc1155Assets = new ChristmasPack.ERC1155Asset[](0);
        
        vm.expectRevert(ChristmasPack.EmptyPack.selector);
        pack.createPack(erc20Assets, erc721Assets, erc1155Assets);
        
        vm.stopPrank();
    }

    function test_RevertWhen_NotPackOwner() public {
        // Alice creates a pack
        vm.startPrank(alice);
        
        ChristmasPack.ERC20Asset[] memory erc20Assets = new ChristmasPack.ERC20Asset[](1);
        erc20Assets[0] = ChristmasPack.ERC20Asset(address(token), 100 ether);
        
        uint256 packId = pack.createPack(erc20Assets, new ChristmasPack.ERC721Asset[](0), new ChristmasPack.ERC1155Asset[](0));
        vm.stopPrank();
        
        // Bob tries to open Alice's pack
        vm.startPrank(bob);
        vm.expectRevert(ChristmasPack.NotPackOwner.selector);
        pack.openPack(packId);
        vm.stopPrank();
    }

    function test_RevertWhen_PackAlreadyOpened() public {
        // Alice creates and opens a pack
        vm.startPrank(alice);
        
        ChristmasPack.ERC20Asset[] memory erc20Assets = new ChristmasPack.ERC20Asset[](1);
        erc20Assets[0] = ChristmasPack.ERC20Asset(address(token), 100 ether);
        
        uint256 packId = pack.createPack(erc20Assets, new ChristmasPack.ERC721Asset[](0), new ChristmasPack.ERC1155Asset[](0));
        pack.openPack(packId);
        
        // Try to open the same pack again
        vm.expectRevert();  // Should revert because the NFT was burned
        pack.openPack(packId);
        
        vm.stopPrank();
    }

    function test_GetPackContents() public {
        vm.startPrank(alice);
        
        ChristmasPack.ERC20Asset[] memory erc20Assets = new ChristmasPack.ERC20Asset[](1);
        erc20Assets[0] = ChristmasPack.ERC20Asset(address(token), 100 ether);
        
        ChristmasPack.ERC721Asset[] memory erc721Assets = new ChristmasPack.ERC721Asset[](1);
        erc721Assets[0] = ChristmasPack.ERC721Asset(address(nft), 0);
        
        ChristmasPack.ERC1155Asset[] memory erc1155Assets = new ChristmasPack.ERC1155Asset[](1);
        erc1155Assets[0] = ChristmasPack.ERC1155Asset(address(multiToken), 1, 50);
        
        uint256 packId = pack.createPack(erc20Assets, erc721Assets, erc1155Assets);
        
        (
            ChristmasPack.ERC20Asset[] memory storedErc20Assets,
            ChristmasPack.ERC721Asset[] memory storedErc721Assets,
            ChristmasPack.ERC1155Asset[] memory storedErc1155Assets,
            bool isOpened
        ) = pack.getPackContents(packId);
        
        assertEq(storedErc20Assets.length, 1);
        assertEq(storedErc20Assets[0].token, address(token));
        assertEq(storedErc20Assets[0].amount, 100 ether);
        
        assertEq(storedErc721Assets.length, 1);
        assertEq(storedErc721Assets[0].token, address(nft));
        assertEq(storedErc721Assets[0].tokenId, 0);
        
        assertEq(storedErc1155Assets.length, 1);
        assertEq(storedErc1155Assets[0].token, address(multiToken));
        assertEq(storedErc1155Assets[0].tokenId, 1);
        assertEq(storedErc1155Assets[0].amount, 50);
        
        assertFalse(isOpened);
        
        vm.stopPrank();
    }

    function test_SafeTransferWithBadToken() public {
        vm.startPrank(alice);
        
        ChristmasPack.ERC20Asset[] memory erc20Assets = new ChristmasPack.ERC20Asset[](1);
        // Try to transfer more tokens than Alice has
        erc20Assets[0] = ChristmasPack.ERC20Asset(address(badToken), 2000 ether);
        
        ChristmasPack.ERC721Asset[] memory erc721Assets = new ChristmasPack.ERC721Asset[](0);
        ChristmasPack.ERC1155Asset[] memory erc1155Assets = new ChristmasPack.ERC1155Asset[](0);
        
        // This should revert because SafeERC20 will catch the false return value
        vm.expectRevert();
        pack.createPack(erc20Assets, erc721Assets, erc1155Assets);
        
        vm.stopPrank();
    }
}