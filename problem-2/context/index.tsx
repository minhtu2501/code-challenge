'use client';

import { GET_TOKEN_PRICE_URL, MOCK_ACCOUNT_ADDRESS } from '@/constants';
import useTokenStore from '@/stores/token-store';
import { TokenPrice } from '@/types';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IAppContext {
  account: string;
  connect: () => void;
  disconnect: () => void;
}

const AppContext = createContext<IAppContext>({
  account: '',
  connect: () => {},
  disconnect: () => {},
});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string>('');
  const setPrices = useTokenStore((state) => state.setPrices);
  const setTokens = useTokenStore((state) => state.setTokens);

  useEffect(() => {
    fetch(GET_TOKEN_PRICE_URL)
      .then((res) => res.json())
      .then((prices: TokenPrice[]) => {
        const objectPrices = prices.reduce((prev, curr) => {
          const { price, currency } = curr;
          return { ...prev, [currency]: price };
        }, {});
        setPrices(objectPrices);
        setTokens(Object.keys(objectPrices));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setPrices, setTokens]);

  const connect = () => {
    setAccount(MOCK_ACCOUNT_ADDRESS);
  };

  const disconnect = () => {
    setAccount('');
  };

  return (
    <AppContext.Provider
      value={{
        account,
        connect,
        disconnect,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
