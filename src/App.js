import React, { Component } from 'react';
import './App.css';
import { cloneDeep, findIndex } from 'lodash';
import * as Table from 'reactabular-table';
import * as edit from 'react-edit';

class App extends Component {
 constructor(props) {
    super(props);

    const editable = edit.edit({
      isEditing: ({ columnIndex, rowData }) => true, //here we want to show all fields in edit mode

      onActivate: ({ columnIndex, rowData }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index].editing = columnIndex;
        console.log("onActivate",rowData.id)

        this.setState({ rows });
      },

      onValue: ({ value, rowData, property }) => {
        const index = findIndex(this.state.rows, { id: rowData.id });
        const rows = cloneDeep(this.state.rows);

        rows[index][property] = value;
        rows[index].editing = false;

        rows[index].edited = true;
        console.log("onvalue",value, rowData.id, property)
	
        // this.setState({ rows }); // this causes strange tab jumping
      }
    });

    let countries = [
      {value: "Slovenia", name: "Slovenia"},
      {value: "Germany", name: "Germany"},
       ]

    let rows = []
    for(let i = 0; i<10;i++) {
      rows.push({
          id: i+10,
          name: i % 2 ? 'Adam' : "Mandy",
          age: Math.random(),
          surname: i % 2 ? 'Baba' : "Kuku",
          country: i % 3 ? 'Germany' : "Slovenia",
        })
    }
    
    this.state = {
      editedCell: null, // Track the edited cell somehow
      columns: [
        {
          property: 'name',
          header: {
            label: 'Name'
          },
          cell: {
            transforms: [
              (value, extra) => editable(edit.input())(value, extra, {
                className: extra.rowData.edited && 'edited'
              })
            ]
          }
        },
        {
          property: 'surname',
          header: {
            label: 'Surname'
          },
          cell: {
            transforms: [
              (value, extra) => editable(edit.input())(value, extra, {
                className: extra.rowData.edited && 'edited'
              })
            ]
          }
        },
        {
          property: 'age',
          header: {
            label: 'Age'
          },
          cell: {
            transforms: [
              (value, extra) => editable(edit.input())(value, extra, {
                className: extra.rowData.edited && 'edited'
              })
            ]
          }
        },
        {
          property: 'country',
          header: {
            label: 'Country'
          },
          cell: {
            // formatters: [
            //   //custom formatter
            //   (val, extra) => (<select onChange={e => console.log(val, extra)}>
            //     {countries.map((item, i) => <option value={item.value}>{item.name}</option>)}
            //   </select>)
              
            // ],
             transforms: [
              // to 
              (value, extra) => editable(edit.dropdown({options: countries}))(value, extra, {
                className: extra.rowData.edited && 'edited'
              })
            ]
          }
        }
      ],
      rows: rows
    };
  }

  changeSelection = (val, value, extra) => {
    console.log(val, value, extra)
  }
  render() {
    const { columns, rows } = this.state;

    return (
      <Table.Provider columns={columns}>
        <Table.Header />

        <Table.Body rows={rows} rowKey="id" />
      </Table.Provider>
    );
  }
}

export default App;
