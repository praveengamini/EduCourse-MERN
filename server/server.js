import express, { json } from 'express';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth/auth-routes.js';
import dotenv from 'dotenv';
import { express as _express } from 'express-useragent';
dotenv.config()

const app = express();                
const port = process.env.REACT_APP_PORT || 5000;
app.use(cookieParser());
app.use(json());
app.use(_express());

connect(process.env.REACT_APP_MONGO_URL).then(() => {console.log('Connected to MongoDB');
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
app.use('/api/auth',authRouter);
app.listen(port,'0.0.0.0',()=>{
    console.log(`Server is running on port ${port}`);
})