import LastFMBaseSunBurstDataPointClient from "./sunburst.datapoint.client.base.class";
import apiRoutes from "../../../../../../config/apiRoutes";
import type { LastFMTrackInfoInterface } from "../../../../../../types/integrations/lastfm/api.types";

class LastFMTrackInfo<
  EncapsulationType
> extends LastFMBaseSunBurstDataPointClient<
  EncapsulationType,
  LastFMTrackInfoInterface
> {
  route = apiRoutes.v2.data.artists.tracksGet;
  eventType = "TRACK INFO" as const;
}

export default LastFMTrackInfo;
