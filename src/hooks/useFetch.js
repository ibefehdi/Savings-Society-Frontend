import { useCallback, useState } from "react"
import axiosInstance from "../constants/axiosInstance"

export const useFetch = (url, pageNo, resultsPerPage, filters = {}) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState()

    const fetchData = useCallback(() => {
        setLoading(true)
        // Convert filters object to query string
        const filterParams = new URLSearchParams(filters).toString();
        const queryString = pageNo ? `?page=${pageNo}&resultsPerPage=${resultsPerPage}&${filterParams}`:`&${filterParams}`

        axiosInstance.get(`${url}${queryString}`)
            .then(res => {
                setData(res?.data?.data)
                setCount(res?.data?.count)
            })
            .catch(error => {
                console.error("There was an error!", error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [url, pageNo, resultsPerPage, filters]) 

    return { data, loading, fetchData, count }
}
