/**
 * @title SingularYield Keeper Bot
 * @description Automated Keeper that calls harvest() on AsterEngine
 * periodically to compound yield and earn bounty rewards.
 * 
 * Usage:
 *   PRIVATE_KEY=0x... ENGINE_ADDRESS=0x... node scripts/keeper.js
 * 
 * Environment Variables:
 *   - PRIVATE_KEY: Keeper wallet private key
 *   - ENGINE_ADDRESS: Deployed AsterEngine contract address
 *   - BNB_RPC_URL: RPC endpoint (defaults to BSC mainnet)
 *   - INTERVAL_MS: Harvest interval in milliseconds (default: 3600000 = 1 hour)
 *   - MIN_PROFIT_USD: Minimum profit threshold to harvest (default: 1.0)
 */

const { ethers } = require("ethers");
require("dotenv").config();

// ─── Configuration ────────────────────────────────────────────
const RPC_URL = process.env.BNB_RPC_URL || "https://bsc-dataseed.binance.org/";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ENGINE_ADDRESS = process.env.ENGINE_ADDRESS;
const INTERVAL_MS = parseInt(process.env.INTERVAL_MS || "3600000"); // default 1 hour
const MIN_PROFIT_USD = parseFloat(process.env.MIN_PROFIT_USD || "1.0");

// ─── ABI (Minimal) ───────────────────────────────────────────
const ENGINE_ABI = [
    "function harvest() external",
    "function bountyBps() view returns (uint256)",
    "function stackingRouter() view returns (address)",
    "function totalAssets() view returns (uint256)",
    "event Harvested(uint256 amount)",
];

// ─── State ────────────────────────────────────────────────────
let harvestCount = 0;
let totalBountyEarned = BigInt(0);

// ─── Main ─────────────────────────────────────────────────────
async function main() {
    console.log("═══════════════════════════════════════════════");
    console.log("  🤖 SingularYield Keeper Bot v1.0");
    console.log("═══════════════════════════════════════════════");

    if (!PRIVATE_KEY || !ENGINE_ADDRESS) {
        console.error("❌ Missing PRIVATE_KEY or ENGINE_ADDRESS. Set them in .env");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const engine = new ethers.Contract(ENGINE_ADDRESS, ENGINE_ABI, wallet);

    console.log(`  Keeper:     ${wallet.address}`);
    console.log(`  Engine:     ${ENGINE_ADDRESS}`);
    console.log(`  Interval:   ${INTERVAL_MS / 1000}s`);
    console.log(`  Min Profit: $${MIN_PROFIT_USD}`);
    console.log("═══════════════════════════════════════════════");

    // Initial check
    const bountyBps = await engine.bountyBps();
    const routerAddr = await engine.stackingRouter();
    console.log(`  Bounty:     ${Number(bountyBps) / 100}%`);
    console.log(`  Router:     ${routerAddr}`);

    if (routerAddr === ethers.ZeroAddress) {
        console.error("❌ StackingRouter not set on Engine. Cannot harvest.");
        process.exit(1);
    }

    console.log("\n  ✅ Keeper initialized. Starting harvest loop...\n");

    // Run immediately, then on interval
    await tryHarvest(engine, wallet, provider);
    setInterval(() => tryHarvest(engine, wallet, provider), INTERVAL_MS);
}

async function tryHarvest(engine, wallet, provider) {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] 🔍 Checking harvest opportunity...`);

    try {
        // 1. Check gas balance
        const balance = await provider.getBalance(wallet.address);
        const balanceBNB = ethers.formatEther(balance);
        console.log(`  Gas Balance: ${balanceBNB} BNB`);

        if (balance < ethers.parseEther("0.005")) {
            console.log("  ⚠️  Low gas balance. Skipping harvest.");
            return;
        }

        // 2. Estimate gas to check if harvest would succeed
        try {
            const gasEstimate = await engine.harvest.estimateGas();
            console.log(`  Gas Estimate: ${gasEstimate.toString()}`);
        } catch (estimateError) {
            console.log("  ⏳ No yield to harvest (estimateGas reverted). Skipping.");
            return;
        }

        // 3. Execute harvest
        console.log("  🚀 Executing harvest...");
        const tx = await engine.harvest({
            gasLimit: 500000n,
        });

        console.log(`  📤 TX Hash: ${tx.hash}`);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
            harvestCount++;
            console.log(`  ✅ Harvest #${harvestCount} successful!`);
            console.log(`  ⛽ Gas Used: ${receipt.gasUsed.toString()}`);

            // Parse Harvested event
            for (const log of receipt.logs) {
                try {
                    const parsed = engine.interface.parseLog(log);
                    if (parsed && parsed.name === "Harvested") {
                        const amount = parsed.args[0];
                        console.log(`  💰 Total Harvested: ${ethers.formatEther(amount)} tokens`);
                    }
                } catch {
                    // Not our event
                }
            }
        } else {
            console.log("  ❌ Harvest TX reverted.");
        }
    } catch (error) {
        console.error(`  ❌ Harvest failed: ${error.message}`);
    }
}

// ─── Run ──────────────────────────────────────────────────────
main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
