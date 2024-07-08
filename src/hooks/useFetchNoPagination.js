import { useCallback, useState, useEffect } from "react";
import axiosInstance from "../constants/axiosInstance";

export const useFetchNoPagination = (url, initialFilters = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState();
    const [grandTotal, setGrandTotal] = useState();
    const [filters, setFilters] = useState(initialFilters);
    const fetchData = useCallback(() => {
        setLoading(true);
        const filterParams = new URLSearchParams(filters).toString();
        const queryString = Object.keys(filters).length ? `?${filterParams}` : '';

        axiosInstance.get(`${url}${queryString}`)
            .then(res => {
                setData(res?.data?.data);
                setCount(res?.data?.count);
                setGrandTotal(res?.data?.grandTotal);
            })
            .catch(error => {
                console.error("There was an error!", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url, filters]);


    const updateFilters = useCallback((newFilters) => {
        setFilters(prevFilters => {
            return { ...prevFilters, ...newFilters };
        });
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, fetchData, count, updateFilters, filters, grandTotal };
};
