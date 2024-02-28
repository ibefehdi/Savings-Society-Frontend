import { jwtDecode } from 'jwt-decode'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
const Home = () => {
    const userData = JSON.parse(sessionStorage.getItem('userDetails'));
    useEffect(() => {

        console.log(userData);
    }, [userData])
    return (
        <div>Home</div>
    )
}

export default Home