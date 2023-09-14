import NewCategoryForm from './NewCategoryForm';
import { useGetCategoriesQuery } from './categoriesApiSlice';
import PulseLoader from 'react-spinners/PulseLoader';
import useTitle from '../../hooks/useTitle';
import { ICategory } from '../../types/ICategory';

const NewCategory = () => {
  useTitle('New Category');

  const { categories, isLoading } = useGetCategoriesQuery('categoriesList', {
    selectFromResult: ({ data, isLoading }) => ({
      categories: data?.ids.map((id) => data?.entities[id]) as ICategory[],
      isLoading
    }),
  });

  if (isLoading) return <PulseLoader color={'#000'} className="pulse-loader" />;

  const content = <NewCategoryForm categories={categories} />;

  return content;
};
export default NewCategory;
