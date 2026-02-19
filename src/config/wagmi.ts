import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
    appName: 'SingularYield',
    projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // TODO: User needs to replace this
    chains: [bsc, bscTestnet],
    transports: {
        [bsc.id]: http('https://bsc-dataseed.binance.org/'),
        [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545/'),
    },
});
