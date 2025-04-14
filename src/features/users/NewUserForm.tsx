import React, { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"
import useTitle from "../../hooks/useTitle"
import { Button } from "react-bootstrap"

const USER_REGEX = /^[A-z]{3,20}$/
const EMAIL_REGEX = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {
    useTitle('techNotes: New User')

    const inputAvatarFileRef = React.useRef<HTMLInputElement>(null);

    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [email, setEmail] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(["Employee"])
    const [avatar, setAvatar] = React.useState<(string | ArrayBuffer | null)>('');
    const [avatarPreview, setAvatarPreview] = React.useState<(string | ArrayBuffer | null)>('');


    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setEmail('')
            setPassword('')
            setRoles([])
            setAvatar('')
            setAvatarPreview('')
            navigate('/dash/users')
        }
    }, [isSuccess, navigate])

    const createAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        let files: File[] = [];
        if (event.target.files?.length === 1) {
            const fileObj = event.target.files;
            files = Object.values(fileObj);
        }
        setAvatar('');
        setAvatarPreview('');

        files.forEach((file) => {
            const reader = new FileReader();
            // const arr: ((prevState: string[]) => string[]) | (string | ArrayBuffer)[] = [];
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(file);//load in buffer
        });
    };

    const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)
    const onEmailChanged = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
    const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

    const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setRoles(values)
    }
    const handleDeleteFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAvatarPreview('');
        setAvatar('')
    }


    const canSave = [roles.length, validUsername, validEmail, validPassword, avatar !== ''].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (canSave) {
            await addNewUser({ username, email, password, roles, avatar })
        }
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    })

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validEmailClass = !validEmail ? 'form__input--incomplete' : ''
    const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''


    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form__title-row">
                    <h2>New User</h2>
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
                <div>
                    <input
                        ref={inputAvatarFileRef}
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={createAvatarChange}
                        hidden
                    />
                </div>
                <div>
                    {avatarPreview && <img width='150px' src={avatarPreview as string} alt="Avatar Preview" />}
                </div>

                {!avatar && <Button onClick={() => { if (inputAvatarFileRef.current) inputAvatarFileRef.current.click() }} variant="success">
                    Загрузить картинку
                </Button>}
                {avatar && <Button onClick={handleDeleteFile} variant="danger">
                    Удалить картинку
                </Button>}
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[4-30 letters]</span></label>
                <input
                    className={`form__input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    // autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                <label className="form__label" htmlFor="email">
                    Email: <span className="nowrap">[xxx@yyy.zz]</span></label>
                <input
                    className={`form__input ${validEmailClass}`}
                    id="email"
                    name="email"
                    type="text"
                    // autoComplete="off"
                    value={email}
                    onChange={onEmailChanged}
                />

                <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size={3}
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
                <input type="submit" disabled={!canSave} value="Register" className="signUpBtn" />
            </form>
        </>
    )

    return content
}
export default NewUserForm