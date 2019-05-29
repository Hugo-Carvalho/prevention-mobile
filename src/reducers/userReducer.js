import { USER_LOGIN, USER_LOGOUT } from '../actions';

export default function userReducer(state = { 
  user: {}
}, action){
  switch(action.type){
    case USER_LOGIN:
      return { ...state, user: action.user };
    case USER_LOGOUT:
      return { ...state, user: action.user };
    default:
        return state;
  }
}