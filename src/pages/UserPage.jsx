import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
// @mui
import {
  Card,
  Button,
  Container,
  Typography,
  Alert,
  Stack,
  Box,
  ListItemIcon,
  MenuItem,
  Modal,
} from "@mui/material";
// components
import Iconify from "../components/iconify";
// mock

import { ReactSession } from "react-client-session";
import useNotifications from "../hooks/useNotification";
import { apiUrl } from "../config/api";

import MaterialReactTable from "material-react-table";
import { AccountCircle, Send } from "@mui/icons-material";
import UserForm from "../sections/users/UserForm";

export default function UserPage() {
  const [token, setToken] = useState(null);

  const [USERLIST, setUsers] = useState([]);

  const [stateModal, setStateModal] = useState(false);

  const [, notificationsActions] = useNotifications();

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'calc( ( 100% - 400px ) / 2)',
    bgcolor: 'background.paper',
    border: '2px solid #919eab1f',
    boxShadow: 24,
    p: 4,
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: (row) => `${row.name} ${row.lastName}`, //access nested data with dot notation
        header: "Nombre",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "country", //normal accessorKey
        header: "País",
      },
      {
        accessorKey: "role",
        header: "Rol",
      },
      {
        accessorKey: "isActive",
        header: "Estado de usuario",
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              backgroundColor: !cell.getValue()
                ? theme.palette.error.dark
                : theme.palette.success.dark,
              borderRadius: "0.25rem",
              color: "#fff",
              maxWidth: "9ch",
              p: "0.25rem",
            })}
          >
            {cell.getValue() ? "Activo" : "Inactivo"}
          </Box>
        ),
      },
    ],
    []
  );

  useEffect(() => {
    const tokenData = ReactSession.get("token");
    if (tokenData) {
      setToken(tokenData);
      handleUsers(tokenData);
    }
  }, []);

  const handleUsers = async (token) => {
    try {
      fetch(`${apiUrl}/users`, {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
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
                ),
              },
            });
          }
        })
        .then((json) => {
          if (json) {
            setUsers(json);
          }
        })
        .catch((err) => {
          notificationsActions.push({
            options: {
              content: (
                <Alert
                  sx={{ backgroundColor: "#fff" }}
                  variant="outlined"
                  severity="error"
                >
                  {err}
                </Alert>
              ),
            },
          });
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
              {error}
            </Alert>
          ),
        },
      });
    }
  };

  return (
    <>
      <Helmet>
        <title> Usuarios | Dashboard Labs </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setStateModal(true)}
          >
            Nuevo usuario
          </Button>
        </Stack>

        <Card>
          <MaterialReactTable
            columns={columns}
            data={USERLIST}
            enableColumnActions={false}
            enableColumnFilters={false}
            enableSorting={false}
            enableRowActions
            enableFullScreenToggle={false}
            muiTableBodyRowProps={{ hover: true }}
            renderRowActionMenuItems={({ closeMenu, row }) => [
              <MenuItem sx={{ color: "error.main" }}>
                <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
                Eliminar
              </MenuItem>,
              <MenuItem key={1} onClick={() => {}} sx={{ m: 0 }}>
                <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
                Editar
              </MenuItem>,
            ]}
          />
        </Card>
        <Modal
          open={stateModal}
          onClose={() => setStateModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
              <UserForm />
          </Box>
        </Modal>
      </Container>
    </>
  );
}
