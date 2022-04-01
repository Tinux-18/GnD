/* eslint-disable react/jsx-key */
import { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy } from "react-table";

export default function Table({ data }) {
    const columns = useMemo(() => [
        {
            Header: "Donation",
            columns: [
                {
                    Header: "Date",
                    accessor: "created_at",
                },
                {
                    Header: "Amount",
                    accessor: "amount",
                },
                {
                    Header: "Status",
                    accessor: "status",
                },
            ],
        },
        {
            Header: "Contributor",
            columns: [
                {
                    Header: "Name",
                    accessor: "donnor_name",
                },
                {
                    Header: "Email",
                    accessor: "email",
                },
            ],
        },
    ]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns,
            data,
        });

    function handleClick({ target }) {
        if (target.innerText == "Pending") {
            console.log("target :>> ", target.innerText);
        }
    }

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>
                                    {column.render("Header")}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            className="hovertext"
                                            data-hover="Click to accept"
                                            onClick={handleClick}
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}
