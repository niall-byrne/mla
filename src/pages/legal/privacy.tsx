import webFrameworkVendorSSR from "@src/clients/web.framework/vendor.ssr";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import PrivacyContainer from "@src/components/legal/privacy/privacy.container";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import { voidFn } from "@src/utils/voids";

export default function PrivacyPage() {
  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={voidFn}
    >
      <PrivacyContainer />
    </ErrorBoundaryContainer>
  );
}

export const getServerSideProps =
  webFrameworkVendorSSR.utilities.serverSideProps({
    pageKey: "privacy",
    translations: ["legal"],
  });
