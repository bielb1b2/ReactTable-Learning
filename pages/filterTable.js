import React, { cloneElement } from 'react';
import styled from 'styled-components';
import matchSorter from 'match-sorter'
import { useTable, useFilters, useSortBy } from "react-table"
import { Table as ChakraTable, Thead, Tr, Th, Tbody, Divider, Td, Text } from '@chakra-ui/react';


export default function ReactTable() {

    
    function DefaultColumnFilter({
      column: { filterValue, preFilteredRows, setFilter },
    }) {
      const count = preFilteredRows.length
    
      return (
        <input
          value={filterValue || ''}
          onChange={e => {
            setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
          }}
          placeholder={`Search ${count} records...`}
        />
      )
    }

    function SelectColumnFilter({
      column: { filterValue, setFilter, preFilteredRows, id },
    }) {
      // Calculate the options for filtering
      // using the preFilteredRows
      const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
          options.add(row.values[id])
        })
        return [...options.values()]
      }, [id, preFilteredRows])
    
      // Render a multi-select box
      return (
        <select
          value={filterValue}
          onChange={e => {
            setFilter(e.target.value || undefined)
          }}
        >
          <option value="">Todos</option>
          {options.map((option, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    function fuzzyTextFilterFn(rows, id, filterValue) {
      return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
    }

    fuzzyTextFilterFn.autoRemove = val => !val

    function Table({ columns, data }) {
      const filterTypes = React.useMemo(
        () => ({
          // Add a new fuzzyTextFilterFn filter type.
          fuzzyText: fuzzyTextFilterFn,
          // Or, override the default text filter to use
          // "startWith"
          text: (rows, id, filterValue) => {
            return rows.filter(row => {
              const rowValue = row.values[id]
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true
            })
          },
        }),
        []
      )
    
      const defaultColumn = React.useMemo(
        () => ({
          // Let's set up our default Filter UI
          Filter: DefaultColumnFilter,
        }),
        []
      )
    
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
      } = useTable(
        {
          columns,
          data,
          defaultColumn, // Be sure to pass the defaultColumn option
          filterTypes,
        },
        useFilters,
        useSortBy // useFilters!
      )
    
      // We don't want to render all of the rows for this example, so cap
      // it for this use case
      const firstPageRows = rows.slice(0, 10)
    
      return (
        <>
          <ChakraTable {...getTableProps()}>
            <Thead>
              {headerGroups.map(headerGroup => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <Th {...column.getHeaderProps()}>

                      {column.render('Header')}
                      {/* Render the columns filter UI */}
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                      <div {...column.getSortByToggleProps()}>
                        
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : '🍀'}
                      </span>
                      </div>
                    </Th>
                  ))}
                </Tr>
              ))}
    
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {firstPageRows.map((row, i) => {
                prepareRow(row)
                return (
                  <>
                  <Tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                        if(cell.value === 'Aprovado'){
                          return(<Td bgColor="yellow" {...cell.getCellProps()}>
                            <Text bgColor="white">
                              {cell.render('Cell')}
                            </Text>
                          </Td>)
                        }
                        return(
                          <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>
                        )
                    })}
                    {/* <Td >Teste 1</Td>
                    <Td>Passos 1</Td>
                   {row.values.status === 'Aprovado' ? <Td bgColor="red">{row.values.status}</Td> :  <Td>{row.values.status}</Td> } */}
                  </Tr>
                  <Divider />
                  </>
                )
              })}
            </Tbody>
          </ChakraTable>
          <br />
          <div>Showing the first 20 results of {rows.length} rows</div>
          <div>
            <pre>
              <code>{JSON.stringify(state.filters, null, 2)}</code>
            </pre>
          </div>
        </>
      )
    }

    // Definindo Dados
    const data = React.useMemo(() => [
        {
            docente: 'Gabriel Vitor De Souza',
            drt: '1710184',
            status: 'Aprovado',
        },
        {
            docente: 'Fernando Brito',
            drt: '1234567',
            status: 'Recusado',
        }
    ],[])

    //Definindo Colunas
    const columns = React.useMemo(
        () => [
          {
            Header: 'Docente',
            accessor: 'docente',  
          },
          {
            Header: 'DRT',
            accessor: 'drt',
          },
          {
            Header: 'Status',
            accessor: 'status',
            Filter: SelectColumnFilter,
          },
        ],
        []
      )

      // Instância useTable, vem da biblioteca React Table
    
    return(
        <Table columns={columns} data={data} />
    )
}