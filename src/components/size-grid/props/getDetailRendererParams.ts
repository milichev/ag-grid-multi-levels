import {
  ICellRendererParams,
  IDetailCellRendererParams,
} from "ag-grid-community";
import { Level, LevelIndices, SizeGridData } from "../../../data/types";
import {
  SizeGridContext,
  SizeGridLevelContext,
  WithSizeGridEntities,
} from "../types";
import { measureAction, wrap } from "../../../helpers/perf";
import { collectEntities } from "../../../data/resolvers";
import { getAutoGroupColumnDef, getColDefs } from "../columns";
import { groupItems } from "../../../data/groupItems";
import { getLevelIndices } from "../../../data/levels";
import { commonGridProps } from "./commonGridProps";
import { getEventHandlers } from "../event-handlers";

export const getDetailRendererParams = (
  data: SizeGridData,
  levels: Level[],
  levelIndex: number,
  levelIndices: LevelIndices,
  sizeGridContext: SizeGridContext,
  masterContext: SizeGridLevelContext
) => {
  const level = levels[levelIndex];
  if (!level) return undefined;

  const detailCellRendererParams = (
    params: WithSizeGridEntities<Omit<ICellRendererParams, "value">>
  ) => {
    const item = params.data;

    const product =
      levelIndices.product < levelIndex ? item.group[0].product : null;
    const hasSizeGroups = product?.sizes?.some((s) => !!s.sizeGroup);

    // level info for the currently expanded parent item
    let currentLevel = level;
    let localLevels = levels;
    let localLevelIndices = levelIndices;

    // remove unneeded sizeGroup nested level, if any
    if (product && !hasSizeGroups) {
      if (levelIndices.sizeGroup >= levelIndex) {
        localLevels = levels.slice();
        localLevels.splice(levelIndices.sizeGroup, 1);
        currentLevel = localLevels[levelIndex];
        if (
          localLevels.length === levelIndex &&
          !sizeGridContext.isFlattenSizes
        ) {
          localLevels.push("sizes");
        }
        localLevelIndices = getLevelIndices(localLevels);
      }
    }

    const context: SizeGridLevelContext = {
      levels: localLevels,
      levelIndex,
      getData: () => data,
      sizeGridContext,
      master: {
        id: params.data.id,
        api: params.api,
        columnApi: params.columnApi,
        context: masterContext,
      },
    };

    const detailCellRendererParams = getDetailRendererParams(
      data,
      localLevels,
      levelIndex + 1,
      localLevelIndices,
      sizeGridContext,
      context
    );

    const allProducts = measureAction(
      () =>
        sizeGridContext.isFlattenSizes
          ? [...collectEntities(item.group).products.values()]
          : [],
      { name: "collectEntities", suppressResultOutput: true }
    );

    const columnDefs = getColDefs({
      levels: localLevels,
      levelIndex,
      levelIndices: localLevelIndices,
      data,
      product,
      sizeGridContext,
      allProducts,
      columnApi: null,
    });

    const { items } = groupItems(
      item.group,
      localLevels,
      levelIndex,
      localLevelIndices,
      item
    );

    return {
      detailGridOptions: {
        ...commonGridProps,
        ...getEventHandlers(context),
        autoGroupColumnDef: getAutoGroupColumnDef(currentLevel),
        columnDefs,
        context,
        masterDetail: !!detailCellRendererParams,
        detailCellRendererParams,
        popupParent: sizeGridContext.getPopupParent(),
      },
      getDetailRowData: (params) => {
        params.successCallback(items);
      },
    } satisfies Partial<IDetailCellRendererParams>;
  };

  return wrap(
    detailCellRendererParams,
    `detailCellRendererParams:${level}`,
    false
  );
};
