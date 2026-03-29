import 'dotenv/config'
import app from "./app.js"
import connectDB from "./src/db/index.js"

const PORT = process.env.PORT

const main = async () => {
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`server is running on PORT ${PORT}`)
    })
}

main();