const express  = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes')
const dotenv = require('dotenv')
const useragent = require('express-useragent');


dotenv.config()
const app = express();                
const port = process.env.PORT || 5000;
app.use(cookieParser());
app.use(express.json());
app.use(useragent.express());

mongoose.connect(process.env.MONGO_URL).then(() => {console.log('Connected to MongoDB');
}).catch((err) => console.log(err+"failed to connect"));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization','Cache-Control','Expires','Pragma'],
    credentials: true

}));
app.get('/',(req,res)=>{
      console.log(req.useragent.browser);
      console.log(req.useragent.os);

})
app.use('/api/auth',authRouter)
app.listen(port,'0.0.0.0',()=>{
    console.log(`Server is running on port ${port}`);
})