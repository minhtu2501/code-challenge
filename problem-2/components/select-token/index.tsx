import React, { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import useTokenStore from '@/stores/token-store';
import Image from 'next/image';
import { BASE_TOKEN_IMAGE_URL } from '@/constants';
import { ObjectPrice } from '@/types';
import { useAppContext } from '@/context';

interface SelectTokenProps {
  selectedToken: any;
  setSelectedToken: (selectedToken: any) => void;
  balances: ObjectPrice;
}

const SelectToken: React.FC<SelectTokenProps> = ({
  balances,
  selectedToken,
  setSelectedToken,
}) => {
  const { account } = useAppContext();

  const [open, setOpen] = useState(false);
  const tokens = useTokenStore((state) => state.tokens);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
        >
          {selectedToken ? (
            <span className="flex gap-2">
              <Image
                src={`${BASE_TOKEN_IMAGE_URL}/${selectedToken}.svg`}
                width={30}
                height={30}
                alt={selectedToken}
              />
              <span className="flex flex-col items-start">
                <span>{selectedToken}</span>
                {account && (
                  <span className="text-xs">
                    Balance: {balances[selectedToken] || '-'}
                  </span>
                )}
              </span>
            </span>
          ) : (
            'Select token'
          )}
          <Icons.chevronUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder="Search token" />
          <CommandEmpty>No token found.</CommandEmpty>
          <CommandGroup className="h-44 overflow-y-auto">
            {tokens.map((token) => (
              <CommandItem
                key={token}
                value={token}
                onSelect={() => {
                  setSelectedToken(token);
                  setOpen(false);
                }}
                className={
                  selectedToken === token ? 'text-muted-foreground' : ''
                }
              >
                <span className="flex gap-2">
                  <Image
                    src={`${BASE_TOKEN_IMAGE_URL}/${token}.svg`}
                    width={30}
                    height={30}
                    alt={token}
                  />
                  <span className="flex flex-col">
                    <span>{token}</span>
                    {account && (
                      <span className="text-xs">
                        Balance: {balances[token] || '-'}
                      </span>
                    )}
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectToken;
