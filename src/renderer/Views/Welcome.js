import React from 'react';

import { df_bg_container } from '../Styles/Global.module.css';
import styles from '../Styles/Welcome.module.css';
import { useNavigate } from "react-router-dom";

// import icon from '../../assets/icons/decentralized-network-100.svg';

// import Button from '@mui/material/Button';

function Welcome() {
    const navigate = useNavigate();

    let clicked = false;
    const handleWelcomeBtnClick = (e) => {
        if (!clicked) {
            clicked = true;
            e.currentTarget.setAttribute("clicked", "true");
            e.currentTarget.innerHTML = "";

            //Todo: Add animation before redirection
            // setTimeout(() => navigate("/register"), 1000);
        }
    }

    return (
        <div className={df_bg_container}>
            <div className={styles.icon_container}>
                <button className={styles.welcome_btn} clicked="false" onClick={handleWelcomeBtnClick}><span>Welcome to Decent</span></button>
            </div>
        </div>
    )
}

export default Welcome
