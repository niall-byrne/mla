import Top20ArtistsReport from "./top20.artists.report.class";
import FlipCardReportContainer from "@src/components/reports/lastfm/common/report.component/flip.card/flip.card.report.container";
import type UserArtistDataState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.artist.flipcard.report.class";
import type { LastFMTopArtistsReportResponseInterface } from "@src/types/clients/api/lastfm/response.types";
import type { userHookAsLastFMTop20ArtistReport } from "@src/types/user/hook.types";

export interface Top20ArtistsReportContainerProps {
  userName: string;
  lastfm: userHookAsLastFMTop20ArtistReport;
}

export default function Top20ArtistsContainer({
  lastfm,
  userName,
}: Top20ArtistsReportContainerProps) {
  return (
    <FlipCardReportContainer<
      UserArtistDataState,
      LastFMTopArtistsReportResponseInterface["artists"]
    >
      lastfm={lastfm}
      userName={userName}
      reportClass={Top20ArtistsReport}
    />
  );
}
