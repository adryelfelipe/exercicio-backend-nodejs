import LoginRequest from "../dto/LoginRequest.js"
import RegisterRequest from "../dto/RegisterRequest.js";
import authService from "../service/AuthService.js"

class AuthController {
    async login(req, res) {
        const loginRequest = new LoginRequest({
            email: req.body.email,
            password: req.body.password
        })

        try {
            const token = await authService.login(loginRequest);
            res.status(200).json({ token });
        } catch (error) {
            if (error.name === 'InvalidCredentialsException') {
                return res.status(401).json({ message: error.message });
            }

            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async register(req, res) {  
        const registerRequest = new RegisterRequest({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        })

        try {
            const id = await authService.register(registerRequest);
            res.status(201).json({ id });
        } catch (error) {
            if (error.name === 'EmailAlreadyUsedException') {
                return res.status(409).json({ message: error.message });
            }

            console.log(error.message)
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default new AuthController();