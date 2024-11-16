// src/components/AuthRegister.js
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { auth, createUserWithEmailAndPassword, googleProvider, signInWithPopup } from './firebaseConfig';
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const AuthRegister = () => {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const handleGoogleSignup = async () => {
    const provider = new googleProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google signup successful:", result.user);
    } catch (error) {
      console.error("Error during Google signup:", error.message);
    }
  };

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        email: '',
        company: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        firstname: Yup.string().max(255).required('First Name is required'),
        lastname: Yup.string().max(255).required('Last Name is required'),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().min(6, 'Password should be at least 6 characters').max(255).required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await createUserWithEmailAndPassword(auth, values.email, values.password);
          setStatus({ success: true });
          setSubmitting(false);
          console.log("User registered successfully");
        } catch (error) {
          console.error("Error during registration:", error.message);
          setStatus({ success: false });
          setErrors({ submit: error.message });
          setSubmitting(false);
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
                <OutlinedInput
                  id="firstname-signup"
                  type="text"
                  value={values.firstname}
                  name="firstname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="John"
                  fullWidth
                  error={Boolean(touched.firstname && errors.firstname)}
                  autoComplete="given-name"
                />
                {touched.firstname && errors.firstname && (
                  <FormHelperText error id="helper-text-firstname-signup">
                    {errors.firstname}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack spacing={1}>
                <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
                <OutlinedInput
                  id="lastname-signup"
                  type="text"
                  value={values.lastname}
                  name="lastname"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Doe"
                  fullWidth
                  error={Boolean(touched.lastname && errors.lastname)}
                  autoComplete="family-name"
                />
                {touched.lastname && errors.lastname && (
                  <FormHelperText error id="helper-text-lastname-signup">
                    {errors.lastname}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                <OutlinedInput
                  id="email-signup"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="demo@company.com"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                  autoComplete="email"
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-signup">Password*</InputLabel>
                <OutlinedInput
                  id="password-signup"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changePassword(e.target.value);
                  }}
                  placeholder="******"
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  autoComplete="new-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="large"
                      >
                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
              </Stack>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" fontSize="0.75rem">
                      {level?.label}
                    </Typography>
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                By Signing up, you agree to our &nbsp;
                <Link variant="subtitle2" component={RouterLink} to="#">
                  Terms of Service
                </Link>
                &nbsp; and &nbsp;
                <Link variant="subtitle2" component={RouterLink} to="#">
                  Privacy Policy
                </Link>
              </Typography>
            </Grid>
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                Create Account
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="caption">Sign up with</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleGoogleSignup} fullWidth size="large" variant="outlined">
                Sign up with Google
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthRegister;
