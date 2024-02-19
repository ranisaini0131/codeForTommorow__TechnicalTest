import express from "express"
import dotenv from "dotenv"
import connectDb from "./src/db/connection.js";


dotenv.config({ path: "./env" })

const app = express()

const port = 8080;

connectDb()


app.use(express.json())

//routes
import useRouter from "./src/routes/user.route.js"

app.use("/api/users", useRouter)


app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})