const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bridge', {
    peerAPI: {
        getPeerInfo(setPeer) {
            ipcRenderer.invoke('peer').then(res => setPeer(res))
        },
        getSwarmList(setSwarmList) {
            ipcRenderer.invoke('swarm').then(res => setSwarmList(res))
        },
        getBootstrapList(setBootstrapList) {
            ipcRenderer.invoke('bootstrap').then(res => setBootstrapList(res))
        },
        getConnectedPeersList(setConnectedPeersList) {
            ipcRenderer.invoke('connected-peers').then(res => setConnectedPeersList(res))
        },
        getTopics(setTopics, setMessages) {
            ipcRenderer.invoke('topics').then(res => {
                res.forEach(each => ipcRenderer.on(each, (_, msg) => setMessages(prevState => [...prevState, msg])))
                setTopics(res);
            })
        },
        addBootstrap(multiAddr) {
            ipcRenderer.send('add-bootstrap', multiAddr);
        },
        connectToPeer(multiAddr) {
            ipcRenderer.send('connect-to-peer', multiAddr);
        },
        subscribeTopic(topic) {
            ipcRenderer.send('subscribe', topic);
        },
        sendMessage(topic, msg) {
            ipcRenderer.send('send-message', topic, msg);
        },

        //Todo: separate APIs
        getUserDB(setUserDB) {
            ipcRenderer.invoke('get-userDB').then(res => setUserDB(res));
        },
        updateProfileInfo(profileData, setUserDB) {
            ipcRenderer.invoke('update-profile-info', profileData).then(res => setUserDB(res));
        },
        // listenUserDB(setUserDB) {
        //     ipcRenderer.on(, (_, msg) => setUserDB(prevState => [...prevState, msg])))
        // }

    },
    windowApi: {
        setListener(onFocus, onBlur) {
            ipcRenderer.on('window_action', (_, message) => message.isFocused ? onFocus() : onBlur())
        }
    },
});
