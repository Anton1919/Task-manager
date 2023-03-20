import {Dispatch} from 'redux'
import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {FormDataType} from "./Login";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk<{isLoggedIn: boolean}, FormDataType, {
	rejectValue: {someError: string}
}>("auth/login", async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authAPI.login(param)
		if (res.resultCode === 0) {
			thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
			return {isLoggedIn: true}
		} else {
			handleServerAppError(res, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue({someError: "error"})
		}
	} catch (e: any) {
		handleServerNetworkError(e, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue({someError: "error"})
	}
})


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
	},
	extraReducers: builder => {
		builder.addCase(loginTC.fulfilled, (state, action) => {
			state.isLoggedIn = action.payload.isLoggedIn
		})
	}
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC, setIsInitializedAC} = slice.actions

// thunks
export const meTC = () => async (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authAPI.me()
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC({value: true}))
			dispatch(setAppStatusAC({status: 'loading'}))
			dispatch(setIsInitializedAC({value: true}))
		} else {
			dispatch(setIsInitializedAC({value: true}))
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}

export const logoutTC = () => async (dispatch: Dispatch) => {
	dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authAPI.logout()
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC({value: false}))
			dispatch(setAppStatusAC({status: 'succeeded'}))
		} else {
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}

