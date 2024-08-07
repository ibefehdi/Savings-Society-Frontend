import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, Select } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import {
    useNavigate,
} from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { useTranslation } from 'react-i18next';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import BackButton from '../../components/BackButton';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '10rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const Users = () => {
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const { data, fetchData, count } = useFetch('/users', pageNo, pageSize)
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const { t, i18n } = useTranslation();
    const cacheRtl = createCache({
        key: 'muirtl',
        stylisPlugins: [prefixer, rtlPlugin],
    });
    const cacheLtr = createCache({
        key: 'muilt',
    });
    let navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false); // New state for edit mode
    const [currentUser, setCurrentUser] = useState(null);
    const [missingFields, setMissingFields] = useState([]);
    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm()
    const handleOpen = (user = null) => {
        setOpen(true);
        if (user) {
            setEditMode(true);
            setCurrentUser(user);
            // Prefill form with user data
            Object.keys(user).forEach(key => {
                setValue(key, user[key]);
            });
        } else {
            setEditMode(false);
            setCurrentUser(null);
            reset(); // Reset form for adding
        }
    };
    const handleDelete = (user) => {
        setUserToDelete(user);
        setOpenConfirmDialog(true);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            try {
                const response = await axiosInstance.get(`/deleteuser/${userToDelete._id}`);
                console.log("response: " + JSON.stringify(response));
                // Close dialog and refresh data or any additional state updates
                setOpenConfirmDialog(false);
                setUserToDelete(null);
                fetchData();
            } catch (error) {
                console.error("Deletion error:", error);
                setOpenConfirmDialog(false);
                setUserToDelete(null);
            }
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setUserToDelete(null);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetchData();
    }, [pageNo, pageSize]);

    const [paginationModel, setPaginationModel] = useState({
        pageSize: pageSize,
        page: pageNo,
    });

    const onSubmit = async (formData) => {
        // Convert permissions to boolean values if needed
        const convertPermissionsToBoolean = (permissions) => {
            for (const category in permissions) {
                for (const permission in permissions[category]) {
                    permissions[category][permission] = permissions[category][permission] === true;
                }
            }
            return permissions;
        };

        // Ensure permissions are correctly formatted as booleans
        if (formData.permissions) {
            formData.permissions = convertPermissionsToBoolean(formData.permissions);
        }
        if (editMode) {
            // Update existing user
            try {
                const response = await axiosInstance.put(`/user/${currentUser._id}`, formData);
                console.log(response.data);
                handleClose();
                reset();
                fetchData();
            } catch (err) {
                console.error(err.response ? err.response.data : 'An error occurred');
            }
        }
        else {
            try {
                const response = await axiosInstance.post('/users/signup', formData);
                console.log(response.data);
                handleClose();
                reset();
                fetchData()
            } catch (err) {
                console.error(err.response ? err.response.data : 'An error occurred');
                // Assuming err.response.data.missing holds the array of missing field names
                if (err.response && err.response.data && err.response.data.missing) {
                    setMissingFields(err.response.data.missing); // Update your state accordingly
                }
            }
        }

    };
    const permissionsToString = (permissions) => {
        if (!permissions) return 'No Permissions';
        return Object.entries(permissions).reduce((acc, [key, value]) => {
            if (value) {
                acc.push(key);
            }
            return acc;
        }, []).join(', ');
    };
    const columns = [
        {
            field: 'Full Name',
            headerName: t('full_name'),
            flex: 1,
            renderCell: (params) => {
                return `${params.row.fName} ${params.row.lName}`
            }
        },
        {
            field: 'username',
            headerName: t('username'),
            width: 150,
        },
        {
            field: 'email',
            headerName: t('email'),
            width: 150,
        },
        {
            field: 'phoneNo',
            headerName: t('phone_number'),
            width: 150,
        },
        {
            field: 'permissions.shareholder',
            headerName: t('shareholder_permissions'),
            width: 250, // Adjusted width to accommodate permissions text
            renderCell: (params) => {
                // Directly accessing the nested permissions for 'shareholder' or 'user'
                const permissionsText = permissionsToString(params.row.permissions.shareholder); // Adjust based on actual data structure
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {permissionsText}
                    </Box>
                );
            },

        },
        {
            field: 'permissions.user',
            headerName: t('user_permissions'),
            width: 250, // Adjusted width to accommodate permissions text
            renderCell: (params) => {
                // Directly accessing the nested permissions for 'shareholder' or 'user'
                const permissionsText = permissionsToString(params.row.permissions.user); // Adjust based on actual data structure
                return (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {permissionsText}
                    </Box>
                );
            },

        },
        {
            field: 'isAdmin',
            headerName: t('admin'),
            width: 55,
            renderCell: (params) => {
                return (
                    <Box
                        sx={{
                            width: 14,
                            height: 14,
                            backgroundColor: params.value ? 'green' : 'red',
                            borderRadius: '50%',
                            display: 'inline-block',
                        }}
                    />
                );
            },
        },
        {
            field: 'edit',
            headerName: t('edit'),
            sortable: false,
            width: 55,
            renderCell: (params) => {
                return (
                    <IconButton

                        onClick={() => { setMissingFields([]); handleOpen(params.row) }}
                    >
                        <ModeEditIcon />
                    </IconButton>

                );
            },
        },
        {
            field: 'delete',
            headerName: t('delete'),
            sortable: false,
            width: 55,
            renderCell: (params) => {
                return (
                    <IconButton onClick={() => handleDelete(params.row)}>
                        <DeleteIcon color="error" />
                    </IconButton>
                );
            },
        }
    ];
    const ConfirmDeleteDialog = () => (
        <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this user?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseConfirmDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirmDelete} color="primary" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
    const isRtl = i18n.dir() === 'rtl';
    const orderedColumns = isRtl ? [...columns].reverse() : columns;
    return (
        <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
            <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem' }}>
                <Box sx={{ display: 'flex', alignContent: 'flex-end', justifyContent: 'space-between', marginBottom: '1rem', width: "100%", }}>

                    <Typography variant="h3" component="h2" sx={{
                        fontStyle: 'normal', // Sets the font style
                        fontWeight: 600, // Sets the font weight
                        lineHeight: '1.875rem', flexGrow: 1,
                        marginLeft: '1.2rem'
                    }}>
                        {t('users')}
                    </Typography>
                    <Button variant='contained' onClick={() => { setMissingFields([]); setEditMode(false); handleOpen() }}>{t('add')}</Button>
                    <BackButton />

                </Box>
                <DataGrid
                    rows={data}
                    columns={orderedColumns.map((column) => ({
                        ...column,
                        disableColumnMenu: true,
                    }))}
                    paginationModel={paginationModel}
                    onPaginationModelChange={(newModel) => {
                        setPageNo(newModel.page + 1);
                        setPaginationModel(newModel);
                    }}
                    getRowId={(row) => row._id}
                    rowCount={count}
                    paginationMode="server"
                    sx={{
                        backgroundColor: '#FFF',
                        padding: '1rem',
                        direction: isRtl ? 'rtl' : 'ltr',
                        border: 'none',
                        width: '100%',
                        '& .MuiDataGrid-columnHeadersInner': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-virtualScroller': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-virtualScrollerContent': {
                            border: 'none',
                        },
                        '& .MuiDataGrid-footerContainer': {
                            borderTop: 'none',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            border: 'none',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: '1.25rem',
                            color: '#667085',
                            fontSize: '0.875rem'
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        },
                    }}
                />

            </Box>
            <ConfirmDeleteDialog />

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box
                    sx={{
                        ...style,
                        width: '80rem',
                    }}
                >
                    <Typography variant='h5' id="child-modal-title" sx={{ mb: 2 }}>{editMode ? "Edit User" : "Add User Details"}</Typography>
                    <Grid container spacing={12}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="fName"
                                label={t('first_name')}
                                variant="outlined"
                                fullWidth
                                autoComplete='off'
                                {...register("fName")}
                                sx={{ mb: 2 }}
                                error={missingFields.includes("fName")}
                                helperText={missingFields.includes("fName") ? "This field is required." : ""}

                            />
                            <TextField
                                id="lName"
                                label={t('last_name')}
                                variant="outlined"
                                fullWidth
                                autoComplete='off'
                                {...register("lName")}
                                sx={{ mb: 2 }}
                                error={missingFields.includes("lName")}
                                helperText={missingFields.includes("NName") ? "This field is required." : ""}

                            />
                            <TextField
                                id="Username"
                                label={t('username')}
                                variant="outlined"
                                fullWidth
                                autoComplete='off'
                                {...register("username")}
                                sx={{ mb: 2 }}
                                error={missingFields.includes("username")}
                                helperText={missingFields.includes("username") ? "This field is required." : ""}

                            />
                            <TextField
                                id="Password"
                                label={t('password')}
                                variant="outlined"
                                fullWidth
                                {...register("password")}
                                sx={{ mb: 2 }}
                                error={missingFields.includes("password")}
                                helperText={missingFields.includes("password") ? "This field is required." : ""}

                            />
                            <TextField
                                id="Email"
                                label={t('email')}
                                variant="outlined"
                                fullWidth
                                {...register("email")}
                                sx={{ mb: 2 }}
                                error={missingFields.includes("email")}
                                helperText={missingFields.includes("email") ? "This field is required." : ""}

                            />
                            <TextField
                                id="PhoneNo"
                                label={t('phone_number')}
                                variant="outlined"
                                fullWidth
                                {...register("phoneNo")}
                                sx={{ mb: 2 }}
                                error={missingFields.includes("phoneNo")}
                                helperText={missingFields.includes("phoneNo") ? "This field is required." : ""}

                            />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel id="user-type-label">User Type</InputLabel>
                                <Select
                                    labelId="user-type-label"
                                    id="user-type"
                                    multiple
                                    value={watch("userType") || []}
                                    onChange={(e) => setValue("userType", e.target.value)}
                                    renderValue={(selected) => selected.join(", ")}
                                    label="User Type"
                                >
                                    <MenuItem value="Rental">Rental</MenuItem>
                                    <MenuItem value="Shareholder">Shareholder</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant='h6' sx={{ mb: 2 }}>{t('permissions')}</Typography>
                            {/* Shareholder Permissions */}
                            <Typography variant='subtitle1'>{t('shareholder_permissions')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.shareholder.create"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('create')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.shareholder.view"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('view')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.shareholder.edit"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('edit')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.shareholder.delete"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('delete')}
                                />
                            </FormGroup>
                            {/* User Permissions */}
                            <Typography variant='subtitle1' sx={{ mt: 2 }}>{t('user_permissions')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.user.create"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('create')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.user.view"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('view')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.user.edit"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('edit')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.user.delete"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('delete')}
                                />
                            </FormGroup>
                            {/* User Permissions */}
                            <Typography variant='subtitle1' sx={{ mt: 2 }}>{t('amanat_permissions')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.amanat.create"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('create')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.amanat.view"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('view')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.amanat.edit"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('edit')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.amanat.delete"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('delete')}
                                />
                            </FormGroup>


                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant='subtitle1' sx={{ mt: 2 }}>{t('deposit_permissions')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.deposit.share"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('share')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.deposit.savings"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('savings')}
                                />

                            </FormGroup>
                            <Typography variant='subtitle1' sx={{ mt: 2 }}>{t('withdrawal_permissions')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.withdrawal.share"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('share')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.withdrawal.savings"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('savings')}
                                />

                            </FormGroup>
                            <Typography variant='subtitle1' sx={{ mt: 2 }}>{t('financial_configuration_permissions')}</Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.financialConfiguration.share"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('share')}
                                />
                                <FormControlLabel
                                    control={
                                        <Controller
                                            name="permissions.financialConfiguration.savings"
                                            control={control}
                                            render={({ field }) => <Checkbox {...field} checked={field.value} />}
                                        />
                                    }
                                    label={t('savings')}
                                />

                            </FormGroup>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleSubmit(onSubmit)}>{editMode ? t('edit') : t('add')}</Button>
                        <Button onClick={handleClose} >
                            {t('close')}
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </CacheProvider>

    )
}

export default Users