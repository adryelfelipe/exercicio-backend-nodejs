import LoginRequest from "../dto/LoginRequest.js"

class AuthController {
    login(req, res) {
        const loginRequest = new LoginRequest({
            email: req.body.email,
            password: req.body.password
        })

        res.status(200).json({
            email: loginRequest.email,
            password: loginRequest.password
        })
    }

    register(req,res) {
        const teste = req.body
        res.status(200).json({message: "testando"})
    }
}

export default new AuthController();