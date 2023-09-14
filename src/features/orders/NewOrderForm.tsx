import { useState, useEffect } from "react"
import { useAddNewOrderMutation } from "./ordersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { IProduct } from "../../types/IProduct"
import { IProductInfo, ISipmleProductsInfo } from "../../types/IOrder"
import { IUser } from "../../types/IUserType"
import SelectProducts from "../../components/SelectProducts"
import { Button } from "react-bootstrap"
import CountProductModal from "../../components/CountProductModal"
import { selectPrdtsFromAllPrdts } from "../../utils/selectPrdtsFromAllPrdts"
import { selectedProductsToproductInfo } from "../../utils/selectedProductsToProductInfo"


interface NewOrderFormProps {
    products: IProduct[];
    users: IUser[];
}
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const PHONE_REGEX = /^(\+7|8)( |-)?\d{3}( |-)?\d{3}( |-)?\d{2}( |-)?\d{2}$/

const NewOrderForm = ({ products, users }: NewOrderFormProps) => {
    // console.log('first', products)


    const [addNewOrder, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewOrderMutation()

    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [phone, setPhone] = useState('')
    const [validPhone, setValidPhone] = useState(false)
    const [userId, setUserId] = useState('')
    const [totalPrice, setTotalPrice] = useState(0);
    const [isOpenCount, setOpenCount] = useState(false);

    //array of {product + count}[]
    const [productsInfo, setProductsInfo] = useState<IProductInfo[]>([])
    //array of {value,title}[]
    const [simpleProducts, setSimpleProducts] = useState<ISipmleProductsInfo[]>([])
    // console.log(simpleProducts)

    useEffect(() => {
        const selectedProducts = selectPrdtsFromAllPrdts(products, simpleProducts)
        setProductsInfo(selectedProductsToproductInfo(selectedProducts));

        const total = selectedProducts.reduce((sum: number, item: IProduct) => {
            if (item?.count) return sum += item.price * item.count;
            else return sum += item.price;
        }, 0)
        setTotalPrice(total)
    }, [simpleProducts])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone))
    }, [phone])

    useEffect(() => {

        if (isSuccess) {
            setFullName('')
            setEmail('')
            setPhone('')
            setUserId('')
            setProductsInfo([])
            setSimpleProducts([])
            setTotalPrice(0)
            setOpenCount(false)
            navigate('/dash/orders')
        }

    }, [isSuccess, navigate])

    const onFullNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)
    const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const onPhoneChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)
    const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setUserId(e.target.value)
    const onProductIdChanged = (options: ISipmleProductsInfo[]) => setSimpleProducts(options ?? []);


    const canSave = [fullName, email, phone, userId, totalPrice,].every(Boolean) && Boolean(productsInfo.length) && !isLoading

    const onSaveOrderClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (canSave) {
            await addNewOrder({ fullName, email, phone, user: userId, totalPrice, productsInfo: productsInfo })
        }
    }

    const onClickOpen = () => {
        if (isOpenCount === false) setOpenCount(true)
    }

    const optionsUsers = users.map((user: IUser) => {
        return (
            <option key={user.id} value={user.id}>
                {user.username}
            </option>
        );
    })

    const errClass = (isError) ? "errmsg" : "offscreen"
    const validFullNameClass = !fullName ? "form__input--incomplete" : ''
    const validEmailClass = !validEmail ? "form__input--incomplete" : ''
    const validPhoneClass = !validPhone ? "form__input--incomplete" : ''
    const validTotalPriceClass = !totalPrice ? "form__input--incomplete" : ''

    const errContent = error?.data?.message ?? ''



    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Add New Order</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveOrderClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>


                <label className="form__label" htmlFor="order-fullName">
                    FullName:</label>
                <input
                    className={`form__input ${validFullNameClass}`}
                    id="order-fullName"
                    name="fullName"
                    type="text"
                    autoComplete="off"
                    value={fullName}
                    onChange={onFullNameChanged}
                />

                <label className="form__label" htmlFor="order-email">
                    Email: <span className="nowrap">[xxx@yyy.zz]</span></label>
                <input
                    className={`form__input  ${validEmailClass}`}
                    id="order-email"
                    name="email"
                    type="text"
                    // autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />
                <label className="form__label" htmlFor="phone">
                    Phone: <span className="nowrap">[+7|8 xxx xxx xx xx]</span></label>
                <input
                    className={`form__input ${validPhoneClass}`}
                    id="phone"
                    name="phone"
                    type="text"
                    value={phone}
                    onChange={onPhoneChanged}
                />
                <label className="form__label" htmlFor="totalPrice">
                    Total Price,$:</label>
                <input
                    className={`form__input ${validTotalPriceClass}`}
                    id="totalPrice"
                    name="totalPrice"
                    type="number"
                    value={totalPrice}
                    onChange={() => { }}
                />
                <label className="form__label form__checkbox-container" htmlFor="order-products">
                    CHOOSE PRODUCTS:</label>
                <SelectProducts key={1}
                    products={products}
                    selectedProducts={simpleProducts} onChangeValue={onProductIdChanged} onOpenCountModal={setOpenCount} />
                {isOpenCount ? <CountProductModal isVisible={isOpenCount} setVisible={setOpenCount}
                    simpleProducts={simpleProducts} setSimpleProducts={setSimpleProducts} />
                    : <></>}
                <Button onClick={onClickOpen}>Watch Count</Button>
                <div className="form__row">
                    <div className="form__divider" style={{ marginBottom: 10 }}>
                        <label className="form__label form__checkbox-container" htmlFor="username">
                            ASSIGNED TO:</label>
                        <select
                            id="username"
                            name="username"
                            className="form__select"
                            value={userId}
                            onChange={onUserIdChanged}
                        >
                            <option value='' disabled>Select...</option>
                            {optionsUsers}
                        </select>
                    </div>
                </div>
            </form>

        </>
    )

    return content
}

export default NewOrderForm