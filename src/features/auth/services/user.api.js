import api from '../../../services/apiClient';

const USER_URL = 'users/';

const UserApi = {
  getProfile() {
    return api.get(USER_URL + 'me');
  },

  updateProfile(data) {
    return api.put(USER_URL + 'me', data);
  },

  changePassword(data) {
    return api.put(USER_URL + 'me/password', data);
  },
};

export default UserApi;
