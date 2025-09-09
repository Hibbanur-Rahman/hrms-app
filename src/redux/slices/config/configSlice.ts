import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface ConfigState{
    baseUrl:string | null;
    companyInfo:any;
}

const initialState:ConfigState={
    baseUrl:null,
    companyInfo:{}
}

const configSlice=createSlice({
    name:'config',
    initialState,
    reducers:{
        handleSetBaseUrl:(state,action:PayloadAction<{baseUrl:string}>)=>{
            state.baseUrl=action.payload.baseUrl;
            console.log("Setting base URL to:", state.baseUrl);
        },
        handleSetCompanyInfo:(state,action:PayloadAction<{companyInfo:any}>)=>{
            state.companyInfo=action.payload.companyInfo;
        }
    }
})

export const {handleSetBaseUrl,handleSetCompanyInfo}=configSlice.actions;
export default configSlice.reducer;