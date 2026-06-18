import authMapper from '../mapper/AuthMapper.js';
 
class AuthService {
    register(registerRequest) {
    const user = authMapper.toUser(registerRequest);

    return user;
  }
}
 
export default new AuthService();