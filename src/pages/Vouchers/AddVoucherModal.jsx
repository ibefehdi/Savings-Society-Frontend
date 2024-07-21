import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useForm, Controller, } from 'react-hook-form';
import axiosInstance from '../../constants/axiosInstance';
const AddVoucherModal = ({ open, onClose, fetchData, editingVoucher }) => {
    const { control, handleSubmit, reset, watch, setValue } = useForm();
    const [buildings, setBuildings] = useState([]);
    const [flats, setFlats] = useState([]);
    const [tenants, setTenants] = useState([]);

    const selectedBuildingId = watch('buildingId');
    const selectedFlatId = watch('flatId');

    useEffect(() => {
        if (editingVoucher) {
            // Populate form fields with editing voucher data
            setValue('buildingId', editingVoucher.buildingId._id);
            setValue('flatId', editingVoucher.flatId._id);
            setValue('tenantId', editingVoucher.tenantId._id);
            setValue('amount', editingVoucher.amount);
            setValue('pendingDate', editingVoucher.pendingDate?.split('T')[0]);
            setValue('paidDate', editingVoucher.paidDate?.split('T')[0]);
            setValue('status', editingVoucher.status);
        } else {
            // Reset form when not editing
            reset();
        }
    }, [editingVoucher, setValue, reset]);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const response = await axiosInstance.get('buildingdropdown');
                setBuildings(response?.data?.data);
                console.log(buildings)
            } catch (error) {
                console.error('Error fetching buildings:', error);
            }
        };

        fetchBuildings();
    }, []);

    useEffect(() => {
        const fetchFlats = async () => {
            try {
                if (selectedBuildingId) {
                    const response = await axiosInstance.get(`/flatsbybuildingid/${selectedBuildingId}`);
                    setFlats(response.data?.data);
                    console.log(flats);
                } else {
                    setFlats([]);
                }
            } catch (error) {
                console.error('Error fetching flats:', error);
            }
        };

        fetchFlats();
    }, [selectedBuildingId]);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                if (selectedFlatId) {
                    const response = await axiosInstance.get(`/tenantsbyflatid/${selectedFlatId}`);
                    console.log("The Response: ", response?.data?.data);
                    const tenants = response.data?.data;
                    setTenants(tenants);
                    console.log("length of tenants:", tenants.length);
                    if (tenants.length === 1) {
                        const tenant = tenants[0].tenant;
                        console.log("Tenant: ", tenant)
                        const contract = tenants[0].contract;
                        setValue('tenantId', tenant._id, { shouldValidate: true });
                        setValue('amount', contract.rentAmount, { shouldValidate: true });

                    }
                } else {
                    setTenants([]);
                    setValue('tenantId', '', { shouldValidate: true });
                    setValue('amount', '', { shouldValidate: true });
                }
            } catch (error) {
                console.error('Error fetching tenants:', error);
            }
        };
        fetchTenants();
    }, [selectedFlatId, setValue]);

    const onSubmit = async (data) => {
        try {
            if (editingVoucher) {
                await axiosInstance.put(`/updatevoucher/${editingVoucher._id}`, data);
            } else {
                await axiosInstance.post('/createvoucher', data);
            }
            reset();
            onClose();
            fetchData();
        } catch (error) {
            console.error('Error saving voucher:', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '2rem',
                outline: 'none',
            }}>
                <Typography variant="h6" component="h2">
                    {editingVoucher ? 'Edit Voucher' : 'Add Voucher'}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Building</InputLabel>
                        <Controller
                            name="buildingId"
                            control={control}
                            render={({ field }) => (
                                <Select {...field}>
                                    {buildings.map((building) => (
                                        <MenuItem key={building._id} value={building._id}>
                                            {building.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Flat</InputLabel>
                        <Controller
                            name="flatId"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} disabled={!selectedBuildingId}>
                                    {flats.map((flat) => (
                                        <MenuItem key={flat._id} value={flat._id}>
                                            {flat.flatNumber}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tenant</InputLabel>
                        <Controller
                            name="tenantId"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} disabled={!selectedFlatId || tenants.length === 1}>
                                    {tenants.map((tenant) => (
                                        <MenuItem key={tenant?.tenant?._id} value={tenant?.tenant?._id}>
                                            {tenant?.tenant?.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </FormControl>
                    <Controller
                        name="amount"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="Amount" fullWidth margin="normal" disabled={editingVoucher ? false : true} />
                        )}
                    />
                    <Controller
                        name="pendingDate"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Pending Month"
                                type="month"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                value={field.value ? field.value.substring(0, 7) : ''} // Only use YYYY-MM part
                                onChange={(e) => {
                                    const selectedMonth = e.target.value; // Format: "YYYY-MM"
                                    const formattedDate = `${selectedMonth}-05`; // Set to 5th of the selected month
                                    field.onChange(formattedDate);
                                }}
                            />
                        )}
                    />
                    <Controller
                        name="paidDate"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField {...field} label="Paid Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
                        )}
                    />
                    <Controller
                        name="status"
                        control={control}
                        defaultValue="Pending"
                        render={({ field }) => (
                            <Select {...field} fullWidth margin="normal">
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                            </Select>
                        )}
                    />
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained">
                        {editingVoucher ? 'Update' : 'Save'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AddVoucherModal;