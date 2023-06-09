import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {useAppDispatch, useAppSelector} from './store'
import {RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import {CircularProgress} from "@mui/material";
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {logoutTC, meTC} from "../features/Login/auth-reducer";

function App() {
	const status = useAppSelector<RequestStatusType>((state) => state.app.status)
	const isInitialized = useAppSelector<boolean>((state) => state.auth.isInitialized)
	const isLoggedIn = useAppSelector<boolean>((state) => state.auth.isLoggedIn)
	const dispatch = useAppDispatch()

	const logoutHandler = () => {
		dispatch(logoutTC())
	}

	useEffect(() => {
		dispatch(meTC())
	}, [])

	if (!isInitialized) {
		return <div
			style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
			<CircularProgress/>
		</div>
	}

	return (
		<div className="App">
			<ErrorSnackbar/>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="menu">
						<Menu/>
					</IconButton>
					<Typography variant="h6">
						News
					</Typography>

					{isLoggedIn && <Button color="inherit" onClick={logoutHandler}>Log out</Button>}
				</Toolbar>
				{status === 'loading' && <LinearProgress/>}
			</AppBar>
			<Container fixed>
				<Routes>
					<Route path={'/'} element={<TodolistsList/>}/>
					<Route path={'/login'} element={<Login/>}/>

					<Route path={'/404'} element={<h1>PAGE NOT FOUND</h1>}/>
					<Route path={'*'} element={<Navigate to={'/404'}/>}/>

				</Routes>
			</Container>
		</div>
	)
}

export default App
