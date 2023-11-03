import request from "@/utils/request";
import {
  type HistoryQuery,
  type HistoryResponse,
} from "./contract/types/history.interface";
import { type EarlyWarningResponse } from "./contract/types/early-warning.interface";

// 获取修改记录
export const getHistoryLog = (
  tableName: HistoryQuery["tableName"],
  tableId: HistoryQuery["tableId"]
): Promise<HistoryResponse> => {
  return request({
    url: "/common/compare/log",
    method: "get",
    params: { tableName, tableId },
  });
};
