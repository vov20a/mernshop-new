import React, { useState, useEffect } from "react"
import { useAddNewCurrencyMutation } from "./currenciesApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import useTitle from "../../hooks/useTitle"
import { useActions } from "../../hooks/actions"
import { ICurrency } from "../../types/ICurrency"
import { useSelector } from "react-redux"


const TITLE_REGEX = /^[A-z]{3,20}$/
const CODE_REGEX = /^\W{1}$/
const VALUE_REGEX = /^(0|[1-9]\d{0,2})(\.\d+)?$/

const NewCurrencyForm = () => {
  useTitle('New Currency Form')

  const [addNewCurrency, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewCurrencyMutation()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [validTitle, setValidTitle] = useState(false)
  const [code, setCode] = useState('')
  const [validCode, setValidCode] = useState(false)
  const [value, setValue] = useState('')
  const [validValue, setValidValue] = useState(false)
  const [base, setBase] = useState(false)


  useEffect(() => {
    setValidTitle(TITLE_REGEX.test(title))
  }, [title])

  useEffect(() => {
    setValidCode(CODE_REGEX.test(code))
  }, [code])

  useEffect(() => {
    setValidValue(VALUE_REGEX.test(value))
  }, [value])

  useEffect(() => {
    if (isSuccess) {
      setTitle('')
      setCode('')
      setValue('')
      setBase(false)
      navigate('/dash/currencies')
    }
  }, [isSuccess, navigate])

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const onCodeChanged = (e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)
  const onValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
  const onBaseChanged = (e: React.ChangeEvent<HTMLSelectElement>) => setBase(e.target.value === 'false' ? false : true)

  const canSave = [validTitle, validCode, validValue].every(Boolean) && !isLoading;

  const { setCurrencies } = useActions()

  const onSaveCurrencyClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (canSave) {
      await addNewCurrency({ title, code, value, base })
    }
  }

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !validTitle ? 'form__input--incomplete' : ''
  const validCodeClass = !validCode ? 'form__input--incomplete' : ''
  const validValueClass = !validValue ? 'form__input--incomplete' : ''

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveCurrencyClicked}>
        <div className="form__title-row">
          <h2>New Currency</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
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
          value={base.toString()}
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

export default NewCurrencyForm