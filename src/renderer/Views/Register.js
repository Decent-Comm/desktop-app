import React, { useContext, useRef } from 'react';

import { df_bg_container } from '../Styles/Global.module.css';
import styles from '../Styles/Register.module.css';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import NextPlanSharpIcon from '@mui/icons-material/NextPlanSharp';
import CameraSharpIcon from '@mui/icons-material/CameraSharp';
import { context } from '../Context';



function Register() {

    const data = useContext(context);

    const ppRef = useRef(null);
    const ppInputRef = useRef(null);

    const handlePPClick = () => {
        ppInputRef.current.click();
    }

    const handlePPUpload = (e) => {
        console.log(e.currentTarget.files)
        if (e.currentTarget.files) {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                console.log(e);
                ppRef.current.style.backgroundImage = `url(${e.target.result})`
            };

            reader.readAsDataURL(e.currentTarget.files.item(0))

        }
        // ppRef.current.style.backgroundImage = `url(${URL.createObjectURL(e.currentTarget.files.item(0))})`;
    }


    return (
        <div className={df_bg_container}>
            <div className={styles.box}>
                <div ref={ppRef} onClick={handlePPClick} className={styles.profile_picture}>
                    <CameraSharpIcon className={styles.cameraIcon} fontSize='large' />
                    <span>Upload</span>
                </div>
                <input ref={ppInputRef} type="file" hidden onChange={handlePPUpload} />
                <TextField variant="standard" label='Name' color="primary" />
                <TextField variant="standard" label='Surname' color="primary" />
                <TextField

                    sx={{ width: '30ch', mt: 2 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">ID:</InputAdornment>,
                    }}
                    variant="outlined" color="primary" disabled size='small' value={data.peerId} />
                <NextPlanSharpIcon className={styles.forward_icon_btn} fontSize='large' tabIndex={0} />
            </div>
        </div>
    )
}

export default Register
