import requestSettings from "@src/config/requests";
import { voidFn } from "@src/utilities/generics/voids";
import type { GenericAggregateBaseReportResponseInterface } from "@src/web/reports/generics/types/state/aggregate.report.types";
import type { ReportContextInterface } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type { ReportStateInterface } from "@src/web/reports/generics/types/state/providers/report.state.types";

const InitialAggregateReportState = <
  GenericAggregateBaseReportResponseInterface<unknown, unknown>
>{
  status: {
    complete: false,
    steps_total: 0,
    steps_complete: 0,
  },
  created: "",
  content: [],
};

export const InitialState = <ReportStateInterface>{
  data: {
    integration: null,
    report: {
      albums: [],
      artists: [],
      playCountByArtist: InitialAggregateReportState,
      tracks: [],
      image: [],
      playcount: 0,
    },
  },
  retries: requestSettings.retries,
  error: null,
  inProgress: false,
  profileUrl: null,
  ready: true,
  userName: null,
};

const InitialContext = <ReportContextInterface>{
  reportProperties: InitialState,
  dispatch: voidFn,
};

export default InitialContext;
