import { ObjectPrice } from '@/types';

const useAccountBalance = (account: string) => {
  const balances: ObjectPrice = account
    ? {
        BLUR: 1000,
        bNEO: 99,
        BUSD: 122,
        USD: 1155,
        ETH: 0.5,
        LUNA: 10000,
        OAB: 100,
      }
    : {};
  return balances;
};

export default useAccountBalance;
