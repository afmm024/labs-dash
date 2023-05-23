import { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// components
import Iconify from "../../../components/iconify";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { apiUrl } from "../../../config/api";
import useNotifications from "../../../hooks/useNotification";
import { ReactSession } from 'react-client-session';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [, notificationsActions] = useNotifications();

  const schema = yup
    .object({
      email: yup.string().required("Este campo es requerido"),
      password: yup.string().required("Este campo es requerido"),
    })
    .required();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (valuesForm) => {
    try {
      fetch(`${apiUrl}/auth`, {
        method: "POST",
        body: JSON.stringify(valuesForm),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => {
        if(!response.ok){
          notificationsActions.push({
            options: {
              content: (
                <Alert
                  sx={{ backgroundColor: "#fff" }}
                  variant="outlined"
                  severity="error"
                >
                  {`${response.status} - ${response.statusText}`}
                </Alert>
              )
            }
          })
        }else{
          return response.json()
        }
        
      }) 
      .then(json => {
        console.log(json)
        if(json){
          notificationsActions.push({
            options: {
              content: (
                <Alert
                  sx={{ backgroundColor: "#fff" }}
                  variant="outlined"
                  severity="success"
                >
                  Login Success
                </Alert>
              )
            }
          })
          ReactSession.set("token", json.access_token);
          navigate("/dashboard", { replace: true });
        }         
      })
      .catch(err => {
        notificationsActions.push({
          options: {
            content: (
              <Alert
                sx={{ backgroundColor: "#fff" }}
                variant="outlined"
                severity="error"
              >
                {{err}}
              </Alert>
            )
          }
        })
      });
    } catch (error) {
      notificationsActions.push({
        options: {
          content: (
            <Alert
              sx={{ backgroundColor: "#fff" }}
              variant="outlined"
              severity="error"
            >
              {{error}}
            </Alert>
          )
        }
      })
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <Stack spacing={3}>
        <Controller
          render={({ field }) => (
            <TextField
              type="email"
              error={!!errors.email}
              helperText={errors?.email?.message}
              label="Correo Electrónico"
              {...field}
            />
          )}
          name="email"
          control={control}
        />
        <Controller
          render={({ field }) => (
            <TextField
              label="Contraseña"
              error={!!errors.password}
              helperText={errors?.password?.message}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...field}
            />
          )}
          name="password"
          control={control}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        <Link variant="subtitle2" underline="hover">
          ¿Olvidaste la contraseña?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        disabled={!isDirty || !isValid}
      >
        Iniciar sesión
      </LoadingButton>
    </form>
  );
}
