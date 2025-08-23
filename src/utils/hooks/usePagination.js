import { useMemo } from "react";

const usePagination = (table, dataLength) => {
    const paginationInfo = useMemo(
        () => ({
            currentPage: table.getState().pagination.pageIndex + 1,
            totalPages: table.getPageCount(),
            totalItems: dataLength || 0
        }),
        [table, dataLength]
    );

    const actions = {
        previousPage: table.previousPage,
        nextPage: table.nextPage,
        canPrevious: table.getCanPreviousPage(),
        canNext: table.getCanNextPage()
    };

    return { paginationInfo, actions };
};

export default usePagination;
