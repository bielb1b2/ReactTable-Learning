import React from 'react';
import { useTable, useFilters, useAsyncDebounce } from "react-table"

export default function ReactTable() {
    
    // Dados definidos
    const data = React.useMemo(() => [
        {
            col1: 'Hello',
            col2: 'World',
        },
        {
            col1: 'react-table',
            col2: 'rocks',
        }
    ],[])

    //Definindo Colunas
    const columns = React.useMemo(
        () => [
          {
            Header: 'Column 1',
            accessor: 'col1', // Chave para as colunas
        
          },
          {
            Header: 'Column 2',
            accessor: 'col2',
          },
        ],
        []
      )

      // Instância useTable, vem da biblioteca React Table
      const tableInstance = useTable({ columns, data })

      const {getTableProps, getTableBodyProps,  headerGroups, rows, prepareRow} = tableInstance;
    
    return(
        <table {...getTableProps()} >
          <thead>
            {
              headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} >
                  {
                    headerGroup.headers.map(column => (
                      <th  {...column.getHeaderProps()}>
                        {column.render('Header')}
                      </th>
                    ))
                  }
                </tr>
              ))
            }
          </thead>
          <tbody {...getTableBodyProps()}>
            {
              rows.map(row => {
                prepareRow(row)
                return(
                  <tr {...row.getRowProps()} >
                    {
                      row.cells.map(cell => {
                        return(
                          <td {...cell.getCellProps()} >
                            { cell.render('Cell') }
                          </td>
                        )
                      })
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
    )
}