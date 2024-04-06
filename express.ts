import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.ts'
import playListRoutes from './routes/playListRoutes.ts';
import trackRoutes from './routes/trackRoutes.ts';

dotenv.config()
const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true 
}))
app.use(helmet())
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended: true,limit:"20kb"}))
app.use(cookieParser())
app.use('/api', authRoutes)
app.use('/api', playListRoutes)
app.use('/api',trackRoutes)

app.get('/', (req,res)=>{
    res.send('Hello World')
})

export default app