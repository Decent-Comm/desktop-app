import React, { useEffect, useRef, useState } from 'react';
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { context } from './Context';

import styles from './Styles/App.module.css';

//* Views
import Home from './Views/Home';
import Register from './Views/Register';
import Welcome from './Views/Welcome';

function App() {

    const [peer, setPeer] = useState({
        peerId: '',
        identityId: '',
        userdbAddr: '',
        piecedbAddr: ''
    });

    useEffect(() => {
        window.bridge.peerAPI.getPeerInfo(setPeer);
    }, [])

    return (
        <context.Provider value={peer}>
            <MemoryRouter>
                <Routes>
                    {/* <Route path='/' exact element={<Welcome />} /> */}
                    <Route path='/home' element={<Home />} />
                    <Route path='/' element={<Register />} />
                </Routes>
            </MemoryRouter>
        </context.Provider>
    )
}

export default App;