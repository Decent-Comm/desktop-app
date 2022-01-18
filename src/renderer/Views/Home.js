import React, { createRef, useContext, useEffect, useRef, useState } from 'react';
import { context } from '../Context';

import styles from '../Styles/Home.module.css';
import classes from '../Styles/Home-extra.module.css';

import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import CloudRoundedIcon from '@mui/icons-material/CloudRounded';
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PhoneTwoToneIcon from '@mui/icons-material/PhoneTwoTone';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import FingerprintRoundedIcon from '@mui/icons-material/FingerprintRounded';
import Badge from '@mui/material/Badge';

import Bubbles from '../components/Bubbles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddContact from '../components/AddContact';
import LogOut from '../components/LogOut';
import EmojiList from '../components/EmojiList';

import compressor from "browser-image-compression";
import { getTime } from '../../utils/dateTime';


const bgColors = [
    '#a695e7',
    '#7bc862',
    '#ee7aae',
    '#eda86c',
    '#6ec9cb',
    '#65aadd',
    '#e17076',
]

// const getInitials = (displayName) => displayName.split(' ').map((each) => each[0]).join('');

const defaultPicBgColor = bgColors[Math.floor(Math.random() * 8)];

const getRandomBgColor = () => bgColors[Math.floor(Math.random() * 8)];


