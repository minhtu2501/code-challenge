'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Icons } from '../icons';
import SelectToken from '../select-token';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import useTokenStore from '@/stores/token-store';
import { useState } from 'react';
import SwapAction from './swap-action';
import { toast } from 'sonner';
import { useAppContext } from '@/context';
import useAccountBalance from '@/hooks/use-account-balances';

const zodSchema = z.object({
  amount: z.coerce.number(),
  token: z.string(),
  exchangeAmount: z.coerce.number(),
  exchangeToken: z.string(),
});

interface IFormInput {
  amount: number | '';
  exchangeAmount: number | '';
  token: string;
  exchangeToken: string;
}

const initialValues: IFormInput = {
  amount: '',
  token: '',
  exchangeAmount: '',
  exchangeToken: '',
};

const SwapForm = () => {
  const { account } = useAppContext();
  const balances = useAccountBalance(account);

  const [submiting, setSubmiting] = useState(false);
  const [baseAmount, setBaseAmount] = useState<
    'amount' | 'exchangeAmount' | undefined
  >();

  const prices = useTokenStore((state) => state.prices);

  const form = useForm<IFormInput>({
    resolver: zodResolver(zodSchema),
    defaultValues: initialValues,
  });

  const { control, handleSubmit, getValues, setValue, reset } = form;

  const onSubmit = (values: IFormInput) => {
    setSubmiting(true);
    const { amount, token, exchangeAmount, exchangeToken } = values;
    setTimeout(() => {
      setSubmiting(false);
      toast('Swapp Successfully', {
        description: `Swap from ${amount} ${token} to ${exchangeAmount} ${exchangeToken}`,
      });
      reset(initialValues);
    }, 2000);
  };

  const onChangeAmount = (e: React.FormEvent<HTMLInputElement>) => {
    setValue('amount', +e.currentTarget.value || '', { shouldValidate: true });
    setBaseAmount('amount');
    calcExchangeAmount('amount');
  };

  const onChangeExchangeAmount = (e: React.FormEvent<HTMLInputElement>) => {
    setValue('exchangeAmount', +e.currentTarget.value || '', {
      shouldValidate: true,
    });
    setBaseAmount('exchangeAmount');
    calcExchangeAmount('exchangeAmount');
  };

  const onChangeToken = (token: string) => {
    const { exchangeToken } = getValues();
    if (token === exchangeToken) setValue('exchangeToken', '');
    setValue('token', token, { shouldValidate: true });
    calcExchangeAmount();
  };

  const onChangeExchangeToken = (exchangeToken: string) => {
    const { token } = getValues();
    if (exchangeToken === token) setValue('token', '');
    setValue('exchangeToken', exchangeToken, { shouldValidate: true });
    calcExchangeAmount();
  };

  const calcExchangeAmount = (base?: string) => {
    const { token, exchangeToken, amount, exchangeAmount } = getValues();
    const tokenPrice = prices[token];
    const exchangeTokenPrice = prices[exchangeToken];
    const baseTokenAmount = base ?? baseAmount;

    if (tokenPrice && exchangeTokenPrice && baseTokenAmount) {
      if (baseTokenAmount === 'amount') {
        const exchangeAmount = amount
          ? (amount * tokenPrice) / exchangeTokenPrice
          : '';
        setValue('exchangeAmount', exchangeAmount, { shouldValidate: true });
      }

      if (baseTokenAmount === 'exchangeAmount') {
        const amount = exchangeAmount
          ? (exchangeAmount * exchangeTokenPrice) / tokenPrice
          : '';
        setValue('amount', amount, { shouldValidate: true });
      }
    }
  };

  return (
    <div className="border border-1 border-primary shadow-md rounded-xl w-[calc(100vw-2rem)] max-w-96 p-3 md:p-6">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <FormField
              control={control}
              name="amount"
              rules={{ required: 'Amount is required' }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row justify-between items-center">
                    <span>You pay</span>
                    <SelectToken
                      selectedToken={getValues('token')}
                      setSelectedToken={onChangeToken}
                      balances={balances}
                    />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="0"
                        {...field}
                        onChange={onChangeAmount}
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Icons.swap className="size-6 text-primary self-center" />
            <FormField
              control={control}
              name="exchangeAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex flex-row justify-between items-center">
                    <span>You receive</span>
                    <SelectToken
                      selectedToken={getValues('exchangeToken')}
                      setSelectedToken={onChangeExchangeToken}
                      balances={balances}
                    />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="0"
                        {...field}
                        onChange={onChangeExchangeAmount}
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SwapAction
              submiting={submiting}
              balances={balances}
              {...getValues()}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SwapForm;
