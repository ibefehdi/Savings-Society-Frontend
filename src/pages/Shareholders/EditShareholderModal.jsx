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
import { useTranslation } from 'react-i18next';

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
                    country: shareholderData?.Country,
                    quitDate: shareholderData?.quitDate,
                    joinDate: shareholderData?.joinDate,
                });
            } catch (error) {
                console.error("Failed to fetch shareholder details:", error);
            }
        };

        fetchShareholderDetails();
    }, [id]);


    const { i18n, t } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
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
            sx={{ direction: isRtl ? 'rtl' : 'ltr' }}

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
                            {t('shareholder_details')}
                        </Typography>
                        <TextField margin="normal" fullWidth label={t('first_name')} {...register('fName', { required: true })} error={!!errors.fName} helperText={errors.fName ? 'First Name is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('last_name')} {...register('lName', { required: true })} error={!!errors.lName} helperText={errors.lName ? 'Last Name is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('civil_id')} {...register('civilId', { required: true })} error={!!errors.civilId} helperText={errors.civilId ? 'Civil ID is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('email')} {...register('email', { required: true })} error={!!errors.email} helperText={errors.email ? 'Email is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('phone_number')} {...register('mobileNumber', { required: true })} error={!!errors.mobileNumber} helperText={errors.mobileNumber ? 'Phone Number is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('iban')} {...register('ibanNumber', { required: true })} error={!!errors.ibanNumber} helperText={errors.ibanNumber ? 'IBAN Number is required' : ''} />
                        <InputLabel htmlFor="dob">{t('date_of_birth')}</InputLabel>
                        <TextField fullWidth type="date" id='dob' {...register('dob', { required: true })} error={!!errors.dob} helperText={errors.dob ? 'Date of Birth is required' : ''} />

                        <InputLabel htmlFor="joinDate">{t('join_date')}</InputLabel>
                        <TextField
                            id="joinDate"
                            type="date"
                            fullWidth
                            {...register('joinDate', { required: true })}
                            error={!!errors.joinDate}
                            helperText={errors.joinDate ? 'Join Date is required' : ''}
                        />
                        <InputLabel htmlFor="quitDate">{t('quit_date')}</InputLabel>
                        <TextField fullWidth type="date" id='quitDate' {...register('quitDate', { required: true })} error={!!errors.ibanNumber} helperText={errors.ibanNumber ? 'Join Date is required' : ''} />
                        <FormControl fullWidth error={!!errors.status} margin="normal">
                            <InputLabel id="status-label">{t('status')}</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: true }}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="status-label"
                                        label={t('status')}
                                    >
                                        <MenuItem value={"0"}>{t('active')}</MenuItem>
                                        <MenuItem value={"1"}>{t('inactive')}</MenuItem>
                                        <MenuItem value={"2"}>{t('death')}</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && <FormHelperText>Status is required</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth error={!!errors.status} margin="normal">
                            <InputLabel id="status-label">{t('membership_status')}</InputLabel>
                            <Controller
                                name="membershipStatus"
                                control={control}
                                rules={{ required: true }}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="status-label"
                                        label={t('membership_status')}
                                    >
                                        <MenuItem value={"0"}>{t('active')}</MenuItem>
                                        <MenuItem value={"1"}>{t('inactive')}</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && <FormHelperText>Membership Status is required</FormHelperText>}
                        </FormControl>
                    </Grid>
                    {/* Column 2 */}
                    <Grid item xs={12} sm={6} md={6}>
                        <Typography variant="h6">
                            {t('address')}
                        </Typography>
                        <FormControl fullWidth error={!!errors.status} margin="normal">
                            <InputLabel id="status-label">{t('gender')}</InputLabel>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: true }}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        labelId="gender-label"
                                        label={t('gender')}
                                    >
                                        <MenuItem value={'male'}>{t('Male')}</MenuItem>
                                        <MenuItem value={'female'}>{t('Female')}</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && <FormHelperText>Gender is required</FormHelperText>}
                        </FormControl>
                        <TextField margin="normal" fullWidth label={t('block')} {...register('block', { required: true })} error={!!errors.block} helperText={errors.block ? 'Block is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('area')}{...register('city', { required: true })} error={!!errors.city} helperText={errors.city ? 'City is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('poBox')}{...register('poBox')} />
                        <TextField margin="normal" fullWidth label={t('house')} {...register('house', { required: true })} error={!!errors.house} helperText={errors.house ? 'House Number is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('street')} {...register('street', { required: true })} error={!!errors.street} helperText={errors.street ? 'Street is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('area')} {...register('area', { required: true })} error={!!errors.area} helperText={errors.area ? 'Area is required' : ''} />
                        <TextField margin="normal" fullWidth label={t('zipCode')}{...register('zipCode')} />
                        <TextField margin="normal" fullWidth label={t('country')} {...register('country', { required: true })} error={!!errors.country} helperText={errors.country ? 'Country is required' : ''} />
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
                    {t('edit')}
                </Button>
            </Box>
        </Modal>

    );
}

export default EditShareholderModal