function Home() {

    const { userDB } = useContext(context);

    useEffect(() => {
        if (userDB.state.profile) {
            if (userDB.state.profile.ppBuffer) imageBufferToURL(userDB.state.profile.ppBuffer);
            setInitials(userDB.state.profile.name[0].toUpperCase() + userDB.state.profile.surname[0].toUpperCase());
            setDisplayName(userDB.state.profile.name + " " + userDB.state.profile.surname);
        }
    }, [userDB.state.profile])

    const [view, setView] = useState(true);

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

    const [chatsDB, setChatsDB] = useState([]);

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

        window.bridge.chatApi.getChatDB(setChatsDB);
        // window.bridge.chatApi.setListener(chatsDB, setChatsDB);

        window.bridge.windowApi.setListener(onFocus, onBlur);
    }, [])

    //* Temp
    const [imageSrc, setImageSrc] = useState(undefined);
    const imageBufferToURL = (buffer) => {
        const blob = new Blob([buffer], { type: "image/jpeg" });

        const reader = new FileReader();
        reader.onloadend = (e) => {
            setImageSrc(e.target.result);
        }

        reader.readAsDataURL(blob);
    }

    const [initials, setInitials] = useState('');
    const [displayName, setDisplayName] = useState('');

    const [searchIconClicked, setSearchIconClicked] = useState(false);
    const [settingsIconClicked, setSettingsIconClicked] = useState(false);
    const [profileIconClicked, setProfileIconClicked] = useState(false);
    const [addContactClicked, setAddContactClicked] = useState(false);
    const [logOutClicked, setLogOutClicked] = useState(false);

    const [searchValue, setSearchValue] = useState('');

    const [selectedChatId, setSelectedChatId] = useState(undefined);

    const handleChatBoxClick = (chat) => {
        if (chat) {
            if (chat.id !== selectedChatId) {
                setSelectedChatId(chat.id);
                // if (!data[chat.id]) props.getChatMessages(chat.id, chat.shared_key);
                // handleReadMessages(chat.id);
            }
        }
        else {
            setSelectedChatId('Cloud');
            console.log(chatsDB);
        }

        textAreaRef.current?.focus();
    }

    const handleClosingAnimation = (callback, durationInMS) => { const timeOut = setTimeout(() => { callback(); clearTimeout(timeOut); }, durationInMS) };

    const flScreenBgRef = useRef(null);
    const profileRef = useRef(null);
    const settingsRef = useRef(null);

    const popUpRef = createRef();

    const resizerLeftRef = useRef(null);
    const resizerRightRef = useRef(null);

    const handleMouseMoveL = (e) => {
        if (e.clientX >= 225 && e.clientX < document.body.clientWidth * 0.6) {
            resizerLeftRef.current.parentElement.style.minWidth = e.clientX + 'px';
            resizerLeftRef.current.parentElement.style.maxWidth = e.clientX + 'px';

        }
    }

    const handleMouseMoveR = (e) => {
        const size = document.body.clientWidth - e.clientX;
        if (size >= 225 && size <= 300) {
            resizerRightRef.current.parentElement.style.minWidth = size + 'px';
            resizerRightRef.current.parentElement.style.maxWidth = size + 'px';
        }
    }

    const handleMouseUpL = () => {
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMoveL);
        document.removeEventListener('mouseup', handleMouseUpL);
    }

    const handleMouseUpR = () => {
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMoveR);
        document.removeEventListener('mouseup', handleMouseUpR);
    }

    const handlePhotoChange = async (e) => {
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
                setImageSrc(e.target.result);
                let ppBuffer = await compressedFile.arrayBuffer();
                window.bridge.peerAPI.updateProfileInfo({
                    ...userDB.state.profile,
                    ppBuffer,
                }, userDB.setState);
            };
            reader.readAsDataURL(compressedFile);
        }
    };
    const handleFileChange = (e) => {
        if (e.currentTarget.files) {
            // const data = chats.find(chat => chat.id === selectedChatId);
            // props.uploadFiles(Array.from(e.currentTarget.files), selectedChatId, data.lastMessageInfo, data.nonSeenMessages);
        }
    };

    const handleProfileIconClick = () => setProfileIconClicked(true);

    const photoInputRef = useRef(null);
    const handlePhotoInputClick = () => photoInputRef.current.click();

    const fileInputRef = useRef(null);
    const handleFileInputClick = () => fileInputRef.current.click();

    const profileSettingsDetailsRef = useRef(null);
    const profileSettingsEditRef = useRef(null);

    const profileFNameRef = useRef(null);
    const profileLNameRef = useRef(null);

    const handleProfileSettingsAnimClosing = () => {
        profileSettingsEditRef.current.style.transform = 'translateX(100%)';
        handleClosingAnimation(() => {
            profileSettingsEditRef.current.style.display = 'none';
            profileSettingsDetailsRef.current.style.display = 'block';
            handleClosingAnimation(() => {
                profileSettingsDetailsRef.current.style.transform = 'translateX(0)';
            }, 100);
        }, 300);
    }

    // const getChatUserID = (userIDs) => userIDs.filter(each => each != peer.peerid)[0];

    const [userBgColorList, setUserBgColorList] = useState('');

    const textAreaRef = useRef(null);
    const [key, setKey] = useState(null);

    const lastMessageRef = useRef(null);
    const handleMiddleMessageSubmit = () => {
        // TODO: fix Cloud chat
        if (textAreaRef.current.value.trim() !== '') {
            if (selectedChatId === 'Cloud') {
                window.bridge.chatApi.addMessage(selectedChatId, {
                    message: textAreaRef.current.value,
                    sentBy: peer.peerId,
                    seen: true,
                    time: new Date().toISOString() //firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // const data = chats.find(chat => chat.id === selectedChatId);
            // props.sendMessageOrFile({
            //     id: selectedChatId,
            //     message: textAreaRef.current.value,
            //     lastMessageInfo: data.lastMessageInfo,
            //     nonSeenMessages: data.nonSeenMessages,
            //     sharedKey: data.shared_key
            // });
        }
        textAreaRef.current.value = '';
        textAreaRef.current.focus();
    }

    const [isFocused, setIsFocused] = useState(true);

    const onFocus = () => {
        setIsFocused(true);
        // props.setUserStatus(true);
    }

    const handleReadMessages = (_selectedChatId) => {
        if (_selectedChatId && _selectedChatId !== 'Cloud') { }
        // props.readMessages(_selectedChatId);
    }

    const handleDownloadFile = (url, name, id, index) => { } //props.downloadFile(url, name, id, index);

    const openFile = (path) => window.bridge.fileApi.openFile(path);

    const onBlur = () => {
        setIsFocused(false);
        // props.setUserStatus(false);
    }

    useEffect(() => {
        if (lastMessageRef.current) lastMessageRef.current?.scrollIntoView();
    }, [lastMessageRef.current])

    // useEffect(() => {
    //     console.log(isFocused);
    //     if (isFocused) handleReadMessages(selectedChatId);
    // }, [chats])

    useEffect(() => {
        if (isFocused) {
            textAreaRef.current?.focus();
            handleReadMessages(selectedChatId);
        }
    }, [isFocused])

    return (
        view ?
            <div className={classes.container}>

                {/* <img src={src ?? imageBufferToURL(userDB.state.profile.ppBuffer)} />
                    <p>{userDB.state.profile.name}</p>
                    <p>{userDB.state.profile.surname}</p> */}


                <div className={classes.left}>
                    <div className={classes.profile}>
                        {imageSrc
                            ? <img src={imageSrc} onClick={handleProfileIconClick} />
                            : <div style={{ backgroundColor: defaultPicBgColor }} onClick={handleProfileIconClick} className={classes.default_profile_pic}>
                                {initials}
                            </div>
                        }
                        <div className={classes.name_status}>
                            <span onClick={handleProfileIconClick}>{displayName}</span>
                            <FiberManualRecordRoundedIcon className={classes.status} />
                        </div>
                        {profileIconClicked &&
                            <div ref={profileRef} className={classes.profile_setting}>
                                <input ref={photoInputRef} hidden onChange={handlePhotoChange} type='file' />

                                {imageSrc
                                    ? <div onClick={handlePhotoInputClick} className={classes.photo_img_edit}><img src={imageSrc} />
                                        <div><span>Edit</span></div>
                                    </div>
                                    : <div onClick={handlePhotoInputClick} style={{ backgroundColor: defaultPicBgColor }} className={classes.default_profile_setting_pic}>
                                        {initials}
                                        <div className={classes.photo_def_edit}><span>Edit</span></div>
                                    </div>
                                }

                                <div className={classes.profile_setting_details}>

                                    <div ref={profileSettingsDetailsRef} className={classes.profile_setting_details_box}>
                                        <div onClick={() => {
                                            // profileSettingsDetailsRef.current.style.transform = 'translateX(-100%)';
                                            handleClosingAnimation(() => {
                                                profileSettingsDetailsRef.current.style.display = 'none';
                                                profileSettingsEditRef.current.style.display = 'flex';
                                                handleClosingAnimation(() => {
                                                    profileSettingsEditRef.current.style.transform = 'translateX(100%)';
                                                    profileFNameRef.current.focus();
                                                }, 100);
                                            }, 300);
                                        }}>
                                            <PermIdentityRoundedIcon className={classes.name_icon} />
                                            <span>{displayName}</span>
                                        </div>
                                        <div>
                                            <FingerprintRoundedIcon className={classes.identity_icon} />
                                            <span>{peer.peerId}</span>
                                        </div>
                                    </div>

                                    <div ref={profileSettingsEditRef} className={classes.profile_setting_edit_box}>
                                        <h1>Edit Your Name</h1>
                                        <TextField spellCheck={false} inputRef={profileFNameRef} defaultValue={displayName.split(' ')[0]} name='first_name' onBlur={() => { }} label='First Name' variant='standard' color='primary' size='small' margin='none' />
                                        <TextField spellCheck={false} inputRef={profileLNameRef} defaultValue={displayName.split(' ')[1]} name='last_name' onBlur={() => { }} label='Last Name' variant='standard' color='primary' size='small' margin='none' />
                                        <div className={classes.profile_setting_edit_box_btns}>
                                            <Button color='primary' size='small'
                                                onClick={handleProfileSettingsAnimClosing}>
                                                Cancel
                                            </Button>
                                            <Button color='primary' size='small'
                                                onClick={() => Promise.resolve().then(() =>
                                                    bridge.peerAPI.updateProfileInfo({
                                                        ...userDB.state.profile,
                                                        name: profileFNameRef.current.value,
                                                        surname: profileLNameRef.current.value,
                                                    }, userDB.setState)
                                                ).then(handleProfileSettingsAnimClosing)}
                                            >Save</Button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }

                    </div>
                    <div className={classes.chat_list}>
                        {String('cloud').includes(searchValue.toLowerCase()) &&
                            <div name='Cloud' className={classes.cloud} onClick={() => handleChatBoxClick()}>
                                <CloudRoundedIcon color='error' className={classes.cloud_icon} />
                                <span>Cloud</span>
                            </div>
                        }
                        {/* {chats?.map(chat => {
                            if (userBgColorList[chat.id] === undefined) setUserBgColorList((prevS) => ({ ...prevS, [chat.id]: getRandomBgColor() }));
                            return (<div style={{ display: chat[chat.toId].displayName?.toLowerCase().includes(searchValue.toLowerCase()) || chat[chat.toId].phoneNumber.toLowerCase().includes(searchValue.toLowerCase()) ? 'flex' : 'none' }}
                                key={chat.id} name={chat.id} className={classes.chat_box} onClick={() => handleChatBoxClick(chat)}>
                                <Badge variant='dot' overlap="circle" color="primary" anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }} className={classes.chat_photo_badge} data-active={onlineUsers[chat.toId]?.online}>
                                    {chat[chat.toId].photoURL ?
                                        <img src={chat[chat.toId].photoURL} className={classes.chat_box_photo} />
                                        :
                                        <div style={{ backgroundColor: userBgColorList[chat.id] }} className={classes.chat_box_df_pic}>
                                            <PersonRoundedIcon />
                                        </div>
                                    }
                                </Badge>
                                <div className={classes.chat_box_content} style={{ height: (chat.lastMessageInfo?.message || chat.lastMessageInfo?.file) ? '100%' : 'auto' }}>
                                    <div>
                                        <span>{chat[chat.toId].displayName ?? chat[chat.toId].phoneNumber}</span>
                                        {chat.lastMessageInfo &&
                                            <div className={classes.chat_box_content_timeInfo}>
                                                {chat.lastMessageInfo.sentBy === peer.peerid &&
                                                    (chat.lastMessageInfo.seen ?
                                                        <DoneAllRoundedIcon color='primary' className={classes.tick} /> :
                                                        <DoneRoundedIcon color='primary' className={classes.tick} />
                                                    )
                                                }
                                                {chat.lastMessageInfo?.time &&
                                                    <span>{getTime(chat.lastMessageInfo?.time)}</span>
                                                }
                                            </div>
                                        }
                                    </div>
                                    {(chat.lastMessageInfo?.message || chat.lastMessageInfo?.file) &&
                                        <div className={classes.chat_box_content_message}>
                                            <span>{chat.lastMessageInfo?.message ?? chat.lastMessageInfo?.file.name}</span>
                                            <div style={{
                                                visibility: (chat.lastMessageInfo?.sentBy !== peer.peerid && chat.nonSeenMessages) ?
                                                    ((isFocused && chat.id === selectedChatId) ? 'hidden' : 'visible') : 'hidden'
                                            }}>
                                                {chat.nonSeenMessages}
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>)
                        })} */}
                    </div>
                    <div className={classes.search_settings}>
                        {searchIconClicked ?
                            <div className={classes.custom_search_input}>
                                <input
                                    spellCheck={false}
                                    type='text'
                                    value={searchValue}
                                    onChange={(e) => {
                                        setSearchValue(e.currentTarget.value);
                                    }}
                                    onBlur={(e) => {
                                        if (searchValue === '') {
                                            e.currentTarget.style.transform = 'scaleX(0)';
                                            e.currentTarget.placeholder = '';
                                            e.currentTarget.style.opacity = 0;
                                            handleClosingAnimation(() => setSearchIconClicked(false), 275);
                                        }
                                    }}
                                    className={classes.search_field} autoFocus placeholder='Search'
                                />
                                {searchValue !== '' &&
                                    <CloseRoundedIcon color='action' className={classes.search_empty_icon}
                                        onClick={() => { setSearchValue(''); setSearchIconClicked(false); }}
                                    />
                                }
                            </div>
                            :
                            <SearchRoundedIcon onClick={() => setSearchIconClicked(true)}
                                color='action' className={classes.search_icon}
                            />
                        }
                        <MoreVertRoundedIcon
                            onClick={() => {
                                setSettingsIconClicked(true);
                            }} color='action' className={classes.settings_icon} />
                        {settingsIconClicked &&
                            <div ref={settingsRef} className={classes.settings}>
                                <div onClick={() => { setAddContactClicked(true); setSettingsIconClicked(false); }}>
                                    <AddCircleOutlineRoundedIcon className={classes.settings_list_icon} />
                                    Add contact
                                </div>
                                <div onClick={() => setView(false)}>
                                    <GroupAddOutlinedIcon className={classes.settings_list_icon} />
                                    Peer
                                </div>
                                <div onClick={() => { }}>
                                    <LanguageRoundedIcon className={classes.settings_list_icon} />
                                    Language
                                </div>
                                <div onClick={() => { setLogOutClicked(true); setSettingsIconClicked(false); }}>
                                    <ExitToAppRoundedIcon className={classes.settings_list_icon} />
                                    Log out
                                </div>
                            </div>
                        }
                    </div>
                    <div ref={resizerLeftRef} className={classes.resize + ' ' + classes.rsz_left} onMouseDown={() => {
                        document.body.style.cursor = 'e-resize';
                        document.addEventListener('mousemove', handleMouseMoveL);
                        document.addEventListener('mouseup', handleMouseUpL);
                    }}
                    />
                </div>

                {
                    (() => {
                        let selectedChatData = "Cloud"; // chats?.find(each => each.id === selectedChatId);
                        selectedChatId === "Cloud" && (selectedChatData = { toId: "Cloud", Cloud: { displayName: "Cloud" } });

                        return (<>
                            <div className={classes.middle}>
                                {!selectedChatId ?
                                    <>
                                        <Bubbles />
                                        <div className={classes.none_selected_chat}>
                                            Start messaging
                                        </div>
                                    </>
                                    :
                                    <div className={classes.selected_chat}>
                                        <div className={classes.chat_header}>
                                            <h1>{selectedChatData[selectedChatData.toId].displayName ?? selectedChatData[selectedChatData.toId].phoneNumber}</h1>
                                            {selectedChatId !== 'Cloud' &&
                                                <span>last seen {onlineUsers[selectedChatData.toId]?.lastSeen ? getLastSeen(onlineUsers[selectedChatData.toId].lastSeen) : 'recently'}</span>
                                            }
                                        </div>
                                        <div className={classes.chat_container}>{
                                            chatsDB.find(chat => chat.hash === selectedChatId)?.messages?.map((each, index) =>
                                                <div ref={index === 0 ? lastMessageRef : null} key={index} className={each.sentBy === peer.peerId ? classes.message_right : classes.message_left}>
                                                    {each.message ?
                                                        <p className={classes.selectable}>
                                                            {each.message}
                                                        </p>
                                                        :
                                                        <div className={classes.chat_container_message_content}>
                                                            <DescriptionRoundedIcon className={classes.chat_container_message_file_icon} onClick={() => !each.localPath ? handleDownloadFile(each.file.url, each.file.name, selectedChatId, index) : openFile(each.localPath)} />
                                                            <p className={classes.selectable}>
                                                                {each.file.name}
                                                            </p>
                                                        </div>
                                                    }
                                                    <div className={classes.chat_container_message_time}>
                                                        <span>{getTime(each.time)}</span>
                                                        {each.sentBy === peer.peerId &&
                                                            (each.seen ?
                                                                <DoneAllRoundedIcon color='primary' className={classes.tick} /> :
                                                                <DoneRoundedIcon color='primary' className={classes.tick} />
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        }

                                        </div>
                                        <div className={classes.input_bar}>
                                            <EmojiList inputRef={textAreaRef} />
                                            <input ref={fileInputRef} hidden onChange={handleFileChange} type='file' />
                                            <AttachFileRoundedIcon onClick={handleFileInputClick} className={classes.upload_icon} />
                                            <textarea
                                                spellCheck={false}
                                                className={classes.text_field}
                                                autoFocus
                                                ref={textAreaRef}
                                                placeholder='Write a message...'
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") setKey('Enter');
                                                }}
                                                onChange={(e) => {
                                                    e.currentTarget.style.height = 'auto';
                                                    if (key === 'Enter') { handleMiddleMessageSubmit(); return setKey(null); }

                                                    if (e.currentTarget.scrollHeight <= 250) {
                                                        e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                                                        // console.log(e.currentTarget.scrollHeight);
                                                    }
                                                }}
                                                rows={1}
                                            />
                                            <SendRoundedIcon onClick={handleMiddleMessageSubmit} color='primary' className={classes.send_icon} />
                                        </div>
                                    </div>

                                }
                            </div>
                            {selectedChatId ?
                                <div className={classes.right}>
                                    <div ref={resizerRightRef} className={classes.resize + ' ' + classes.rsz_right} onMouseDown={() => {
                                        document.body.style.cursor = 'e-resize';
                                        document.addEventListener('mousemove', handleMouseMoveR);
                                        document.addEventListener('mouseup', handleMouseUpR);
                                    }} />
                                    <div className={classes.right_header}>
                                        <h1>{selectedChatId !== 'Cloud' ? 'User Info' : 'Chat Info'}</h1>
                                    </div>
                                    <div className={classes.user_info}>
                                        {selectedChatId !== 'Cloud' ?
                                            (selectedChatData[selectedChatData.toId].photoURL
                                                ? <img src={selectedChatData[selectedChatData.toId].photoURL} />
                                                : <div style={{ backgroundColor: userBgColorList[selectedChatId] }} className={classes.user_info_df_pic}>
                                                    <PersonRoundedIcon fontSize='large' />
                                                </div>)
                                            :
                                            <CloudRoundedIcon fontSize='large' color='error' />
                                        }
                                        <div className={classes.user_info_content}>
                                            <h1 className={classes.selectable}>{selectedChatData[selectedChatData.toId].displayName ?? selectedChatData[selectedChatData.toId].phoneNumber}</h1>
                                            {selectedChatId !== 'Cloud' &&
                                                <span>last seen {onlineUsers[selectedChatData.toId]?.lastSeen ? getLastSeen(onlineUsers[selectedChatData.toId].lastSeen, true) : 'recently'}</span>
                                            }
                                        </div>
                                    </div>
                                    <div className={classes.user_media_settings}>
                                        {selectedChatId !== 'Cloud' &&
                                            <div className={classes.top}>
                                                <div>
                                                    <FingerprintRoundedIcon />
                                                    <span>{selectedChatData[selectedChatData.toId].phoneNumber}</span>
                                                </div>
                                            </div>
                                        }
                                        <div className={classes.center}>
                                            <div>
                                                <ImageRoundedIcon />
                                                <span>Images</span>
                                            </div>
                                            <div>
                                                <VideocamRoundedIcon />
                                                <span>Videos</span>
                                            </div>
                                            <div>
                                                <LinkRoundedIcon />
                                                <span>Links</span>
                                            </div>
                                            <div>
                                                <InsertDriveFileRoundedIcon />
                                                <span>Files</span>
                                            </div>
                                        </div>
                                        {selectedChatId !== 'Cloud' &&
                                            <div className={classes.bottom}>
                                                <div>
                                                    <DeleteForeverRoundedIcon />
                                                    <span>Delete contact</span>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                </div>
                                : null}
                        </>)
                    })()
                }

                {
                    (profileIconClicked || settingsIconClicked || addContactClicked || logOutClicked) &&
                    <div ref={flScreenBgRef} onClick={(e) => {
                        e.currentTarget.style.opacity = '0';
                        if (profileIconClicked) profileRef.current.style.transform = 'scale(0,0)';
                        if (settingsIconClicked) settingsRef.current.style.transform = 'scale(0,0)';
                        if (addContactClicked || logOutClicked) popUpRef.current.style.opacity = '0';
                        handleClosingAnimation(() => {
                            profileIconClicked ? setProfileIconClicked(false) :
                                settingsIconClicked ? setSettingsIconClicked(false) :
                                    addContactClicked ? setAddContactClicked(false) :
                                        logOutClicked ? setLogOutClicked(false) :
                                            null
                        }, 250);
                    }} className={classes.fl_screen_bg} />
                }
                {
                    addContactClicked &&
                    <AddContact ref={popUpRef} flScreenBgRef={flScreenBgRef} />
                }
                {
                    logOutClicked &&
                    <LogOut ref={popUpRef} flScreenBgRef={flScreenBgRef} history={history} />
                }
            </div >
            :
            <div className={styles.container}>
                <div className={styles.peer_info}>
                    <p><span>Peer ID:</span> <span>{peer.peerId}</span></p>
                    <p><span>OrbitDB Identity ID:</span> <span>{peer.identityId}</span></p>
                    <p><span>User DB Address:</span> <span>{peer.userdbAddr}</span></p>
                    <p><span>Piece DB Address:</span> <span>{peer.piecedbAddr}</span></p>
                    <p><span>Fullname:</span> <span>{userDB.state.profile.name} {userDB.state.profile.surname}</span></p>
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
                <Button onClick={() => setView(true)}>GO BACK</Button>
            </div>
    )
}

export default Home;