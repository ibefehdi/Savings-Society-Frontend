import { useCallback, useState } from "react"
import axiosInstance from "../constants/axiosInstance"
export const useFetch = (url, pageNo, resultsPerPage) => {
    console.log("This is the url", url);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState();
    const fetchData = useCallback(() => {
        setLoading(true)
        axiosInstance.get(`${url}?page=${pageNo}&resultsPerPage=${resultsPerPage}`)
            .then(res => {
                setData(res?.data?.data)
                setCount(res?.data?.count)
                console.log(`this is the full url${url}?page=${pageNo}&resultsPerPage=${resultsPerPage}`)
            })
            .catch(error => {
                console.error("There was an error!", error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [url, pageNo, resultsPerPage])

    return { data, loading, fetchData, count }
}