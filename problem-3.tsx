// @ts-nocheck

interface WalletBalance {
  currency: string;
  amount: number;
}
// We can rewrite it to use extends keyword,
// so that whenever we need to add more attribute to WalletBalance, we don't need to update FormattedWalletBalance
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  // TODO: Implement datasource class
  // Please check the Refactor version at the bottom of the file.
}

interface Props extends BoxProps {} // Instead of passing props to just style the div, we can write a BoxComponent, then we can reuse it at anywhere
const WalletPage: React.FC<Props> = (props: Props) => {
  // The Function Component is not exported, so we cannot import to use it from other components.
  const { children, ...rest } = props; // Then we can remove this line
  const balances = useWalletBalances();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const datasource = new Datasource(
      'https://interview.switcheo.com/prices.json'
    );
    datasource
      .getPrices()
      .then((prices) => {
        // We might need to add type for the `prices`
        // The `prices` value here is an array, but `state prices` expected an object, so we should convert the array to object before setPrices
        // And to allow this code `prices[balance.currency]` work, we need to create a new object, with key is `currency` and value is `price`
        // Please review the fix in the Refactor version
        setPrices(prices);
      })
      .catch((error) => {
        console.err(error); // There is no `console.err`, it should be console.error
      });
  }, []);

  const getPriority = (blockchain: any): number => {
    // The blockchain type should be a string
    // We should refactor this code block to easily readable and maintainable
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances // The value `balance` might be undefined on the first render, so if !balances we should return []
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);

        // This block code will crash the app, because lhsPriority is not defined, we should rename it to balancePriority
        // We can also
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            // I'm not sure about it, but I think the condition is wrong, that should be balance.amount > 0
            return true;
          }
        }
        return false;
        // We can also refactor the above block code into 1 line only, please review it in the Refactor version
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
        // The block code above miss a case of leftPriority === rightPriority
        // We can also refactor it to make it simpler => https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      });
  }, [balances, prices]); // This code pass the unnecessery dependency, we should remove `prices` from array dependencies

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    // we can also wrap this code block with useMemo to avoid unnecessary recomputed
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    // We can wrap this code block with useCallback to prevent unnecessary rerenders
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row} // Hmm, I'm not sure, but I think it's better to implement this in WalletRow Component
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
          // this code will crash the app, because element of sortedBalances doesn't have `formatted` attribute
          // instead of mapping sortedBalances, we should mapping formattedBalances
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};

/* ------------------------ Refactor version -------------------------- */

interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Currency {
  currency: string;
  price: number;
}

interface ObjectPrice {
  [key: string]: number;
}

class Datasource {
  constructor(private sourceUrl: string) {}

  getPrices() {
    return fetch(this.sourceUrl).then((res) => res.json());
  }
}

const WalletPage: React.FC = () => {
  const balances = useWalletBalances();
  const [prices, setPrices] = useState<ObjectPrice>({});

  useEffect(() => {
    const datasource = new Datasource(
      'https://interview.switcheo.com/prices.json'
    );
    datasource
      .getPrices()
      .then((prices: Currency[]) => {
        const objectPrices = prices.reduce((prev, curr) => {
          const { price, currency } = curr;
          return { ...prev, [currency]: price };
        }, {});
        setPrices(objectPrices);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getPriority = (blockchain: string): number => {
    const blockchainPriorities: { [key: string]: number } = {
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    };

    return blockchainPriorities[blockchain] || -99;
  };

  const sortedBalances = useMemo(() => {
    if (!balances) return [];
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return leftPriority - rightPriority;
      });
  }, [balances]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed(),
      };
    });
  }, [sortedBalances]);

  const renderWalletRows = useCallback(() => {
    formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <Box>{renderWalletRows}</Box>;
};

export default WalletPage;

/* BoxComponent */
export interface BoxProps extends React.DivHTMLAttributes<HTMLDivElement> {}

const Box = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  // We can also define some common styles here, and then make it different by passing different props.
  return <div ref={ref} {...props} />;
});

export { Box };
