import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const NewWorkplaceModal = ({ open, handleClose, handleCreate }) => {
    const [description, setDescription] = useState('');
    const [nameArabic, setNameArabic] = useState('');

    const handleSubmit = () => {
        handleCreate({ description, nameArabic });
        setDescription('');
        setNameArabic('');
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Workplace</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    margin="dense"
                    id="nameArabic"
                    label="Name in Arabic"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={nameArabic}
                    onChange={(e) => setNameArabic(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewWorkplaceModal;