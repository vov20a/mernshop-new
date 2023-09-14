import { useEffect, useState } from 'react';
import Select, { ActionMeta } from 'react-select';
import { defaultSelectArray } from '../utils/defaultSelectArray';
import { optionToProduct } from '../utils/optionToProductIds';

// type Option = { value: string; label: string };
// type SelectProps = {
//     selected: Option | null;
//     options: Option[];
//     placeholder?: string;
//     mode?: 'rows' | 'cells';
//     status?: 'default' | 'invalid';
//     onChange?: (selected: Option['value']) => void;
//     onClose?: () => void;
// };
// type ProductInfo={
//   value:String;
//   title:string;
// }

const SelectProducts = ({ products, selectedProducts, onChangeValue, onOpenCountModal }) => {
  const [selectedOption, setSelectedOption] = useState({ option: [] });
  const [defaultSelect] = useState(defaultSelectArray(products, selectedProducts));

  const options = products.map((product) => {
    return { value: product.id, label: product.title, img: product.productImg };
  });

  useEffect(() => {
    const productInfo = optionToProduct(selectedOption, selectedProducts);
    onChangeValue(productInfo);
  }, [selectedOption]);

  const handleChange = (option) => {
    setSelectedOption({ option });
    // console.log(option.length, selectedOption.option.length);
    if (option.length <= selectedOption.option.length) {
      onOpenCountModal(false);
    } else onOpenCountModal(true);
  };

  return (
    <Select
      isOptionSelected={selectedOption}
      isMulti
      defaultValue={defaultSelect}
      onChange={handleChange}
      options={options}
    />
  );
};

export default SelectProducts;
