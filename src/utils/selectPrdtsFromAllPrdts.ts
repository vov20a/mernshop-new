import { ISipmleProductsInfo } from "../types/IOrder";
import { IProduct } from "../types/IProduct";


export const selectPrdtsFromAllPrdts = (products: IProduct[], simpleProducts: ISipmleProductsInfo[]): IProduct[] => {
    const arr = [] as IProduct[];

    for (let i = 0; i < products.length; ++i) {
        for (let j = 0; j < simpleProducts.length; ++j) {
            if (products[i].id === simpleProducts[j].value) {
                //products[i].count-not writable,делаем его копию и меняем count
                //JSON.parse(JSON.stringify(products[i]))-создает копию object
                const prdt = JSON.parse(JSON.stringify(products[i]))
                prdt.count = simpleProducts[j].count
                arr.push(prdt)
            }
        }
    }

    return arr;
}