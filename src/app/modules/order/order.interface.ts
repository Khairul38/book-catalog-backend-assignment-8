export type ICreateOrder = {
  orderedBooks: {
    bookId: string;
    quantity: number;
  }[];
};
