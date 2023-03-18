import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {FormDataType} from "./Login";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
	isLoggedIn: false,
	isInitialized: false
}

const slice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
			state.isLoggedIn = action.payload.value
		},
		setIsInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
			state.isInitialized = action.payload.value
		}
	}
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC, setIsInitializedAC} = slice.actions

// thunks
export const meTC = () => async (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status:'loading'}))
	try {
		const res = await authAPI.me()
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC({value: true}))
			dispatch(setAppStatusAC({status:'loading'}))
			dispatch(setIsInitializedAC({value: true}))
		} else {
			dispatch(setIsInitializedAC({value: true}))
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}
export const loginTC = (data: FormDataType) => async (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status:'loading'}))
	try {
		const res = await authAPI.login(data)
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC({value: true}))
			dispatch(setAppStatusAC({status:'loading'}))
		} else {
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}
export const logoutTC = () => async (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status:'loading'}))
	try {
		const res = await authAPI.logout()
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC({value: true}))
			dispatch(setAppStatusAC({status:'loading'}))
		} else {
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}

