import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    user:any;
    isAuthenticated:boolean;
}

const initialState:AuthState={
    user:null,
    isAuthenticated:false,
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        handleIsAuthenticated:(state,action:PayloadAction<{isAuthenticated:boolean}>)=>{
            state.isAuthenticated=action.payload.isAuthenticated;
            console.log("is AUthenticated:",state.isAuthenticated)
        },
        handleLogout:(state,action:PayloadAction<{isAuthenticated:boolean}>)=>{
            state.isAuthenticated=action.payload.isAuthenticated;
        },
        handleUserLogin:(state,action)=>{
            console.log("user:",action.payload);
            state.user={...state.user,...action.payload};
            console.log("user after set:",state.user);
        }
    }
})

export const {handleIsAuthenticated,handleLogout,handleUserLogin}=authSlice.actions;
export default authSlice.reducer;