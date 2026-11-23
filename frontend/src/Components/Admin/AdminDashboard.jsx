import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../axios/api.js';

export function AdminDashboard(){
    const [user, setUser] = useState({});
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if(!user) return <h1>Loading...</h1>

    async function handleLogout(){
        await api.delete('/logout',{
            data:{
                token: userInfo.rtoken
            }
        })
        .then((res) =>{
            console.log(res.data);
            localStorage.removeItem('userInfo');
            window.location.href='/login'
        })
        .catch((error) => {
            console.error('error:', error);
            
        })


    }

    useEffect(() => {
        api.get(`/user/${userInfo.id}`)
        .then((res) => {
            setUser(res.data.user)
            console.log(res.data.user);
            
        })
        .catch((error) => {
            console.error('error:', error);
        })
    },[])
    return(
        <>
        <h2>Welcome {user.name}</h2>
        <Link to='/admin/manage-users'>
        <button>
        Manage Users
        </button>
        </Link>
        <input type="button" value="Logout" onClick={handleLogout} />
        </>
    )
}