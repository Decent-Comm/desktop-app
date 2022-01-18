import React, { forwardRef, useState } from 'react';
import classes from '../Styles/addContact.module.css';


import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

// import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import FingerprintRoundedIcon from '@mui/icons-material/FingerprintRounded';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import PopUp from './PopUp';

const AddContact = forwardRef((props, ref) => {
    // const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState("");
    const handleClick = () => {
        // inputValue.length > 3 && dispatch(addNewContact(inputValue));
    }
    return (
        <PopUp ref={ref}>
            <div className={classes.header}>
                <h1>New Contact</h1>
                <CloseRoundedIcon
                    onClick={() => props.flScreenBgRef.current.click()}
                    color='action'
                    className={classes.close_icon}
                />
            </div>
            <div className={classes.phoneNumberField}>
                <FingerprintRoundedIcon action='action' />
                <TextField spellCheck={false} onChange={(e) => {
                    setInputValue(e.currentTarget.value);
                }} value={inputValue} autoFocus label='Peer ID' variant='standard' color='primary' fullWidth size='medium' />

            </div>
            <Button onClick={handleClick} color='primary' variant='contained' size='small'>
                Add
            </Button>
        </PopUp>
    )
});

export default AddContact
