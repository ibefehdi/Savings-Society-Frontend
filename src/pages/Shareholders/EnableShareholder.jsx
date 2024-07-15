import { useState } from "react";
import axiosInstance from "../../constants/axiosInstance";
import { Button, Dialog, DialogContent, DialogTitle, InputLabel, MenuItem, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const EnableShareholder = ({ open, setOpen, fetchData, id }) => {
    // const [quitDate, setQuitDate] = useState();
    const [status, setStatus] = useState();

    const { t } = useTranslation()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/enableShareholder/${id}`, { status });
            fetchData();
            setOpen(false);
        } catch (error) {
            console.error('Error disabling shareholder:', error);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{t('disable_shareholder')}</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    {/* <InputLabel
                        htmlFor="joinDate"

                    >
                        {t('quit_date')}
                    </InputLabel> */}
                    {/* <TextField
                        type="date"
                        value={quitDate}
                        onChange={(e) => setQuitDate(e.target.value)}
                        fullWidth
                        margin="normal"
                    /> */}
                    <TextField
                        label={t('status')}
                        variant="outlined"
                        select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        fullWidth
                        autoComplete='off'

                    >
                        {/* Replace these with your actual status options */}
                        <MenuItem value={0}>{t('active')}</MenuItem>
                        {/* <MenuItem value={1}>{t('inactive')}</MenuItem>
                        <MenuItem value={2}>{t('death')}</MenuItem> */}
                    </TextField>
                    <Button type="submit" sx={{ mt: 3 }} variant="contained" color="primary">
                        {t('enable')}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default EnableShareholder;