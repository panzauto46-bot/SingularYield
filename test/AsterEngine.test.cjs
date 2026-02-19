const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("AsterEngine", function () {

    async function deployFixture() {
        const [owner, vault, keeper] = await ethers.getSigners();

        // Deploy Mock ERC20 (USDT as asset)
        const MockToken = await ethers.getContractFactory("MockERC20");
        const usdt = await MockToken.deploy("Mock USDT", "USDT", 18);
        await usdt.waitForDeployment();

        // Deploy Mock Reward Token
        const rewardToken = await MockToken.deploy("Mock Reward", "RWD", 18);
        await rewardToken.waitForDeployment();

        // Deploy Mock AsterDEX
        const MockAsterDEX = await ethers.getContractFactory("MockAsterDEX");
        const asterDex = await MockAsterDEX.deploy(await usdt.getAddress());
        await asterDex.waitForDeployment();
        // Set reward token on mock
        await asterDex.setRewardToken(await rewardToken.getAddress());

        // Deploy AsterEngine (vault = vault signer address for simplicity)
        const AsterEngine = await ethers.getContractFactory("AsterEngine");
        const engine = await AsterEngine.deploy(
            await usdt.getAddress(),
            await asterDex.getAddress(),
            vault.address
        );
        await engine.waitForDeployment();

        // Fund engine with USDT
        const fundAmount = ethers.parseEther("5000");
        await usdt.mint(await engine.getAddress(), fundAmount);

        return { engine, usdt, rewardToken, asterDex, owner, vault, keeper, fundAmount };
    }

    describe("Deployment", function () {
        it("Should set correct asset", async function () {
            const { engine, usdt } = await loadFixture(deployFixture);
            expect(await engine.asset()).to.equal(await usdt.getAddress());
        });

        it("Should set correct vault", async function () {
            const { engine, vault } = await loadFixture(deployFixture);
            expect(await engine.vault()).to.equal(vault.address);
        });
    });

    describe("Capital Deployment", function () {
        it("Should deploy capital when called by vault", async function () {
            const { engine, vault } = await loadFixture(deployFixture);
            const amount = ethers.parseEther("1000");
            await engine.connect(vault).deployCapital(amount);
        });

        it("Should revert deploy capital from non-vault", async function () {
            const { engine, keeper } = await loadFixture(deployFixture);
            const amount = ethers.parseEther("1000");
            await expect(
                engine.connect(keeper).deployCapital(amount)
            ).to.be.revertedWith("AsterEngine: caller is not the vault");
        });
    });

    describe("Bounty System", function () {
        it("Should have default bounty of 100 bps (1%)", async function () {
            const { engine } = await loadFixture(deployFixture);
            expect(await engine.bountyBps()).to.equal(100);
        });

        it("Should allow owner to set bounty", async function () {
            const { engine, owner } = await loadFixture(deployFixture);
            await engine.connect(owner).setBountyBps(200);
            expect(await engine.bountyBps()).to.equal(200);
        });

        it("Should revert if bounty exceeds MAX_BOUNTY", async function () {
            const { engine, owner } = await loadFixture(deployFixture);
            await expect(
                engine.connect(owner).setBountyBps(600) // > 500
            ).to.be.revertedWith("Bounty too high");
        });

        it("Should not allow non-owner to set bounty", async function () {
            const { engine, keeper } = await loadFixture(deployFixture);
            await expect(
                engine.connect(keeper).setBountyBps(200)
            ).to.be.reverted;
        });
    });

    describe("Emergency Unwind", function () {
        it("Should allow owner to emergency unwind", async function () {
            const { engine, owner } = await loadFixture(deployFixture);
            await engine.connect(owner).emergencyUnwind();
        });

        it("Should revert emergency unwind from non-owner", async function () {
            const { engine, keeper } = await loadFixture(deployFixture);
            await expect(
                engine.connect(keeper).emergencyUnwind()
            ).to.be.reverted;
        });
    });
});
