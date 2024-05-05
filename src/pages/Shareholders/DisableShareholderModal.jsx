import { useState } from "react";
import axiosInstance from "../../constants/axiosInstance";
import { Button, Dialog, DialogContent, DialogTitle, InputLabel, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

const DisableShareholderModal = ({ open, setOpen, fetchData, id }) => {
    const [quitDate, setQuitDate] = useState();
    const { t } = useTranslation()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`/disableShareholder/${id}`, { quitDate });
            fetchData();
            setOpen(false);
        } catch (error) {
            console.error('Error disabling shareholder:', error);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Disable Shareholder</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <InputLabel
                        htmlFor="joinDate"

                    >
                        {t('quit_date')}
                    </InputLabel>
                    <TextField
                        type="date"
                        value={quitDate}
                        onChange={(e) => setQuitDate(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Disable
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default DisableShareholderModal;