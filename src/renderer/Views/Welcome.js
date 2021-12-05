import React from 'react';
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
            e.target.setAttribute("clicked", "true");
            e.target.innerText = "";

            //Todo: Add animation before redirection
            setTimeout(() => navigate("/home"), 1000);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.icon_container}>
                <button className={styles.welcome_btn} clicked="false" onClick={handleWelcomeBtnClick}>Welcome to Decent</button>
            </div>
        </div>
    )
}

export default Welcome
