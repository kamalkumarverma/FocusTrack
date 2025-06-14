import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDB } from "./config/db.js";
import userRouter from "./routers/userRoute.js"
import taskRouter from "./routers/taskRoute.js";
import bodyParser from "body-parser";
const app = express();

const port = process.env.PORT || 4000;

//  middleware 

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res) =>{
    res.send("api working correctly")
})

connectDB();

// routes 
app.use('/api/user',userRouter)

app.use("/api/tasks",taskRouter)


app.listen(port,()=>console.log(`server started at on localhost port :${port}`))