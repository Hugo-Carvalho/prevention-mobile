import firebase from 'firebase';

export const USER_LOGIN = 'USER_LOGIN';
const userLogin = user => ({
    type: USER_LOGIN,
    user
});

export const USER_LOGOUT = 'USER_LOGOUT';
const userLogout = () => ({
    type: USER_LOGOUT
});

export const tryLogin = ({ mail, pass }) => dispatch => {
  
  return firebase
    .auth()
    .signInWithEmailAndPassword(mail, pass)
    .then(user => {
        const action = userLogin(user);
        dispatch(action);
    })
}