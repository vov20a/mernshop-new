import NewProductForm from './NewProductForm'
import { useGetCategoriesQuery } from '../categories/categoriesApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import { ICategory } from '../../types/ICategory'

const NewProduct = () => {
    useTitle('New Product')

    const { categories, isLoading } = useGetCategoriesQuery("categoriesList", {
        selectFromResult: ({ data, isLoading }) => ({
            categories: data?.ids.map(id => data?.entities[id]) as ICategory[],
            isLoading
        }),
    })

    if (isLoading) return <PulseLoader color={"#000"} className='pulse-loader' />

    const content = <NewProductForm categories={categories} />

    return content
}
export default NewProduct;