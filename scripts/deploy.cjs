/**
 * @title SingularYield Deploy Script
 * @description Deploys all core contracts in the correct order:
 * 1. SingularityVault
 * 2. AsterEngine (linked to Vault)
 * 3. StackingRouter (linked to Engine)
 * 4. Wire connections (Vault -> Engine, Engine -> Router)
 * 
 * Usage:
 *   npx hardhat run scripts/deploy.js --network bnb_testnet
 */

const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("═══════════════════════════════════════════════════");
    console.log("  🚀 SingularYield Deployment");
    console.log("═══════════════════════════════════════════════════");
    console.log(`  Deployer: ${deployer.address}`);
    console.log(`  Balance:  ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} BNB`);
    console.log("═══════════════════════════════════════════════════\n");

    // ─── Configuration ──────────────────────────────────────
    // Replace these with actual addresses on mainnet/testnet:
    const USDT_ADDRESS = process.env.USDT_ADDRESS || "0x55d398326f99059fF775485246999027B3197955"; // BSC USDT
    const ASTER_DEX_ADDRESS = process.env.ASTER_DEX_ADDRESS || "0x0000000000000000000000000000000000000001"; // Placeholder
    const PANCAKE_ROUTER = process.env.PANCAKE_ROUTER || "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // PancakeSwap V2
    const PANCAKE_MASTERCHEF = process.env.PANCAKE_MASTERCHEF || "0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652"; // MasterChef v2
    const YIELD_TOKEN = process.env.YIELD_TOKEN || USDT_ADDRESS;
    const PAIRED_TOKEN = process.env.PAIRED_TOKEN || "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"; // WBNB
    const LP_TOKEN = process.env.LP_TOKEN || "0x0000000000000000000000000000000000000000"; // Set after pair exists
    const FARM_PID = parseInt(process.env.FARM_PID || "0");

    // ─── Step 1: Deploy SingularityVault ────────────────────
    console.log("📦 [1/4] Deploying SingularityVault...");
    const SingularityVault = await ethers.getContractFactory("SingularityVault");
    const vault = await SingularityVault.deploy(USDT_ADDRESS, "SingularYield Vault Token", "svUSDT");
    await vault.waitForDeployment();
    const vaultAddr = await vault.getAddress();
    console.log(`   ✅ SingularityVault: ${vaultAddr}\n`);

    // ─── Step 2: Deploy AsterEngine ─────────────────────────
    console.log("📦 [2/4] Deploying AsterEngine...");
    const AsterEngine = await ethers.getContractFactory("AsterEngine");
    const engine = await AsterEngine.deploy(USDT_ADDRESS, ASTER_DEX_ADDRESS, vaultAddr);
    await engine.waitForDeployment();
    const engineAddr = await engine.getAddress();
    console.log(`   ✅ AsterEngine: ${engineAddr}\n`);

    // ─── Step 3: Deploy StackingRouter ──────────────────────
    console.log("📦 [3/4] Deploying StackingRouter...");
    const StackingRouter = await ethers.getContractFactory("StackingRouter");
    const router = await StackingRouter.deploy(
        PANCAKE_ROUTER,
        PANCAKE_MASTERCHEF,
        YIELD_TOKEN,
        PAIRED_TOKEN,
        LP_TOKEN,
        FARM_PID
    );
    await router.waitForDeployment();
    const routerAddr = await router.getAddress();
    console.log(`   ✅ StackingRouter: ${routerAddr}\n`);

    // ─── Step 4: Wire Connections ───────────────────────────
    console.log("🔗 [4/4] Wiring connections...");

    console.log("   Vault.setEngine(engine)...");
    const tx1 = await vault.setEngine(engineAddr);
    await tx1.wait();

    console.log("   Engine.setStackingRouter(router)...");
    const tx2 = await engine.setStackingRouter(routerAddr);
    await tx2.wait();

    console.log("   Router.setEngine(engine)...");
    const tx3 = await router.setEngine(engineAddr);
    await tx3.wait();

    console.log("   ✅ All contracts wired!\n");

    // ─── Summary ────────────────────────────────────────────
    console.log("═══════════════════════════════════════════════════");
    console.log("  📋 DEPLOYMENT SUMMARY");
    console.log("═══════════════════════════════════════════════════");
    console.log(`  SingularityVault: ${vaultAddr}`);
    console.log(`  AsterEngine:      ${engineAddr}`);
    console.log(`  StackingRouter:   ${routerAddr}`);
    console.log("═══════════════════════════════════════════════════");
    console.log("\n  ✅ Deployment complete! Save these addresses.\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
