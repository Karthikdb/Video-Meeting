import { combineReducers ,createStore,applyMiddleware} from 'redux';
import {HandleConnections} from '../Reducers/Call';
import thunk from "redux-thunk" 

    const rootReducer = combineReducers({
        Call: HandleConnections,
    });
    const store = createStore(rootReducer,applyMiddleware(thunk));

    export default store;