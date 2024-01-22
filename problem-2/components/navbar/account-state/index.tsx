'use client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context';
import { shortenAddress } from '@/utils/format';
import React from 'react';

const AccountState: React.FC = () => {
  const { account, connect, disconnect } = useAppContext();

  if (account) {
    return (
      <Button className="rounded-2xl" variant="outline" onClick={disconnect}>
        <Icons.wallet className="size-5 mr-2" />
        {shortenAddress(account)}
      </Button>
    );
  }
  return (
    <Button className="rounded-2xl" onClick={connect}>
      Connect Wallet
    </Button>
  );
};

export default AccountState;
