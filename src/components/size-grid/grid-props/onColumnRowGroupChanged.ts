import { SelectableLevel } from "../../../data/types";
import { toggleLevelItem } from "../../../data/levels";
import { allLevels } from "../../../constants";
import { GridContext, SizeGridProps } from "../types";

export const onColumnRowGroupChanged: SizeGridProps["onColumnRowGroupChanged"] =
  (params) => {
    const { levelIndex, levels, appContext }: GridContext = params.context;
    console.log("onColumnRowGroupChanged", { levelIndex, levels, params });

    const groupColLevel = params.column?.getColId() as SelectableLevel;
    if (allLevels.includes(groupColLevel)) {
      params.columnApi.removeRowGroupColumn(groupColLevel);
      toggleLevelItem(groupColLevel, true, appContext);
    } else {
      const levelColumn = params.columnApi.getColumn(levels[levelIndex]);
      if (levelColumn) {
        params.columnApi.setColumnsVisible(
          [levelColumn],
          params.columns.length === 0
        );
      }
    }
  };
