import LoginRequest from "../dto/LoginRequest.js"
import RegisterRequest from "../dto/RegisterRequest.js";
import authService from "../service/AuthService.js"
 
class AuthController {
    login(req, res) {
        const loginRequest = new LoginRequest({
            email: req.body.email,
            password: req.body.password
        })
 
        const token = authService.login(loginRequest)
 
        res.status(200).json(token)
    }
 
    register(req,res) {
        const registerRequest = new RegisterRequest({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        })
 
        const user = authService.register(registerRequest)
 
        res.status(200)
    }
}
 
export default new AuthController();