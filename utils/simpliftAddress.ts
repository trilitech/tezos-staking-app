export const simplifyAddress = (address: string) =>
  address.slice(0, 8) + '...' + address.slice(-4)
