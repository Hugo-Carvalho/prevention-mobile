import { AsyncStorage } from 'react-native';

export const GET_TOKEN = 'GET_TOKEN';
const getToken = token => ({
  type: GET_TOKEN,
  token
});

export const SAVE_TOKEN = 'SAVE_TOKEN';
const saveToken = token => ({
  type: SAVE_TOKEN,
  token
});

export const REMOVE_TOKEN = 'REMOVE_TOKEN';
const removeToken = token => ({
  type: REMOVE_TOKEN,
  token
});

export const LOADING = 'LOADING';
const loading = bool => ({
  type: LOADING,
  isLoading: bool
});

export const ERROR = 'ERROR';
const error = error => ({
  type: ERROR,
  error
});

export const getUserToken = () => dispatch => {
  return AsyncStorage
  .getItem('userToken')
  .then((data) => {
    dispatch(loading(false));
    dispatch(getToken(data));
  })
  .catch((err) => {
    dispatch(loading(false));
    dispatch(error(err.message || 'ERROR'));
  })
}

export const saveUserToken = (data) => dispatch => {
  return AsyncStorage
  .setItem('userToken', 'userToken')
  .then((data) => {
    dispatch(loading(false));
    dispatch(saveToken('token saved'));
  })
  .catch((err) => {
    dispatch(loading(false));
    dispatch(error(err.message || 'ERROR'));
  })
}
    
export const removeUserToken = () => dispatch => {
  return AsyncStorage
  .removeItem('userToken')
  .then((data) => {
    dispatch(loading(false));
    dispatch(removeToken(data));
  })
  .catch((err) => {
    dispatch(loading(false));
    dispatch(error(err.message || 'ERROR'));
  })
}