import { TABLE_ADDING_TYPE, TABLE_EDITING_TYPE } from './constants';
import { TABLE_DATA_TYPE } from '../table-view/constants';
import {
  tableRowsWithEditing,
} from './computeds';

describe('TableEditRow Plugin computeds', () => {
  describe('#tableRowsWithEditing', () => {
    it('should work', () => {
      const tableRows = [
        { type: TABLE_DATA_TYPE, rowId: 1, row: 'row1' },
        { type: TABLE_DATA_TYPE, rowId: 2, row: 'row2' },
        { type: 'undefined', rowId: 2, row: 'row2' },
      ];
      const editingRows = [2];
      const addedRows = [{ id: 3 }, { id: 4 }];

      expect(tableRowsWithEditing(tableRows, editingRows, addedRows, 100))
        .toEqual([
          {
            key: `${TABLE_ADDING_TYPE}_1`,
            type: TABLE_ADDING_TYPE,
            rowId: 1,
            row: { id: 4 },
            height: 100,
          },
          {
            key: `${TABLE_ADDING_TYPE}_0`,
            type: TABLE_ADDING_TYPE,
            rowId: 0,
            row: { id: 3 },
            height: 100,
          },
          { type: TABLE_DATA_TYPE, rowId: 1, row: 'row1' },
          {
            key: `${TABLE_EDITING_TYPE}_2`,
            type: TABLE_EDITING_TYPE,
            rowId: 2,
            row: 'row2',
            height: 100,
          },
          { type: 'undefined', rowId: 2, row: 'row2' },
        ]);
    });
  });
});
