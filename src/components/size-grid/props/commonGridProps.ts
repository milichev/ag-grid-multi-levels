import type { SizeGridProps } from "../types";
import { columnTypes, defaultColDef } from "../columns";

export const commonGridProps = {
  defaultColDef,
  columnTypes,
  animateRows: true,
  suppressAutoSize: false,
  detailRowAutoHeight: true,
  // groupIncludeFooter: true,
  // groupIncludeTotalFooter: true,
  singleClickEdit: true,
  stopEditingWhenCellsLoseFocus: true,
  undoRedoCellEditing: true,
  enableCellEditingOnBackspace: true,
  allowContextMenuWithControlKey: true,
  suppressAggFuncInHeader: true,
  enableCellChangeFlash: true,
  suppressReactUi: false,
  // TODO: ag-grid version v29.0.0 often crashes in addStickyRow method.
  // groupRowsSticky: true,
  getRowId: (params) => params.data.id,
  getRowClass: (params) => (params.node.group ? "" : "ag-row-leaf"),
} satisfies Partial<SizeGridProps>;
