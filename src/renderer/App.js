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

    const [userDB, setUserDB] = useState({});

    const stateObj = (state, setState) => {
        return { state: state, setState: setState };
    }

    useEffect(() => {
        window.bridge.peerAPI.getPeerInfo(setPeer);
        window.bridge.peerAPI.getUserDB(setUserDB);
    }, [])

    const contextValue = {
        peer: stateObj(peer, setPeer),
        userDB: stateObj(userDB, setUserDB)
    }

    return (
        <context.Provider value={contextValue}>
            <MemoryRouter>
                <Routes>
                    <Route path='/' exact element={<Welcome />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/home' element={<Home />} />
                </Routes>
            </MemoryRouter>
        </context.Provider>
    )
}

export default App;