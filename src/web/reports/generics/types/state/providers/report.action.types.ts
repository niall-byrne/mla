import type { ReportType } from "../generic.report.types";
import type { DataSourceTypes } from "@src/web/reports/generics/types/source.types";

export type ReportActionType =
  | {
      type: "DataPointFailureFetch";
      data: ReportType;
    }
  | {
      type: "DataPointNotFoundFetch";
      data: ReportType;
    }
  | {
      type: "DataPointStartFetch";
    }
  | {
      type: "DataPointSuccessFetch";
      data: ReportType;
    }
  | {
      type: "DataPointTimeoutFetch";
    }
  | {
      type: "FailureFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "NotFoundFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "RatelimitedFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "ReadyFetch";
    }
  | { type: "ResetState" }
  | {
      type: "StartFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "SuccessFetch";
      data: ReportType;
      integration: DataSourceTypes;
      userName: string;
      userProfile: string;
    }
  | {
      type: "TimeoutFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "UnauthorizedFetch";
      userName: string;
      integration: DataSourceTypes;
    };
