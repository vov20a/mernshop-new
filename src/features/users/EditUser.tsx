import { useParams } from 'react-router-dom'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from './usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import { IUser } from '../../types/IUserType'

const EditUser = () => {
    useTitle('Edit User')

    const { id } = useParams()

    const { user, isLoading, isSuccess, isError, error } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data, isLoading, isSuccess, isError, error }) => ({
            user: data?.entities[id ?? ''],
            isLoading, isSuccess, isError, error,
        }),
    })

    let content;

    if (isLoading) return <PulseLoader color={"#000"} className='pulse-loader' />
    if (isError) content = <p className="errmsg">{error?.data?.message}</p>;
    if (isSuccess) content = <EditUserForm user={user} />

    return <>{content}</>
}
export default EditUser