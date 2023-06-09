import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {loginTC} from "./auth-reducer";
import {useAppDispatch, useAppSelector} from "../../app/store";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
	email?: string
	password?: string
	rememberMe?: boolean
}

export type FormDataType = {
	email: string
	password: string
	rememberMe: boolean
}

export const Login = () => {
	const dispatch = useAppDispatch()
	const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

	const formik = useFormik({

		initialValues: {
			email: '',
			password: '',
			rememberMe: false
		},
		validate: (values) => {
			const errors: FormikErrorType = {}
			const regexResult = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
			if (!values.email) {
				errors.email = 'Required'
			} else if (!regexResult) {
				errors.email = 'Invalid email address'
			}
			if (!values.password) {
				errors.password = 'Required'
			} else if (values.password.length < 3) {
				errors.password = 'Should be more 3 symbols'
			}
			return errors
		},
		onSubmit: async (values: FormDataType, formikHelpers: FormikHelpers<FormDataType>) => {
			const action = await dispatch(loginTC(values))
			if (loginTC.rejected.match(action)) {
				if (action.payload?.someError) {
					const error = action.payload?.someError
					formikHelpers.setFieldError("email", "fake error")
				}
			}
			formik.resetForm()
		}
	})

	if (isLoggedIn) {
		return <Navigate to={'/'}/>
	}

	return <Grid container justifyContent={'center'}>
		<Grid item justifyContent={'center'}>
			<FormControl>
				<FormLabel>
					<p>To log in get registered
						<a href={'https://social-network.samuraijs.com/'}
							 target={'_blank'}> here
						</a>
					</p>
					<p>or use common test account credentials:</p>
					<p>Email: free@samuraijs.com</p>
					<p>Password: free</p>
				</FormLabel>
				<form onSubmit={formik.handleSubmit}>
					<FormGroup>
						<TextField
							label="Email"
							margin="normal"
							{...formik.getFieldProps('email')}
						/>

						{formik.errors.email && formik.touched.email && <div style={{color: 'red'}}>{formik.errors.email}</div>}

						<TextField
							type="password"
							label="Password"
							margin="normal"
							{...formik.getFieldProps('password')}
						/>

						{formik.errors.password && formik.touched.password &&
                <div style={{color: 'red'}}>{formik.errors.password}</div>}

						<FormControlLabel label={'Remember me'} control={
							<Checkbox
								checked={formik.values.rememberMe}
								{...formik.getFieldProps('rememberMe')}
							/>}/>

						<Button type={'submit'} variant={'contained'} color={'primary'}>
							Login
						</Button>
					</FormGroup>
				</form>
			</FormControl>
		</Grid>
	</Grid>
}