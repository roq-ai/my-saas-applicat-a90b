const mapping: Record<string, string> = {
  'price-histories': 'price_history',
  products: 'product',
  stores: 'store',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
