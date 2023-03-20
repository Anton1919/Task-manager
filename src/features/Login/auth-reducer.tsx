import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {FormDataType} from "./Login";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export const loginTC = createAsyncThunk<undefined, FormDataType, {
	rejectValue: { someError: string }
}>("auth/login", async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authAPI.login(param)
		if (res.resultCode === 0) {
			thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
			return
		} else {
			handleServerAppError(res, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue({someError: "error"})
		}
	} catch (e: any) {
		handleServerNetworkError(e, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue({someError: "error"})
	}
})

export const logoutTC = createAsyncThunk("auth/logout", async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authAPI.logout()
		if (res.resultCode === 0) {
			thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
			return
		} else {
			handleServerAppError(res, thunkAPI.dispatch)
			return thunkAPI.rejectWithValue({})
		}
	} catch (e: any) {
		handleServerNetworkError(e, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue({})
	}
})

export const meTC = createAsyncThunk("auth/me", async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	try {
		const res = await authAPI.me()
		if (res.resultCode === 0) {
			thunkAPI.dispatch(setIsLoggedInAC({value: true}))
			thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
			thunkAPI.dispatch(setIsInitializedAC({value: true}))
		} else {
			thunkAPI.dispatch(setIsInitializedAC({value: true}))
			handleServerAppError(res, thunkAPI.dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, thunkAPI.dispatch)
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
		builder.addCase(loginTC.fulfilled, (state) => {
			state.isLoggedIn = true
		})
		builder.addCase(logoutTC.fulfilled, (state) => {
			state.isLoggedIn = false
		})
	}
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC, setIsInitializedAC} = slice.actions





