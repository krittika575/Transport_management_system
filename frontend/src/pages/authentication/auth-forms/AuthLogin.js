import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig'; // import Firebase auth configuration

// material-ui imports
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const AuthLogin = () => {
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const validateForm = () => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }
    return valid;
  };

  const login = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setLoginError('');
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch({ type: 'MANAGER_LOGIN_SUCCESS', payload: user });
      localStorage.setItem('currentManager', JSON.stringify(user));
      setLoginSuccess('Login successful.');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      setLoginError('Login unsuccessful. Please check your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form noValidate onSubmit={login}>
        {isLoading && (
          <div style={{ marginBottom: '20px' }}>
            <LinearProgress />
          </div>
        )}
        {loginError && (
          <Alert severity="error" style={{ marginBottom: '10px' }}>{loginError}</Alert>
        )}
        {loginSuccess && (
          <Alert severity="success" style={{ marginBottom: '10px' }}>{loginSuccess}</Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-login">Email Address</InputLabel>
              <OutlinedInput
                id="email-login"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                fullWidth
                error={!!emailError}
              />
              {emailError && (
                <Typography variant="caption" color="error">
                  {emailError}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-login">Password</InputLabel>
              <OutlinedInput
                id="password-login"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="Enter password"
                error={!!passwordError}
              />
              {passwordError && (
                <Typography variant="caption" color="error">
                  {passwordError}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} color="primary" />}
                label={<Typography variant="h6">Keep me signed in</Typography>}
              />
              <Link variant="h6" component={RouterLink} to="/forgot-password">
                Forgot Password?
              </Link>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <AnimateButton>
              <Button fullWidth size="large" type="submit" variant="contained" color="primary">
                Login
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AuthLogin;
