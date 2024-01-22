export function shortenAddress(
  address = '',
  charsStart = 6,
  charsEnd = 4
): string {
  if (!address) return '';
  return `${address.slice(0, charsStart)}...${address.slice(
    address.length - charsEnd
  )}`;
}
