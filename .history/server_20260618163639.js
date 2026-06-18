import express from "express"
import router from "./src/web/routes/auth/authRoutes.js"

const app = express();

app.use(express.json())

app.use("/auth",router)

app.listen(3000, () => {
    console.log("Servidor rodando")
})