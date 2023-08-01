import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes.ts'
import playListRoutes from './routes/playListRoutes.ts';

dotenv.config()
const app = express()

app.use(cors())
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/api', authRoutes)
app.use('/api', playListRoutes)

app.get('/', (req,res)=>{
    res.send('Hello World')
})

export default app