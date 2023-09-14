import { IProductInfo } from "../types/IOrder";
import { IProduct } from "../types/IProduct";

export const selectedProductsToproductInfo = (selectedProducts: IProduct[]): IProductInfo[] => {
    const arr = [] as IProductInfo[]
    for (let key in selectedProducts) {
        const obj = { product: selectedProducts[key].id, count: selectedProducts[key].count }
        arr.push(obj as unknown as IProductInfo)
    }
    return arr;
}