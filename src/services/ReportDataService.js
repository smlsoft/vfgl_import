import { instanceApi } from "@/services/ProviderService";

export default {
  getBalanceSheet(accountgroup, enddate, ica, timezone) {
    return instanceApi(true)
      .get(
        `/gl/report/balancesheet?accountgroup=${accountgroup}&enddate=${enddate}&ica=${ica}&timezone=${timezone}`
      )
      .then((res) => res.data);
  },
  getProfitandloss(accountgroup, startdate, enddate, ica, timezone) {
    return instanceApi(true)
      .get(
        `/gl/report/profitandloss?accountgroup=${accountgroup}&startdate=${startdate}&enddate=${enddate}&ica=${ica}&timezone=${timezone}`
      )
      .then((res) => res.data);
  },
  getTrialBalanceSheet(accountgroup, startdate, enddate, ica, timezone) {
    return instanceApi(true)
      .get(
        `/gl/report/trialbalancesheet?accountgroup=${accountgroup}&startdate=${startdate}&enddate=${enddate}&ica=${ica}&timezone=${timezone}`
      )
      .then((res) => res.data);
  },
  getBalanceSheetGroup(accountgroup, enddate, ica, timezone) {
    return instanceApi(true)
      .get(
        `/gl/report/balancesheetgroup?accountgroup=${accountgroup}&enddate=${enddate}&ica=${ica}&timezone=${timezone}`
      )
      .then((res) => res.data);
  },
  getdailyreport(accountgroup, startdate, enddate) {
    return instanceApi(true)
      .get(
        `/gl/journal?accountgroup=${accountgroup}&startdate=${startdate}&enddate=${enddate}`
      )
      .then((res) => res.data);
  },
  getProfitandlossGroup(accountgroup, startdate, enddate, ica, timezone) {
    return instanceApi(true)
      .get(
        `/gl/report/profitandlossgroup?accountgroup=${accountgroup}&startdate=${startdate}&enddate=${enddate}&ica=${ica}&timezone=${timezone}`
      )
      .then((res) => res.data);
  },
};
