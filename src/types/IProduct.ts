import { ICategory } from "./ICategory";

export interface IProduct {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    category: ICategory;
    productImg?: string;
    images?: [
        {
            public_id: string,
            url: string,
        },
    ];
    reviews?: [
        {
            _id?: string,
            user: string,
            name: string,
            rating: number,
            comment: string,
        },
    ],
    Stock?: number,
    rating: number;
    price: number;
    createdAt: Date;
    updatedAt: Date;
    count?: number;
}
export interface ICartProduct extends IProduct {
    count: number;
}
// export interface IProductForm {

//     title: string;
//     description: string;
//     category: string;
//     productImg?: string;
//     images: [];
//     rating: number;
//     price: number;

// }
// export interface IProductFormUpdate {
//     id: string;
//     title: string;
//     description: string;
//     category: string;
//     productImg?: string;
//     file?: File;
//     rating: number;
//     price: number;

// }