import { useState, useEffect } from "react"
import { useUpdateCurrencyMutation, useDeleteCurrencyMutation } from "./currenciesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ICurrency } from "../../types/ICurrency"
import { useActions } from "../../hooks/actions"


const TITLE_REGEX = /^[A-z]{3,20}$/
const CODE_REGEX = /^\W{1}$/
const VALUE_REGEX = /^(0|[1-9]\d{0,2})(\.\d+)?$/

interface EditCurrencyFormProps {
    currency: ICurrency | undefined;
}

const EditCurrencyForm = ({ currency }: EditCurrencyFormProps) => {

    const [updateCurrency, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateCurrencyMutation()

    const [deleteCurrency, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteCurrencyMutation()

    const navigate = useNavigate()

    const [title, setTitle] = useState(currency?.title)
    const [validTitle, setValidTitle] = useState(false)
    const [code, setCode] = useState(currency?.code)
    const [validCode, setValidCode] = useState(false)
    const [value, setValue] = useState(currency?.value.toString())
    const [validValue, setValidValue] = useState(false)
    const [base, setBase] = useState(currency?.base)

    useEffect(() => {
        setValidTitle(TITLE_REGEX.test(title ?? ''))
    }, [title])

    useEffect(() => {
        setValidCode(CODE_REGEX.test(code ?? ''))
    }, [code])

    useEffect(() => {
        setValidValue(VALUE_REGEX.test(value ?? '0'))
    }, [value])

    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setCode('')
            setValue('')
            setBase(false)
            //возвращаемся в  PreCurrencyList
            navigate('/dash/currencies')
        }
    }, [isSuccess, navigate])
    useEffect(() => {
        if (isDelSuccess) {
            setTitle('')
            setCode('')
            setValue('')
            setBase(false)
            //возвращаемся в CurrencyList, а не PreCurrencyList
            navigate('/dash/currencies/value')
        }
    }, [isDelSuccess, navigate])

    const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
    const onCodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)
    const onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
    const onBaseChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setBase(e.target.value === 'false' ? false : true)

    const { deleteCurrency: deleteCurrentCurrency } = useActions();

    const onSaveCurrencyClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await updateCurrency({ id: currency?.id, title, code, value, base })
    }

    const onDeleteCurrencyClicked = async () => {

        if (currency?.id) await deleteCurrency({ id: currency.id })
        if (currency) deleteCurrentCurrency(currency)
    }

    const canSave = [validTitle, validCode, validValue].every(Boolean) && !isLoading;

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validTitleClass = !validTitle ? 'form__input--incomplete' : ''
    const validCodeClass = !validCode ? 'form__input--incomplete' : ''
    const validValueClass = !validValue ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''

    const content = (
        <>
            <p className={errClass}>{errContent}</p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>New Currency</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onSaveCurrencyClicked}
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteCurrencyClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    // autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label className="form__label" htmlFor="ecodeail">
                    Code: <span className="nowrap">[symbol of currency]</span></label>
                <input
                    className={`form__input ${validCodeClass}`}
                    id="code"
                    name="code"
                    type="text"
                    value={code}
                    onChange={onCodeChanged}
                />

                <label className="form__label" htmlFor="value">
                    Value: <span className="nowrap">[decimal symbols]</span></label>
                <input
                    className={`form__input ${validValueClass}`}
                    id="value"
                    name="value"
                    type="text"
                    value={value}
                    onChange={onValueChanged}
                />

                <label className="form__label" htmlFor="base">
                    ASSIGNED BASE:</label>
                <select
                    id="base"
                    name="base"
                    size={2}
                    value={base?.toString() ?? ''}
                    onChange={onBaseChanged}
                >
                    <option value={false.toString()}> {false.toString()}</option >
                    <option value={true.toString()}> {true.toString()}</option >
                </select>

            </form>
        </>
    )
    return content
}

export default EditCurrencyForm