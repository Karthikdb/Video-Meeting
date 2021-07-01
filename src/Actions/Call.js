export function ADDFunction(socketid,connection){
    return dispatch=>{
        dispatch({type:"ADD_CONNECTION",socketid:socketid,connection:connection})
    }
}

export function ADDLocalStream(stream){
    return dispatch=>{
        dispatch({type:"ADD_LOCAL_STREAM",Stream:stream})
    }
}
