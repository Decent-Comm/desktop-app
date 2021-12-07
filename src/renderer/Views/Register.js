import React, { useContext, useEffect, useRef, useState } from 'react';

import { df_bg_container } from '../Styles/Global.module.css';
import styles from '../Styles/Register.module.css';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// import Button from '@mui/material/Button';

import NextPlanSharpIcon from '@mui/icons-material/NextPlanSharp';
import CameraSharpIcon from '@mui/icons-material/CameraSharp';
import { context } from '../Context';



function Register() {

    const data = useContext(context);

    const [ppUploaded, setPPUploaded] = useState(false);

    const nameInputRef = useRef(null);
    const surnameInputRef = useRef(null);

    const ppRef = useRef(null);
    const ppInputRef = useRef(null);

    const handlePPClick = () => {
        console.log(ppInputRef.current.files[0]);
        ppInputRef.current.click();
    }

    const handlePPUpload = async (e) => {
        console.log(e.currentTarget.files);
        // console.log();
        const currentFile = e.currentTarget.files[0];
        if (currentFile) {
            const reader = new FileReader();
            reader.onloadend = (e) => {
                console.log(e);
                console.log(e.target.result);
                ppRef.current.style.backgroundImage = `url(${e.target.result})`;
                setPPUploaded(true);

            };
            reader.readAsDataURL(e.currentTarget.files[0]);
            // reader.readAsArrayBuffer(e.currentTarget.files[0]);
            console.log(new Blob([await currentFile.arrayBuffer()], { type: currentFile.type }))
            // new Blob('', {}).arrayBuffer().then(a=>a);
        }
        else {
            if (ppUploaded) {
                ppRef.current.style.backgroundImage = "none";
                setPPUploaded(false);
            }
        }

        //! not allowed
        // ppRef.current.style.backgroundImage = `url(${URL.createObjectURL(e.currentTarget.files.item(0))})`;
    }

    const handleNextIconClick = async () => {
        console.log(ppInputRef.current.files[0]);
        let profileData = {
            profilePicBuffer: await ppInputRef.current.files[0].arrayBuffer(), //new Blob([await ppInputRef.current.files[0].arrayBuffer()], { type: ppInputRef.current.files[0].type }).slice(),
            name: nameInputRef.current.value,
            surname: surnameInputRef.current.value,
        }
        console.log(profileData);

        bridge.peerAPI.registerProfileInfo({ ...profileData });
    }

    return (
        <div className={df_bg_container}>
            <div className={styles.box}>
                <div ref={ppRef} onClick={handlePPClick} className={styles.profile_picture}>
                    <CameraSharpIcon hide={`${ppUploaded}`} className={styles.cameraIcon} fontSize='large' />
                    <span>{ppUploaded ? "Change" : "Upload"}</span>
                </div>
                <input ref={ppInputRef} type="file" hidden onChange={handlePPUpload} />
                <TextField inputRef={nameInputRef} variant="standard" label='Name' color="primary" />
                <TextField inputRef={surnameInputRef} variant="standard" label='Surname' color="primary" />
                <TextField
                    sx={{ width: '30ch', mt: 2 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">ID:</InputAdornment>,
                    }}
                    variant="outlined" color="primary" disabled size='small' value={data.peerId} />
                <button onClick={handleNextIconClick} className={styles.forward_icon_btn}>
                    <NextPlanSharpIcon fontSize='large' />
                </button>
            </div>
        </div>
    )
}

export default Register
