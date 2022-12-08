import webFrameworkVendorSSR from "@src/clients/web.framework/vendor.ssr";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import SearchContainer from "@src/components/search/lastfm/search.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useLocale from "@src/hooks/locale.hook";
import { voidFn } from "@src/utils/voids";

export default function SearchLastFMTop20Albums() {
  const { t } = useLocale("lastfm");

  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <SearchContainer
        titleText={t("top20Albums.searchTitle")}
        route={routes.reports.lastfm.top20albums}
      />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "search",
    translations: ["lastfm"],
  });
