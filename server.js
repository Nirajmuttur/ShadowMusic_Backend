import app from './express.js'
app.listen(3000, (err) => {
    if(err){
        console.log(err)
    }
  console.log('Server listening on port 3000')
})