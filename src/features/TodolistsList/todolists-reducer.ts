import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {RequestStatusType, setAppStatusAC} from '../../app/app-reducer'
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {handleServerNetworkError} from "../../utils/error-utils";

export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists", async (param, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
	const res = await todolistsAPI.getTodolists()

	try {
		thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
		return {todolists: res.data}
	} catch (e: any) {
		handleServerNetworkError(e, thunkAPI.dispatch)
		return thunkAPI.rejectWithValue(null)
	}
})

export const removeTodolistTC = createAsyncThunk("todolists/removeTodolist", async (param: { todolistId: string }, thunkAPI) => {
	thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
	//изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
	thunkAPI.dispatch(changeTodolistEntityStatusAC({id: param.todolistId, status: 'loading'}))
	try {
		const res = todolistsAPI.deleteTodolist(param.todolistId)
		thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
		return {id: param.todolistId}
	} catch (e: any) {
		return thunkAPI.rejectWithValue(null)
	}
})

export const addTodolistTC = createAsyncThunk("todolists/addTodolist", async (param: { title: string }, thunkAPI) => {
	try {
		thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
		const res = await todolistsAPI.createTodolist(param.title)
		thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
		return {todolist: res.data.data.item}
	} catch (e: any) {
		return thunkAPI.rejectWithValue(null)
	}
})
export const changeTodolistTitleTC = createAsyncThunk("todolists/changeTodolistTitle", async (param: { id: string, title: string }, thunkAPI) => {
	try {
		const res = await todolistsAPI.updateTodolist(param.id, param.title)
		return {title: param.title, id: param.id}
	} catch (e: any) {
		return thunkAPI.rejectWithValue(null)
	}
})


const slice = createSlice({
	name: "todolists",
	initialState: [] as Array<TodolistDomainType>,
	reducers: {
		changeTodolistFilterAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			state[index].filter = action.payload.filter
		},
		changeTodolistEntityStatusAC: (state, action: PayloadAction<{ id: string, status: RequestStatusType }>) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			state[index].entityStatus = action.payload.status
		},

	},
	extraReducers: (builder) => {
		builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
			return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
		})
		builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			if (index > -1) {
				state.splice(index, 1)
			}
		})
		builder.addCase(addTodolistTC.fulfilled, (state, action) => {
			state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
		})
		builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
			const index = state.findIndex(tl => tl.id === action.payload.id)
			state[index].title = action.payload.title
		})
	}
})

export const todolistsReducer = slice.reducer
export const {
	changeTodolistFilterAC,
	changeTodolistEntityStatusAC
} = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
	filter: FilterValuesType
	entityStatus: RequestStatusType
}

