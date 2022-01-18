export const downloadFile = (url, file_name, id, index) => window.bridge.fileApi.downloadFile(url, file_name)
    .then(path => { })
// dispatch({
//     type: SET_LOCAL_FILE_PATH,
//     id,
//     index,
//     payload: path
// }))

// export const editProfileInfo = ({ first_name, last_name }) => async dispatch => {
//     const newDisplayName = `${first_name} ${last_name}`;
//     return auth.currentUser.updateProfile({ displayName: newDisplayName })
//         .then(() => db.doc(`/Users/${auth.currentUser.uid}`).update({ first_name, last_name }))
//         .then(() => dispatch({ type: SET_PROFILE_INFO, payload: newDisplayName }))
//         .then(() => editChatUserDetails('displayName', auth.currentUser.displayName))
//         .catch(err => console.log(err));
// }
