import React, { useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import TextField from '@mui/material/TextField';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
import { MenuItem, FormControl, Select, FormHelperText, InputLabel } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '8rem',
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
const EditShareholderModal = ({ id, open, setOpen, fetchData }) => {
    const adminData = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    const [shareholderDetails, setShareholderDetails] = useState();
    const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm();
    const [permissions, setPermissions] = useState(adminData?.permissions)
    useEffect(() => {
        const fetchShareholderDetails = async () => {
            try {
                const response = await axiosInstance.get(`shareholder/${id}`);
                const shareholderData = response?.data?.shareholder;
                setShareholderDetails(shareholderData);
                reset({
                    fName: shareholderData?.fName,
                    lName: shareholderData?.lName,
                    civilId: shareholderData?.civilId,
                    email: shareholderData?.email,
                    ibanNumber: shareholderData?.ibanNumber,
                    block: shareholderData?.address?.block,
                    street: shareholderData?.address?.street,
                    city: shareholderData?.address?.city,
                    house: shareholderData?.address?.house,
                    status: shareholderData?.status,
                    membershipStatus: shareholderData?.membershipStatus,
                    dob: shareholderData?.DOB.split("T")[0],
                    poBox: shareholderData?.poBox,
                    mobileNumber: shareholderData?.mobileNumber,
                    area: shareholderDetails?.Area,
                    zipCode: shareholderDetails?.zipCode,
                    country: shareholderData?.Country
                });
            } catch (error) {
                console.error("Failed to fetch shareholder details:", error);
            }
        };

        fetchShareholderDetails();
    }, [id]);



    const handleClose = () => {
        setOpen(false)
        fetchData();
    }
    const onSubmit = async (data) => {
        try {
            const updatedData = { ...data, adminId: adminData?.id }
            await axiosInstance.put(`/shareholder/${id}`, updatedData);
            handleClose();
        } catch (error) {
            console.error('Error posting shareholder data:', error);
        }
    };
    if (!permissions?.shareholder?.edit) {
        return <Box sx={{ width: '90%', backgroundColor: '#FFF', margin: '2rem', padding: '1rem', borderRadius: '0.5rem', overflowX: 'auto' }}>
            <Typography variant='h2'>You Don't Have Permission To View This Information</Typography>
        </Box>;
    }
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-shareholder-modal-title"
            aria-describedby="add-shareholder-modal-description"

        >
            <Box sx={{
                ...style,
                width: '80rem',
            }}
                component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <Grid container spacing={2}>
                    {/* Column 1 */}
                    <Grid item xs={12} sm={6} md={6}>
                        <Typography variant="h6">
                            Shareholder Details
                        </Typography>
                        <TextField margin="normal" fullWidth label="First Name" {...register('fName', { required: true })} error={!!errors.fName} helperText={errors.fName ? 'First Name is required' : ''} />
                        <TextField margin="normal" fullWidth label="Last Name" {...register('lName', { required: true })} error={!!errors.lName} helperText={errors.lName ? 'Last Name is required' : ''} />
                        <TextField margin="normal" fullWidth label="Civil ID" {...register('civilId', { required: true })} error={!!errors.civilId} helperText={errors.civilId ? 'Civil ID is required' : ''} />
                        <TextField margin="normal" fullWidth label="Email" {...register('email', { required: true })} error={!!errors.email} helperText={errors.email ? 'Email is required' : ''} />
                        <TextField margin="normal" fullWidth label="Phone Number" {...register('mobileNumber', { required: true })} error={!!errors.mobileNumber} helperText={errors.mobileNumber ? 'Phone Number is required' : ''} />
                        <TextField margin="normal" fullWidth label="IBAN Number" {...register('ibanNumber', { required: true })} error={!!errors.ibanNumber} helperText={errors.ibanNumber ? 'IBAN Number is required' : ''} />
                        <TextField margin="normal" fullWidth type="date"  {...register('dob', { required: true })} error={!!errors.dob} helperText={errors.dob ? 'Date of Birth is required' : ''} />
                        <FormControl fullWidth error={!!errors.status} margin="normal">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: true }}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="status-label"
                                        label="Status"
                                    >
                                        <MenuItem value={"0"}>Active</MenuItem>
                                        <MenuItem value={"1"}>Inactive</MenuItem>
                                        <MenuItem value={"2"}>Death</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && <FormHelperText>Status is required</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth error={!!errors.status} margin="normal">
                            <InputLabel id="status-label">Status</InputLabel>
                            <Controller
                                name="membershipStatus"
                                control={control}
                                rules={{ required: true }}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="status-label"
                                        label="Membership Status"
                                    >
                                        <MenuItem value={"0"}>Active</MenuItem>
                                        <MenuItem value={"1"}>Inactive</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && <FormHelperText>Membership Status is required</FormHelperText>}
                        </FormControl>
                    </Grid>
                    {/* Column 2 */}
                    <Grid item xs={12} sm={6} md={6}>
                        <Typography variant="h6">
                            Address
                        </Typography>
                        <TextField margin="normal" fullWidth label="Block" {...register('block', { required: true })} error={!!errors.block} helperText={errors.block ? 'Block is required' : ''} />
                        <TextField margin="normal" fullWidth label="City" {...register('city', { required: true })} error={!!errors.city} helperText={errors.city ? 'City is required' : ''} />
                        <TextField margin="normal" fullWidth label="PO Box" {...register('poBox')} />
                        <TextField margin="normal" fullWidth label="House Number" {...register('house', { required: true })} error={!!errors.house} helperText={errors.house ? 'House Number is required' : ''} />
                        <TextField margin="normal" fullWidth label="Street" {...register('street', { required: true })} error={!!errors.street} helperText={errors.street ? 'Street is required' : ''} />
                        <TextField margin="normal" fullWidth label="Area" {...register('area', { required: true })} error={!!errors.area} helperText={errors.area ? 'Area is required' : ''} />
                        <TextField margin="normal" fullWidth label="Zip Code" {...register('zipCode')} />
                        <TextField margin="normal" fullWidth label="Country" {...register('country', { required: true })} error={!!errors.country} helperText={errors.country ? 'Country is required' : ''} />
                    </Grid>
                    {/* Column 3
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="h6">
                            Investment
                        </Typography>
                        <TextField margin="normal" fullWidth label="Savings Initial Price" type="number" {...register('savingsInitialPrice', { required: true })} error={!!errors.savingsInitialPrice} helperText={errors.savingsInitialPrice ? 'Savings Initial Price is required' : ''} />
                        <TextField margin="normal" fullWidth label="Share Initial Price" type="number" {...register('shareInitialPrice', { required: true })} error={!!errors.shareInitialPrice} helperText={errors.shareInitialPrice ? 'Share Initial Price is required' : ''} />
                        <TextField margin="normal" fullWidth label="Share Amount" type="number" {...register('shareAmount', { required: true })} error={!!errors.shareAmount} helperText={errors.shareAmount ? 'Share Amount is required' : ''} />

                    </Grid> */}
                    {/* <Grid item xs={12} sm={6} md={3}>
                      
                    </Grid> */}
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Edit
                </Button>
            </Box>
        </Modal>

    );
}

export default EditShareholderModal