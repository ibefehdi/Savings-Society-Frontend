import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../constants/axiosInstance';

const ShareholderDetails = () => {
    const { id } = useParams();
    const [shareholderDetails, setShareholderDetails] = useState()
    useEffect(() => {
        const fetchData = async () => {
            const response = await axiosInstance.get(`shareholder/${id}`);
            console.log(response?.data);
        }
        fetchData();
    }, [id]);

    return (
        <div>
            <h2>Shareholder Details</h2>
            <p>ID: {id}</p>
        </div>
    );
}

export default ShareholderDetails;
