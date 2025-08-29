import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import adminStudentReducer from './Admin-AddStudent/index';

const store = configureStore({
    reducer:{
        auth: authReducer,
        adminStudent: adminStudentReducer,
    }
})

export default store