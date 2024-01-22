import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context';
import useAccountBalance from '@/hooks/use-account-balances';
import { ObjectPrice } from '@/types';
import React from 'react';

interface SwapActionProps {
  submiting: boolean;
  amount: number | '';
  exchangeAmount: number | '';
  token: string;
  balances: ObjectPrice;
}

const SwapAction = ({
  submiting,
  amount,
  exchangeAmount,
  token,
  balances,
}: SwapActionProps) => {
  const { account, connect } = useAppContext();

  if (!account) {
    return (
      <Button type="button" className="w-full" onClick={connect}>
        Connect Wallet
      </Button>
    );
  }

  if (!amount || !exchangeAmount) {
    return (
      <Button type="button" className="w-full" variant="outline" disabled>
        Enter an amount
      </Button>
    );
  }

  if (!balances[token] || balances[token] < amount) {
    return (
      <Button type="button" className="w-full" variant="outline" disabled>
        Insufficient {token} balance
      </Button>
    );
  }

  return (
    <div>
      <Button type="submit" className="w-full" variant="outline">
        {submiting ? (
          <span className="flex gap-2 items-center">
            <Icons.spinner className="animate-spin size-4" />
            Swapping
          </span>
        ) : (
          <span>Swap</span>
        )}
      </Button>
    </div>
  );
};

export default SwapAction;
