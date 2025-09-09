import { configureStore } from "@reduxjs/toolkit";
import authSlice from './slices/auth/authSlice';
import configSlice from './slices/config/configSlice';

const store=configureStore({
    reducer:{
        auth:authSlice,
        config:configSlice,
    }
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;

export default store;