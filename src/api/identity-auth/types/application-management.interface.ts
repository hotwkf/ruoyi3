export type isAscType = "ascending" | "descending";

export interface AppListRequest {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  fundsType?: string;
  /**
   * ascending-升序
   *
   * descending-降序
   */
  isAsc: isAscType;
}

export interface FundsListRow {
  id: number;
  /**
   * 品种ID
   */
  breedId: number;
  /**
   * 品种名称
   */
  breedName: string;
  /**
   * 合同ID
   */
  contractId?: number;
  /**
   * 合同编号
   */
  contractNo: string;
  /**
   * 合同类型
   */
  contractType: null | string;
  /**
   * 公司
   */
  customerName: string;
  /**
   * 说明
   */
  explain: string;
  /**
   * 最新日期
   */
  fundsDate: string;
  /**
   * 资金类型
   */
  fundsType: string;
  /**
   * 资金类型名称
   */
  fundsTypeName: string;
  /**
   * 合同签订甲方
   */
  partyA: number;
  /**
   * 合同签订乙方
   */
  partyB: number;
  /**
   * 备注
   */
  remark: string;
  /**
   * 状态
   */
  status: string;
  /**
   * 状态名
   */
  statusName: string;
  /**
   * 总支出
   */
  sumExpense: number;
  /**
   * 总收入
   */
  sumIncome: number;
  /**
   * 总吨数
   */
  sumTonnage: number;
  expense: string;
  income: string;
  tonnage: number;
  fileList: string[];
  storageMoney: number;
  transportMoney: number;
}
