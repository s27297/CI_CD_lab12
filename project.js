const [add,razy,divide]=require('./functions.js')

express=require('express')

app = express()

app.get('/api/status', (req, res)=> {
    let version1=process.version
    let status1="health"
    res.json({'version': version1,'status':status1})
})

app.get('/api/data', (req, res)=> {
    let a=add(5,7)
    let b=razy(5,7)
    res.json({'add_5_7': a,'razy_5_7': b})
})

const PORT=process.env.PORT || 5000
const server=app.listen(PORT,()=>{
    const host=server.address().address
    const port=server.address().port
    console.log("Server listening on port at http://"+host+port)
})