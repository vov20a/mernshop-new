export const optionToProduct = (selectedOption, selectedProducts) => {
  //continue to select
  const arr = [];
  if (selectedOption?.option.length && selectedProducts.length) {
    for (let i = 0; i < selectedOption?.option.length; ++i) {
      for (let j = 0; j < selectedProducts.length; ++j) {
        if (selectedOption.option[i].value === selectedProducts[j].value) {
          arr.push({
            value: selectedOption.option[i].value,
            title: selectedOption.option[i].label,
            img: selectedOption.option[i].img,
            count: selectedProducts[j].count,
          });
          break;
        }
      }
      if (!arr[i]) {
        arr.push({
          value: selectedOption.option[i].value,
          title: selectedOption.option[i].label,
          img: selectedOption.option[i].img,
          count: 1,
        });
      }
    }
    return arr;
  }
  //start to select
  if (selectedOption?.option.length === 1 && !selectedProducts.length) {
    const arr = [];
    arr.push({
      value: selectedOption.option[0].value,
      title: selectedOption.option[0].label,
      img: selectedOption.option[0].img,
      count: 1,
    });
    return arr;
  }
};
