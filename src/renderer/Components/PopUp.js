import React, { forwardRef } from 'react';
import classes from '../Styles/popUp.module.css';

const PopUp = forwardRef(({ children }, ref) => {
    return (
        <div className={classes.container} ref={ref}>
            {children}
        </div>
    )
});

export default PopUp;