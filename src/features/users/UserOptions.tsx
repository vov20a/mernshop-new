import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom'
import { SpeedDial, SpeedDialAction } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { useActions } from '../../hooks/actions';
import ProfileImg from '../../Profile.png'
import { Dashboard } from '@mui/icons-material';
import { Person } from '@mui/icons-material';
import { ExitToApp } from '@mui/icons-material';
import { ListAlt } from '@mui/icons-material';
import { ShoppingCart } from '@mui/icons-material';

import './userOptions.css'
import { useSendLogoutMutation } from '../auth/authApiSlice';
import { useAppSelector } from '../../hooks/redux';


const UserOptions = () => {
    const navigate = useNavigate()

    const { username, status, avatarUrl, } = useAuth();

    const [sendLogout,] = useSendLogoutMutation();
    const { removeProductAll } = useActions()

    const { ids, entities, totalPrice } = useAppSelector(state => state.cart)

    const [open, setOpen] = useState(false);

    const options = [
        { icon: <ListAlt />, name: 'Orders', func: orders },
        { icon: <Person />, name: 'Profile', func: account },
        {
            icon: <ShoppingCart style={{ color: ids.length > 0 ? 'tomato' : 'unset' }} />,
            name: `Cart(${ids.length})`,
            func: cart,
        },
        { icon: <ExitToApp />, name: 'Logout', func: logoutUser },
    ];

    if (status === 'Admin') {
        options.unshift({
            icon: <Dashboard />,
            name: 'Dashboard',
            func: dashboard,
        });
    }

    function dashboard() {
        navigate('/dash');
    }

    function orders() {
        navigate('/orders');
    }
    function account() {
        navigate('/account');
    }
    function cart() {
        navigate('/cart/my');
    }
    async function logoutUser() {
        await sendLogout({ username });
        removeProductAll();
        navigate('/login')
    }
    return (
        <>
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: '11' }}
                open={open}
                direction="down"
                className="speedDial"
                icon={
                    <img
                        className="speedDialIcon"
                        src={avatarUrl ? avatarUrl : ProfileImg}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}
            </SpeedDial>
            <Outlet />
        </>

    )
}

export default UserOptions