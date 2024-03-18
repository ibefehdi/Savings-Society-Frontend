import { useCallback, useState, useEffect } from "react";
import axiosInstance from "../constants/axiosInstance";

export const useFetchNoPagination = (url, initialFilters = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState();
    const [filters, setFilters] = useState(initialFilters); // Manage filters state internally

    const fetchData = useCallback(() => {
        setLoading(true);
        // Convert filters object to query string, ensuring we prepend '?' for the first parameter
        const filterParams = new URLSearchParams(filters).toString();
        const queryString = Object.keys(filters).length ? `?${filterParams}` : '';

        axiosInstance.get(`${url}${queryString}`)
            .then(res => {
                setData(res?.data?.data);
                setCount(res?.data?.count);
            })
            .catch(error => {
                console.error("There was an error!", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url, filters]);

    // Expose a method to update filters, triggering re-fetch
    const updateFilters = useCallback((newFilters) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            ...newFilters,
        }));
    }, []);

    // Fetch data on initial mount and when filters change
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, fetchData, count, updateFilters, filters };
};
