/**
 * Copyright Schrodinger, LLC
 */

"use strict";

import FakeObjectDataListStore from './helpers/FakeObjectDataListStore';
import { TextCell } from './helpers/cells';
import { Table, Column, ColumnGroup, Cell } from 'fixed-data-table-2';
import React from 'react';
import ResizeReorderCell from '../src/plugins/ResizeReorder/ResizeReorderCell';


var columnGroupTitles = {
  'name': 'Name',
  'about': 'About',
};

var columnTitles = {
  'firstName': 'First Name',
  'lastName': 'Last Name',
  'sentence': 'Sentence',
  'companyName': 'Company',
};

var fixedColumnGroups = [];

var fixedColumns = [];


class ColumnGroupsExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: new FakeObjectDataListStore(1000000),
      columnGroupOrder: [
        'name',
        'about',
      ],
      columnOrder: {
        name: [
          'firstName',
          'lastName',
        ],
        about: [
          'companyName',
          'sentence',
        ],
      },
      columnWidths: {
        firstName: 150,
        lastName: 150,
        sentence: 240,
        companyName: 100,
      }
    };
  }

  _onColumnGroupReorderEndCallback = (event) => {
    var columnGroupOrder = this.state.columnGroupOrder.filter((columnKey) => {
      return columnKey !== event.reorderColumn;
    });

    if (event.columnAfter) {
      var index = columnGroupOrder.indexOf(event.columnAfter);
      columnGroupOrder.splice(index, 0, event.reorderColumn);
    } else {
      if (fixedColumnGroups.indexOf(event.reorderColumn) !== -1) {
        columnGroupOrder.splice(fixedColumnGroups.length - 1, 0, event.reorderColumn)
      } else {
        columnGroupOrder.push(event.reorderColumn);
      }
    }
    this.setState({
      columnGroupOrder: columnGroupOrder
    });
  }

  findColumnGroup = (columnKey) => {
    for (var groupKey in this.state.columnOrder) {
      for (const cKey of this.state.columnOrder[groupKey]) {
        if (cKey == columnKey) {
          return groupKey;
        }
      }
    }
    return null;
  }

  _onColumnReorderEndCallback = (event) => {
    var columnGroup = this.findColumnGroup(event.reorderColumn);
    var columnOrder = this.state.columnOrder[columnGroup].filter((columnKey) => {
      return columnKey !== event.reorderColumn;
    });

    var columnBeforeIndex = columnOrder.indexOf(event.columnBefore);
    var columnAfterIndex = columnOrder.indexOf(event.columnAfter);

    if(columnBeforeIndex == -1 && columnAfterIndex == -1) {
      return;
    } else if (columnAfterIndex != -1) {
      columnOrder.splice(columnAfterIndex, 0, event.reorderColumn);
    } else {
      if (fixedColumns.indexOf(event.reorderColumn) !== -1) {
        columnOrder.splice(fixedColumns.length - 1, 0, event.reorderColumn)
      } else {
        columnOrder.push(event.reorderColumn);
      }
    }
    var newColumnOrder = {...this.state.columnOrder};
    newColumnOrder[columnGroup] = columnOrder;
    this.setState({
      columnOrder: newColumnOrder,
    });
  }

  _onColumnResizeEndCallback = (newColumnWidth, columnKey) => {
    this.setState(({columnWidths}) => ({
      columnWidths: {
        ...columnWidths,
        [columnKey]: newColumnWidth,
      }
    }));
  }

  render() {
    var { dataList, columnWidths, columnOrder } = this.state;
    var onColumnGroupReorderEndCallback= this._onColumnGroupReorderEndCallback;
    var onColumnReorderEndCallback= this._onColumnReorderEndCallback;
    var onColumnResizeEndCallback= this._onColumnResizeEndCallback;
    
    return (
      <Table
        rowHeight={30}
        groupHeaderHeight={30}
        headerHeight={30}
        rowsCount={dataList.getSize()}
        width={1000}
        height={500}
        {...this.props}>
        {this.state.columnGroupOrder.map(function (columnGroupKey, i) {
          return <ColumnGroup
            key={i}
            header={<ResizeReorderCell onColumnReorderEndCallback={onColumnGroupReorderEndCallback}>{columnGroupTitles[columnGroupKey]}</ResizeReorderCell>}
            columnKey={columnGroupKey}>
            {columnOrder[columnGroupKey].map(function (columnKey, j) {
              return <Column
                allowCellsRecycling={true}
                columnKey={columnKey}
                key={i + '.' + j}
                header={<ResizeReorderCell onColumnReorderEndCallback={onColumnReorderEndCallback} onColumnResizeEndCallback={onColumnResizeEndCallback}>{columnTitles[columnKey]}</ResizeReorderCell>}
                cell={<TextCell data={dataList}/>}
                width={columnWidths[columnKey]}
              />;
            })}
            </ColumnGroup>;
        })}
        {/* <ColumnGroup
          header={<Cell>Name</Cell>}>
          <Column
            columnKey="firstName"
            fixed={true}
            header={<Cell>First Name</Cell>}
            cell={<TextCell data={dataList} />}
            width={150}
          />
          <Column
            columnKey="lastName"
            fixed={true}
            header={<Cell>Last Name</Cell>}
            cell={<TextCell data={dataList} />}
            width={150}
          />
        </ColumnGroup>
        <ColumnGroup
          header={<Cell>About</Cell>}>
          <Column
            columnKey="companyName"
            header={<Cell>Company</Cell>}
            cell={<TextCell data={dataList} />}
            flexGrow={1}
            width={150}
          />
          <Column
            columnKey="sentence"
            header={<Cell>Sentence</Cell>}
            cell={<TextCell data={dataList} />}
            flexGrow={1}
            width={150}
          />
        </ColumnGroup> */}
      </Table>
    );
  }
}

export default ColumnGroupsExample;
