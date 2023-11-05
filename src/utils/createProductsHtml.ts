
import { ICurrency } from "../types/ICurrency";
import { IProductInfo } from "../types/IOrder";
import { IProduct } from "../types/IProduct";

export const createProductsHtmlUl = (items: IProduct[], currentCurrency: ICurrency) => {

  const parts = [];
  for (const item of items) {
    parts.push(`<li>${item.title}, price:${currentCurrency.code}${item.price}*${currentCurrency.value} ,count:${item.count}ps</li>`);
  }
  const innerValue = parts.join(' ');
  return `<ul>${innerValue}</ul>`;
};

export const createProductsHtmlTable = (items: IProductInfo[], totalPrice: number, currentCurrency: ICurrency) => {

  const parts = [];
  let totalCount = 0;
  for (const item of items) {
    if (item?.count) totalCount += item?.count;
    parts.push(`<tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.product.title}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.count}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${(item.product.price * currentCurrency.value).toFixed(1)}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${(item.product.price * (item?.count ? item.count : 1) * currentCurrency.value).toFixed(1)}</td>
    </tr>`);
  }
  const innerValue = parts.join(' ');
  return `
    <table style="border: 1px solid #ddd; border-collapse: collapse; width: 100%;"}>
      <thead>
        <tr style="background: #f9f9f9;">
          <th style="padding: 8px; border: 1px solid #ddd;">Наименование</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Кол-во,шт</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Цена,${currentCurrency.code}</th>
          <th style="padding: 8px; border: 1px solid #ddd;">Сумма,${currentCurrency.code}</th>
        </tr>
      </thead>
      <tbody>
      ${innerValue}
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">Итого:</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${totalCount}</td>
          <td></td>
          <td style="padding: 8px; border: 1px solid #ddd;">${(totalPrice * currentCurrency.value).toFixed(1)}</td>
        </tr>
      </tbody>
    </table>`;
};
