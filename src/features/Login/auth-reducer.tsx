import {Dispatch} from 'redux'
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {FormDataType} from "./Login";

const initialState = {
	isLoggedIn: false,
	isInitialized: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
	switch (action.type) {
		case 'login/SET-IS-LOGGED-IN':
			return {...state, isLoggedIn: action.value}
		case 'login/SET-IS-INITIALIZED':
			return {...state, isInitialized: action.value}
		default:
			return state
	}
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
	({type: 'login/SET-IS-LOGGED-IN', value} as const)
export const setIsInitializedAC = (value: boolean) =>
	({type: 'login/SET-IS-INITIALIZED', value} as const)

// thunks
export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
	dispatch(setAppStatusAC('loading'))
	try {
		const res = await authAPI.me()
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC(true))
			dispatch(setAppStatusAC('succeeded'))
			dispatch(setIsInitializedAC(true))
		} else {
			dispatch(setIsInitializedAC(true))
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}

export const loginTC = (data: FormDataType) => async (dispatch: Dispatch<ActionsType>) => {
	dispatch(setAppStatusAC('loading'))
	try {
		const res = await authAPI.login(data)
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC(true))
			dispatch(setAppStatusAC('succeeded'))
		} else {
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}

export const logoutTC = () => async (dispatch: Dispatch<ActionsType>) => {
	dispatch(setAppStatusAC('loading'))
	try {
		const res = await authAPI.logout()
		if (res.resultCode === 0) {
			dispatch(setIsLoggedInAC(false))
			dispatch(setAppStatusAC('succeeded'))
		} else {
			handleServerAppError(res, dispatch)
		}
	} catch (e: any) {
		handleServerNetworkError(e, dispatch)
	}
}

// types
type ActionsType =
	ReturnType<typeof setIsLoggedInAC>
	| ReturnType<typeof setIsInitializedAC>
	| SetAppStatusActionType
	| SetAppErrorActionType
