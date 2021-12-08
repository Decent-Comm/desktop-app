import React, { useContext, useEffect, useRef, useState } from 'react';

import { df_bg_container } from '../Styles/Global.module.css';
import styles from '../Styles/Register.module.css';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
// import Button from '@mui/material/Button';

import NextPlanSharpIcon from '@mui/icons-material/NextPlanSharp';
import CameraSharpIcon from '@mui/icons-material/CameraSharp';
import { context } from '../Context';

import compressor from "browser-image-compression";

function Register() {

    const { peer, userDB } = useContext(context);
    const navigate = useNavigate();

    const [uploadedPP, setUploadedPP] = useState(undefined);

    const nameInputRef = useRef(null);
    const surnameInputRef = useRef(null);

    const ppRef = useRef(null);
    const ppInputRef = useRef(null);

    const handlePPClick = () => {
        ppInputRef.current.click();
    }

    const handlePPUpload = async (e) => {
        const currentFile = e.currentTarget.files[0];
        if (currentFile) {
            const compressedFile = await compressor(currentFile, {
                maxSizeMB: 0.05,
                maxWidthOrHeight: 200,
                // useWebWorker: true => requires 'worker-src' as Content Security Policy
                useWebWorker: false
            });

            const reader = new FileReader();
            reader.onloadend = async (e) => {
                ppRef.current.style.backgroundImage = `url(${e.target.result})`;
                setUploadedPP(await compressedFile.arrayBuffer());
            };
            reader.readAsDataURL(compressedFile);
        }
        else {
            if (uploadedPP) {
                ppRef.current.style.backgroundImage = "none";
                setUploadedPP(undefined);
            }
        }

        //! not allowed
        // ppRef.current.style.backgroundImage = `url(${URL.createObjectURL(e.currentTarget.files.item(0))})`;
    }

    const handleNextIconClick = () => {
        let profileData = {
            ppBuffer: uploadedPP, // File instance of Blob or new Blob([await ppInputRef.current.files[0].arrayBuffer()], { type: ppInputRef.current.files[0].type }).slice(),
            name: nameInputRef.current.value,
            surname: surnameInputRef.current.value,
        }
        console.log(profileData);

        bridge.peerAPI.updateProfileInfo(profileData, userDB.setState);
        navigate('/home');
    }

    return (
        <div className={df_bg_container}>
            <div className={styles.box}>
                <div ref={ppRef} onClick={handlePPClick} className={styles.profile_picture}>
                    <CameraSharpIcon hide={`${uploadedPP ? true : false}`} className={styles.cameraIcon} fontSize='large' />
                    <span>{uploadedPP ? "Change" : "Upload"}</span>
                </div>
                <input ref={ppInputRef} accept="image/*" type="file" hidden onChange={handlePPUpload} />
                <TextField inputRef={nameInputRef} variant="standard" label='Name' color="primary" />
                <TextField inputRef={surnameInputRef} variant="standard" label='Surname' color="primary" />
                <TextField
                    sx={{ width: '30ch', mt: 2 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">ID:</InputAdornment>,
                    }}
                    variant="outlined" color="primary" disabled size='small' value={peer.state.peerId} />
                <button onClick={handleNextIconClick} className={styles.forward_icon_btn}>
                    <NextPlanSharpIcon fontSize='large' />
                </button>
            </div>
        </div>
    )
}

export default Register
