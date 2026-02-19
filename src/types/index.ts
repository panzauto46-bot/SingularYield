export interface StrategyAction {
  id: string;
  timestamp: Date;
  action: string;
  from?: string;
  to?: string;
  amount?: string;
  type: 'rebalance' | 'harvest' | 'compound' | 'hedge' | 'deposit' | 'withdraw';
}

export interface Contract {
  name: string;
  address: string;
  description: string;
  verified: boolean;
}

export interface RiskMetric {
  label: string;
  value: number;
  maxValue: number;
}
