export const translations = {
    en: {
        // Header
        systemStatus: 'System Operational',
        audited: 'Audited',
        connectWallet: 'Connect Wallet',
        currentApy: 'APY',

        // Tabs
        dashboard: 'Dashboard',
        vault: 'Vault',
        engine: 'Engine Room',
        keeper: 'Keeper Hub',
        transparency: 'Transparency',

        // Global Dashboard
        tvl: 'Total Value Locked',
        tvlChange: '+12.4% this week',
        dynamicApy: 'Dynamic APY',
        apySubtitle: 'Auto-optimized yield',
        activeStrategies: 'Active Strategies',
        systemOperational: 'All systems operational',
        liveFeed: 'Live Strategy Feed',
        realTimeTerminal: 'REAL-TIME TERMINAL',
        block: 'Block',

        // Actions
        rebalance: 'Engine rebalanced 50 BNB from AsterDEX to PancakeSwap Farm',
        harvest: 'Auto-harvested 125 CAKE rewards from LP Position',
        compound: 'Compounded $2,450 USDT yield into BNB-USDT LP',
        hedge: 'Hedging protocol activated: 15% moved to stablecoin vault',
        router: 'Smart Router detected 0.3% APY gain on Riquid Pool',
        live: 'LIVE',

        // Vault Interface
        depositGateway: 'Single Deposit Gateway',
        depositSubtitle: 'One click. Infinite strategies.',
        enterAmount: 'Enter amount',
        availableBalance: 'Available Balance',
        deployButton: 'DEPLOY TO SINGULARITY',
        deploying: 'Deploying to Singularity...',
        deployNote: 'No staking, no harvesting, no compounding needed. The engine handles everything.',
        yourPosition: 'Your Position',
        autoCompounding: 'Auto-compounding',
        totalDeposited: 'Total Deposited Value',
        earned: 'earned',
        timeAgo: '24h ago',
        timeNow: 'Now',
        emergencyUnwind: 'Emergency Unwind',
        emergencySubtitle: 'No lock-up. Withdraw anytime.',
        withdrawAll: 'Withdraw All Funds',
        nonCustodial: '⚠️ No admin can prevent withdrawal. Fully non-custodial.',
        max: 'MAX',

        // Footer
        footerRights: 'SingularYield Protocol. All rights reserved.',
        footerTagline: 'Decentralized Keepers • Autonomous Yield • Trustless Execution'
    },
    id: {
        // Header
        systemStatus: 'Sistem Berjalan',
        audited: 'Diaudit',
        connectWallet: 'Koneksi Dompet',
        currentApy: 'APY',

        // Tabs
        dashboard: 'Dasbor',
        vault: 'Brankas',
        engine: 'Ruang Mesin',
        keeper: 'Pusat Keeper',
        transparency: 'Transparansi',

        // Global Dashboard
        tvl: 'Total Nilai Terkunci',
        tvlChange: '+12.4% minggu ini',
        dynamicApy: 'APY Dinamis',
        apySubtitle: 'Hasil dioptimalkan otomatis',
        activeStrategies: 'Strategi Aktif',
        systemOperational: 'Semua sistem operasional',
        liveFeed: 'Umpan Strategi Langsung',
        realTimeTerminal: 'TERMINAL REAL-TIME',
        block: 'Blok',

        // Actions
        rebalance: 'Mesin menyeimbangkan ulang 50 BNB dari AsterDEX ke PancakeSwap Farm',
        harvest: 'Panen otomatis 125 hadiah CAKE dari Posisi LP',
        compound: 'Melipatgandakan hasil $2,450 USDT ke dalam BNB-USDT LP',
        hedge: 'Protokol lindung nilai diaktifkan: 15% dipindahkan ke brankas stablecoin',
        router: 'Smart Router mendeteksi kenaikan APY 0.3% di Pool Riquid',
        live: 'ANGSUNG',

        // Vault Interface
        depositGateway: 'Gerbang Setoran Tunggal',
        depositSubtitle: 'Satu klik. Strategi tak terbatas.',
        enterAmount: 'Masukkan jumlah',
        availableBalance: 'Saldo Tersedia',
        deployButton: 'DEPLOY KE SINGULARITY',
        deploying: 'Mengirim ke Singularity...',
        deployNote: 'Tidak perlu staking, panen, atau compound manual. Mesin menangani semuanya.',
        yourPosition: 'Posisi Anda',
        autoCompounding: 'Auto-compounding',
        totalDeposited: 'Total Nilai Disimpan',
        earned: 'diperoleh',
        timeAgo: '24j lalu',
        timeNow: 'Sekarang',
        emergencyUnwind: 'Penarikan Darurat',
        emergencySubtitle: 'Tanpa penguncian. Tarik kapan saja.',
        withdrawAll: 'Tarik Semua Dana',
        nonCustodial: '⚠️ Admin tidak bisa menahan dana. Sepenuhnya non-kustodial.',
        max: 'MAKS',

        // Footer
        footerRights: 'SingularYield Protocol. Hak cipta dilindungi.',
        footerTagline: 'Keeper Terdesentralisasi • Hasil Otonom • Eksekusi Tanpa Kepercayaan'
    }
};

export type Language = 'en' | 'id';
export type TranslationKey = keyof typeof translations.en;
