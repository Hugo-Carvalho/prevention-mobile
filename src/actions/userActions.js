import firebase from 'firebase';

export const USER_LOGIN = 'USER_LOGIN';
const userLogin = user => ({
  type: USER_LOGIN,
  user
});

export const USER_LOGOUT = 'USER_LOGIN';
const userLogout = () => ({
  type: USER_LOGOUT,
  user: null
});

export const login = ({ mail, pass }) => dispatch => {
  return firebase
    .auth()
    .signInWithEmailAndPassword(mail, pass)
    .then(user => {
      dispatch(userLogin(user));
    })
}

export const logout = () => dispatch => {
  dispatch(userLogout());
}