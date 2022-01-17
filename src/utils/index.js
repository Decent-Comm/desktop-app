export const downloadFile = (url, file_name, id, index) => window.bridge.fileApi.downloadFile(url, file_name)
    .then(path => { })
// dispatch({
//     type: SET_LOCAL_FILE_PATH,
//     id,
//     index,
//     payload: path
// }))
