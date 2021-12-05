import React, { useEffect, useRef, useState } from 'react';
import { MemoryRouter, Routes, Route } from "react-router-dom";

import styles from './Styles/App.module.css';

//* Views
import Home from './Views/Home';
import Welcome from './Views/Welcome';

function App() {

    return (
        <MemoryRouter>
            <Routes>
                <Route path='/' exact element={<Welcome />} />
                <Route path='/home' element={<Home />} />
            </Routes>
        </MemoryRouter>
    )
}

export default App;