
import { useGetOneCategoryQuery } from '../features/categories/categoriesApiSlice';
import { PulseLoader } from 'react-spinners';
import LastHome from './LastHome';


const Home = () => {

    // const {
    //     data: category,
    //     isSuccess, isLoading, isError, error
    // } = useGetOneCategoryQuery({ title: "Cute Kittens" })
    const {
        data: categoryCarousel,
        isSuccess: isSuccessCarousel, isLoading: isLoadingCarousel, isError: isErrorCarousel, error: errorCarousel
    } = useGetOneCategoryQuery({ title: "Strange Stuff" })
    // console.log(category?.ids[0])
    let content;
    if (isLoadingCarousel) content = <PulseLoader color={'#000'} className="pulse-loader" />;

    if (isErrorCarousel) content = <p className="errmsg">{errorCarousel?.data?.message}</p>;

    if (isSuccessCarousel) {

        content = (
            <LastHome catCarousel={categoryCarousel.ids[0] as string} />
        );

    }
    return <>{content}</>;
}
export default Home