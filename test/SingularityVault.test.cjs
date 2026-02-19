const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("SingularityVault", function () {

    async function deployFixture() {
        const [owner, user1, user2] = await ethers.getSigners();

        // Deploy Mock ERC20 (USDT)
        const MockToken = await ethers.getContractFactory("MockERC20");
        const usdt = await MockToken.deploy("Mock USDT", "USDT", 18);
        await usdt.waitForDeployment();

        // Deploy Mock AsterDEX
        const MockAsterDEX = await ethers.getContractFactory("MockAsterDEX");
        const asterDex = await MockAsterDEX.deploy(await usdt.getAddress());
        await asterDex.waitForDeployment();

        // Deploy Vault
        const SingularityVault = await ethers.getContractFactory("SingularityVault");
        const vault = await SingularityVault.deploy(
            await usdt.getAddress(),
            "SingularYield Vault Token",
            "svUSDT"
        );
        await vault.waitForDeployment();

        // Deploy Engine
        const AsterEngine = await ethers.getContractFactory("AsterEngine");
        const engine = await AsterEngine.deploy(
            await usdt.getAddress(),
            await asterDex.getAddress(),
            await vault.getAddress()
        );
        await engine.waitForDeployment();

        // Connect Vault <-> Engine
        await vault.setEngine(await engine.getAddress());

        // Mint tokens for users
        const mintAmount = ethers.parseEther("10000");
        await usdt.mint(user1.address, mintAmount);
        await usdt.mint(user2.address, mintAmount);

        // Also fund AsterDEX with USDT so it can return funds on withdraw
        await usdt.mint(await asterDex.getAddress(), ethers.parseEther("100000"));

        return { vault, engine, usdt, asterDex, owner, user1, user2, mintAmount };
    }

    describe("Deployment", function () {
        it("Should set the correct asset token", async function () {
            const { vault, usdt } = await loadFixture(deployFixture);
            expect(await vault.asset()).to.equal(await usdt.getAddress());
        });

        it("Should set the correct name and symbol", async function () {
            const { vault } = await loadFixture(deployFixture);
            expect(await vault.name()).to.equal("SingularYield Vault Token");
            expect(await vault.symbol()).to.equal("svUSDT");
        });

        it("Should set the engine", async function () {
            const { vault, engine } = await loadFixture(deployFixture);
            expect(await vault.engine()).to.equal(await engine.getAddress());
        });
    });

    describe("Deposits", function () {
        it("Should accept deposits and mint shares", async function () {
            const { vault, usdt, user1 } = await loadFixture(deployFixture);
            const depositAmount = ethers.parseEther("1000");

            // Approve
            await usdt.connect(user1).approve(await vault.getAddress(), depositAmount);

            // Deposit (assets, receiver)
            await vault.connect(user1).deposit(depositAmount, user1.address);

            // Check shares minted (1:1 for first deposit)
            expect(await vault.balanceOf(user1.address)).to.equal(depositAmount);
        });

        it("Should revert deposit of zero", async function () {
            const { vault, user1 } = await loadFixture(deployFixture);
            await expect(
                vault.connect(user1).deposit(0, user1.address)
            ).to.be.reverted;
        });

        it("Should emit Deposit event", async function () {
            const { vault, usdt, user1 } = await loadFixture(deployFixture);
            const depositAmount = ethers.parseEther("500");
            await usdt.connect(user1).approve(await vault.getAddress(), depositAmount);
            await expect(
                vault.connect(user1).deposit(depositAmount, user1.address)
            ).to.emit(vault, "Deposit");
        });
    });

    describe("Withdrawals", function () {
        it("Should allow withdrawal of shares", async function () {
            const { vault, usdt, user1 } = await loadFixture(deployFixture);
            const depositAmount = ethers.parseEther("1000");

            // Deposit
            await usdt.connect(user1).approve(await vault.getAddress(), depositAmount);
            await vault.connect(user1).deposit(depositAmount, user1.address);

            // Withdraw (shares, receiver, owner)
            const shares = await vault.balanceOf(user1.address);
            await vault.connect(user1).withdraw(shares, user1.address, user1.address);

            // Check user shares burned
            expect(await vault.balanceOf(user1.address)).to.equal(0);
        });

        it("Should revert withdrawal of zero shares", async function () {
            const { vault, user1 } = await loadFixture(deployFixture);
            await expect(
                vault.connect(user1).withdraw(0, user1.address, user1.address)
            ).to.be.reverted;
        });
    });

    describe("Access Control", function () {
        it("Should not allow non-owner to set engine", async function () {
            const { vault, user1 } = await loadFixture(deployFixture);
            await expect(
                vault.connect(user1).setEngine(user1.address)
            ).to.be.reverted;
        });

        it("Should not allow setting engine twice", async function () {
            const { vault, owner } = await loadFixture(deployFixture);
            // Engine is already set in fixture
            await expect(
                vault.setEngine(owner.address)
            ).to.be.reverted;
        });
    });
});
