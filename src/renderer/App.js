import React, { useEffect, useRef, useState } from 'react';
import styles from './Styles/App.module.css';

const App = () => {

    const [peer, setPeer] = useState({
        peerId: '',
        identityId: '',
        userdbAddr: '',
        piecedbAddr: ''
    });

    const [swarmList, setSwarmList] = useState([]);
    const [bootstrapList, setBootstrapList] = useState([]);
    const [connectedPeersList, setConnectedPeersList] = useState([]);
    const [topics, setTopics] = useState([]);
    const [messages, setMessages] = useState([]);


    const bootstrapInputRef = useRef(null);
    const connectPeerInputRef = useRef(null);
    const topicInputRef = useRef(null);
    const messageTopicInputRef = useRef(null);
    const messageInputRef = useRef(null);

    const handleBootstrapSubmit = (e) => {
        e.preventDefault();
        const value = bootstrapInputRef.current.value.trim();
        if (value !== '') {
            window.bridge.peerAPI.addBootstrap(value);
            bootstrapInputRef.current.value = '';
        }
    }

    const handleConnectSubmit = (e) => {
        e.preventDefault();
        const value = connectPeerInputRef.current.value.trim();
        if (value !== '') {
            window.bridge.peerAPI.connectToPeer(value);
            connectPeerInputRef.current.value = '';
        }
    }

    const handleTopicSubmit = (e) => {
        e.preventDefault();
        const value = topicInputRef.current.value.trim();
        if (value !== '') {
            window.bridge.peerAPI.subscribeTopic(value);
            topicInputRef.current.value = '';
        }
    }

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        const topic = messageTopicInputRef.current.value.trim();
        const msg = messageInputRef.current.value.trim();
        if (topic !== '' && msg !== '') {
            window.bridge.peerAPI.sendMessage(topic, msg);
            messageTopicInputRef.current.value = '';
            messageInputRef.current.value = '';
        }
    }

    const handleRefresh = (e) => {
        switch (e.currentTarget.name) {
            case 'bootstrap':
                window.bridge.peerAPI.getBootstrapList(setBootstrapList);
                console.log('Bootstrap List Refreshed');
                break;
            case 'connected_peers':
                window.bridge.peerAPI.getConnectedPeersList(setConnectedPeersList);
                console.log('Connected Peers List Refreshed');
                break;
            case 'topics':
                window.bridge.peerAPI.getTopics(setTopics, setMessages);
                console.log('Topics Refreshed');
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        window.bridge.peerAPI.getPeerInfo(setPeer);
        window.bridge.peerAPI.getSwarmList(setSwarmList);
        window.bridge.peerAPI.getBootstrapList(setBootstrapList);
        window.bridge.peerAPI.getConnectedPeersList(setConnectedPeersList);
        window.bridge.peerAPI.getTopics(setTopics, setMessages);
    }, [])


    return (
        <div className={styles.container}>
            <div className={styles.peer_info}>
                <p><span>Peer ID:</span> <span>{peer.peerId}</span></p>
                <p><span>OrbitDB Identity ID:</span> <span>{peer.identityId}</span></p>
                <p><span>User DB Address:</span> <span>{peer.userdbAddr}</span></p>
                <p><span>Piece DB Address:</span> <span>{peer.piecedbAddr}</span></p>
            </div>
            <div className={styles.swarm_list}>
                <h4>Swarm listening on: </h4>
                <ul>
                    {swarmList.map(swarm =>
                        <li key={swarm}>
                            {swarm}
                        </li>)
                    }
                </ul>
            </div>

            <div className={styles.bootstrap_list}>
                <h4>Bootstrap List: <button
                    name='bootstrap'
                    className={styles.refresh_btn}
                    onClick={handleRefresh}
                >Refresh</button></h4>
                <ul>
                    {bootstrapList.map(bootstrap =>
                        <li key={bootstrap}>
                            {bootstrap}
                        </li>)
                    }
                </ul>
                <br />
                <h4>Add New Bootstrap </h4>
                <form onSubmit={handleBootstrapSubmit}>
                    <label htmlFor='bootstrap'>Multi Address: </label>
                    <input ref={bootstrapInputRef} type='text' id='bootstrap' />
                    <input type='submit' value='ADD' />
                </form>
            </div>
            <div className={styles.connected_peers_list}>
                <h4>Connected Peers List: <button
                    name='connected_peers'
                    className={styles.refresh_btn}
                    onClick={handleRefresh}
                >Refresh</button></h4>
                <ul>
                    {connectedPeersList.map(peer =>
                        <li key={peer.peer}>
                            {peer.peer}
                        </li>)
                    }
                </ul>
            </div>
            <div className={styles.manual_peer_connection}>
                <h4>Manually Connect to a Peer </h4>
                <form onSubmit={handleConnectSubmit}>
                    <label htmlFor='multiaddr'>Multi Address: </label>
                    <input ref={connectPeerInputRef} type='text' id='multiaddr' />
                    <input type='submit' value='CONNECT' />
                </form>
            </div>

            <div className={styles.subscribed_topics}>
                <h4>Subscribed Topics: <button
                    name='topics'
                    className={styles.refresh_btn}
                    onClick={handleRefresh}
                >Refresh</button></h4>
                <ul>
                    {topics.map(topic =>
                        <li key={topic}>
                            {topic}
                        </li>)
                    }
                </ul>
                <br />
                <h4>Subscribe to a New Topic </h4>
                <form onSubmit={handleTopicSubmit}>
                    <label htmlFor='topic'>New Topic: </label>
                    <input ref={topicInputRef} type='text' id='topic' />
                    <input type='submit' value='SUBSCRIBE' />
                </form>
            </div>

            <div className={styles.publish_message}>
                <h4>Publish a Message </h4>
                <form onSubmit={handleMessageSubmit}>
                    <label htmlFor='message_topic'>Topic: </label>
                    <input ref={messageTopicInputRef} type='text' id='message_topic' />
                    <label htmlFor='message'>Message: </label>
                    <input ref={messageInputRef} type='text' id='message' />
                    <input type='submit' value='PUBLISH' />
                </form>
            </div>

            <div className={styles.received_messages}>
                {messages.map((message, index) => <div key={index}>
                    <p><span>From:</span> <span>{message.from}</span></p>
                    <p><span>Data:</span> <span>{new TextDecoder().decode(message.data)}</span></p>
                </div>
                )}
                {messages.length === 0 ? "No Messages Yet" : null}

            </div>

        </div>
    )
}

export default App;