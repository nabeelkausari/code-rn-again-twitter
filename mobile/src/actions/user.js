import { AsyncStorage } from 'react-native';
import { STORAGE_KEY } from "../utils/constants";

export function login() {
  return {
    type: 'LOGIN'
  }
}

export function getUserInfo(info) {
  return {
    type: 'GET_USER_INFO',
    info
  }
}

export function logout() {
  return async (dispatch) => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return dispatch({
        type: 'LOGOUT'
      })
    } catch (error) {
      throw error;
    }
  }
}