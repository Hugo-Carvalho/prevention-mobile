import { combineReducers } from 'redux';

import userReducer from './userReducer';
import tokenReducer from './tokenReducer';
import bleReducer from './bleReducer';

export default combineReducers({
    user: userReducer,
    token: tokenReducer,
    ble: bleReducer
});