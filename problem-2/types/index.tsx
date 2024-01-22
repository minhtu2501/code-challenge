export type TokenInfo = {
  symbol: string;
  displayName: string;
};

export interface TokenPrice {
  currency: string;
  price: number;
}

export interface ObjectPrice {
  [key: string]: number;
}

export interface IFormInput {
  amount: number | '';
  exchangeAmount: number | '';
  token: string;
  exchangeToken: string;
}
