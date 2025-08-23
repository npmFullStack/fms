import { useState } from "react";
import { useReactTable } from "@tanstack/react-table";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel
} from "@tanstack/table-core";

const useTable = ({ data, columns }) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5
    });

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            sorting,
            globalFilter,
            pagination
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    return {
        table,
        globalFilter,
        setGlobalFilter,
        sorting,
        setSorting,
        pagination,
        setPagination
    };
};

export default useTable;
