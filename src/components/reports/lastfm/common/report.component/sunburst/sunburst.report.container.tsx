import { useEffect } from "react";
import useSunBurstLayoutController from "./controllers/sunburst.report.layout.controller.hook";
import SunBurstReport from "./sunburst.report.component";
import BillBoardProgressBar from "@src/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import LastFMErrorDisplayContainer from "@src/components/reports/lastfm/common/error.display/error.display.container";
import Events from "@src/events/events";
import useAnalytics from "@src/hooks/analytics";
import useSunBurstController from "@src/hooks/controllers/sunburst.controller.hook";
import useLocale from "@src/hooks/locale";
import useMetrics from "@src/hooks/metrics";
import type SunBurstBaseReport from "@src/components/reports/lastfm/common/report.class/sunburst.report.base.class";
import type SunBurstBaseReportState from "@src/providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { LastFMSunBurstDrawerInterface } from "@src/types/clients/api/lastfm/drawer.component.types";
import type { AggregateBaseReportResponseInterface } from "@src/types/integrations/base.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";

interface SunBurstReportContainerProps<
  T extends SunBurstBaseReportState<unknown>
> {
  lastfm: userHookAsLastFM;
  userName: string;
  reportClass: new () => SunBurstBaseReport<T>;
}

export default function SunBurstReportContainer<
  UserStateType extends SunBurstBaseReportState<unknown>
>({
  lastfm,
  userName,
  reportClass,
}: SunBurstReportContainerProps<UserStateType>) {
  const analytics = useAnalytics();
  const { t: lastFMt } = useLocale("lastfm");
  const { t: sunBurstT } = useLocale("sunburst");
  const metrics = useMetrics();
  const sunBurstController = useSunBurstController();
  const sunBurstLayoutController = useSunBurstLayoutController();

  const report = new reportClass();

  useEffect(() => {
    lastfm.clear();
    report.startDataFetch(lastfm, userName);
    return () => lastfm.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!report.getReportData(lastfm.userProperties).status.complete) return;
    analytics.event(
      report
        .getEncapsulatedNode(sunBurstController.node.selected)
        .getDrawerEvent()
    );
    sunBurstLayoutController.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sunBurstController.node.selected]);

  useEffect(() => {
    if (report.queryIsResumable(lastfm.userProperties)) {
      report.startDataFetch(lastfm, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastfm.userProperties]);

  useEffect(() => {
    if (report.queryIsDataReady(lastfm.userProperties)) {
      lastfm.ready();
      metrics.increment("SearchMetric");
      analytics.event(
        Events.LastFM.ReportPresented(report.getAnalyticsReportType())
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastfm.userProperties]);

  return (
    <LastFMErrorDisplayContainer<
      AggregateBaseReportResponseInterface<unknown>,
      LastFMSunBurstDrawerInterface
    >
      report={report}
      userProperties={lastfm.userProperties}
    >
      <BillBoardProgressBar
        details={report.getProgressDetails(lastfm.userProperties, sunBurstT)}
        title={lastFMt(
          `${String(report.getReportTranslationKey())}.communication`
        )}
        visible={!lastfm.userProperties.ready}
        value={report.getProgressPercentage(lastfm.userProperties)}
      />
      <SunBurstReport<UserStateType>
        encapsulatedReportState={report.getEncapsulatedReportState(
          lastfm.userProperties
        )}
        lastFMt={lastFMt}
        report={report}
        sunBurstT={sunBurstT}
        sunBurstController={sunBurstController}
        sunBurstLayoutController={sunBurstLayoutController}
        visible={lastfm.userProperties.ready}
      />
    </LastFMErrorDisplayContainer>
  );
}
