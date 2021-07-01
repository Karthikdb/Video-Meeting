const INITIAL_STATE={
    connections:{},
    LocalStream:false
}

export const HandleConnections = (state = INITIAL_STATE, action) => {
switch (action.type) {
    case "ADD_CONNECTION":
        return {...state,connections:{...state.connections,[action.socketid]:action.connection}}
    case "ADD_LOCAL_STREAM":
        return {...state,LocalStream:action.Stream}

    default:
        return state;
}
}