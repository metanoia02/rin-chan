export type ShopContent = {
  stock: ShopRow[];
};

export type ShopRow = {
  name: string;
  value: number;
  quantity: number;
};
