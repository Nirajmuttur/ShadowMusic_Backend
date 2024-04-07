import connectDB from './db/index.ts'
import app from './express.ts'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env'
})


connectDB().then(()=>{
  app.listen(process.env.PORT || 3000, () => {
    console.log(`⚙️Server listening on port ${process.env.PORT}`)
  })
  app.on("error",(error)=>{
    console.log("ERRR: ", error);
    throw error
  })
}).catch((err)=>{
  console.log("MONGO db connection failed !!! ", err);
})

