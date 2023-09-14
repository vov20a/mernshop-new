import { ISipmleProductsInfo } from "../types/IOrder";
import { IProduct } from "../types/IProduct";

export const defaultSelectArray = (products: IProduct[], selectedProducts: ISipmleProductsInfo[]): { value: string | undefined, label: string }[] => {
  const arr = [];
  for (let i = 0; i < products.length; ++i) {
    for (let j = 0; j < selectedProducts.length; ++j) {
      if (selectedProducts[j].value === products[i].id) {
        arr.push({ value: products[i].id, label: products[i].title, img: products[i].productImg });
      }
    }
  }
  return arr;
};
//{ value: '6489d0bb56b6e083e9583cf0', label: "Product4" ,img: products[i].productImg }
//{ value: '6489d2a15dcf7ffe5894dc51', label: "Product5",img : products[i].productImg }
