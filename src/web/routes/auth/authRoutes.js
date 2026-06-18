import {Router} from "express"
import authController from "../../../auth/application/controller/AuthController.js"

const router = Router();

router.post("/login", authController.login)
router.post("/register", authController.register)

export default router;