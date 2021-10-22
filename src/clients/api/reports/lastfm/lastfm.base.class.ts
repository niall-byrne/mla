import EventDefinition from "../../../../events/event.class";
import HTTPClient from "../../api.client.class";
import type {
  EventCreatorType,
  ReportType,
} from "../../../../types/analytics.types";
import type { ApiResponse } from "../../../../types/clients/api/api.client.types";
import type { LastFMReportInterface } from "../../../../types/clients/api/reports/lastfm.client.types";
import type { BaseReportResponseInterface } from "../../../../types/integrations/base.types";
import type { LastFMProxyRequestInterface } from "../../../../types/integrations/lastfm/proxy.types";
import type { userDispatchType } from "../../../../types/user/context.types";

class LastFMBaseReport<ResponseType>
  implements LastFMReportInterface<ResponseType>
{
  client: HTTPClient;
  dispatch: userDispatchType;
  eventDispatch: EventCreatorType;
  eventType = "BASE REPORT" as ReportType;
  integration = "LAST.FM" as const;
  response: ApiResponse<ResponseType> | undefined;
  route: string | undefined;

  constructor(dispatch: userDispatchType, event: EventCreatorType) {
    this.dispatch = dispatch;
    this.eventDispatch = event;
    this.client = new HTTPClient();
  }

  handleBegin(userName: string): void {
    this.eventDispatch(
      new EventDefinition({
        category: "LAST.FM",
        label: "REQUEST",
        action: `${this.eventType}: Request was sent to LAST.FM.`,
      })
    );
    this.dispatch({
      type: "StartFetchUser",
      userName: userName,
      integration: this.integration,
    });
  }

  handleNotFound(userName: string): void {
    if (this.response?.status === 404) {
      this.dispatch({
        type: "NotFoundFetchUser",
        userName: userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: Request was made for an unknown username.`,
        })
      );
    }
  }

  handleSuccessful(userName: string): void {
    if (this.response?.status === 200) {
      this.dispatch({
        type: "SuccessFetchUser",
        userName: userName,
        data: this.response.response as unknown as BaseReportResponseInterface,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "RESPONSE",
          action: `${this.eventType}: Received report from LAST.FM.`,
        })
      );
    }
  }

  handleRatelimited(userName: string): void {
    if (this.response?.status === 429) {
      this.dispatch({
        type: "RatelimitedFetchUser",
        userName: userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: Request was ratelimited by LAST.FM.`,
        })
      );
    }
  }

  handleUnauthorized(userName: string): void {
    if (this.response?.status === 401) {
      this.dispatch({
        type: "UnauthorizedFetchUser",
        userName: userName,
        integration: this.integration,
      });
      this.eventDispatch(
        new EventDefinition({
          category: "LAST.FM",
          label: "ERROR",
          action: `${this.eventType}: An unauthorized report request was made.`,
        })
      );
    }
  }

  handleFailure(userName: string): void {
    this.dispatch({
      type: "FailureFetchUser",
      userName: userName,
      integration: this.integration,
    });
    this.eventDispatch(
      new EventDefinition({
        category: "LAST.FM",
        label: "ERROR",
        action: `${this.eventType}: Unable to create a report.`,
      })
    );
  }

  retrieveReport(userName: string): void {
    this.handleBegin(userName);
    this.client
      .post<LastFMProxyRequestInterface, ResponseType>(this.route as string, {
        userName,
      })
      .then((response) => {
        this.response = response;
        this.handleNotFound(userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleRatelimited(userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleUnauthorized(userName);
        return Promise.resolve(response);
      })
      .then((response) => {
        this.response = response;
        this.handleSuccessful(userName);
        return Promise.resolve(response);
      })
      .catch(() => {
        this.handleFailure(userName);
      });
  }
}

export default LastFMBaseReport;
