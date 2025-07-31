const express  = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth/auth-routes')
const adminRoutes = require('./routes/admin/adminRoutes');
const dotenv = require('dotenv')
const useragent = require('express-useragent');
const studentRouter = require('./routes/student/student-routes')
const adminStudentRouter = require('./routes/admin/studentRoutes')
// const connectDB = require('./config/database');
dotenv.config()
const app = express();                
const port = process.env.PORT || 5000;


// const certificateRoutes = require('./routes/certificates');

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(useragent.express());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

mongoose.connect(process.env.REACT_APP_MONGO_URL).then(() => {console.log('Connected to MongoDB');
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
app.use('/api/admin', adminRoutes);
app.use('/api/adminStudent',adminStudentRouter);
app.use('/api/student',studentRouter);
// app.use('/api/certificates', certificateRoutes);
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/generator', require('./routes/generator'));

app.listen(port,'0.0.0.0',()=>{
    console.log(`Server is running on port ${port}`);
})