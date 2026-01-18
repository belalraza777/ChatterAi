import React, { useState } from 'react'
import './chat.css';
import Logout from '../auth/logout';

export default function UserInfo({ user,loadThreads }) {
    const [showLogout, setShowLogout] = useState(false);
    function handleLogout() {
        setShowLogout(!showLogout);
    }
    return (
        <div className='profile-div' onClick={handleLogout}>
            <p><i class="fa-solid fa-user"></i>  <b>{user.username}</b></p>
            {showLogout ? <Logout loadThreads={loadThreads} /> : ""}
        </div>
    )
}
 