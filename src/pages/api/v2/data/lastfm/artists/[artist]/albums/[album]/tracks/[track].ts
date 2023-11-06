import LastFMApiEndpointFactoryBaseV2 from "@src/api/services/lastfm/endpoints/v2.lastfm.endpoint.factory.base.class";
import apiRoutes from "@src/config/apiRoutes";
import type { ApiEndpointRequestPathParamType } from "@src/contracts/api/types/request.types";
import type { ApiFrameworkVendorApiRequestType } from "@src/vendors/types/integrations/api.framework/vendor.backend.types";

class ArtistTopAlbums extends LastFMApiEndpointFactoryBaseV2 {
  public readonly flag = null;
  public readonly route = apiRoutes.v2.data.lastfm.artists.tracksGet;

  protected getParams(
    req: ApiFrameworkVendorApiRequestType
  ): [ApiEndpointRequestPathParamType, boolean] {
    const params = req.query as ApiEndpointRequestPathParamType;
    const error = !params.artist || !params.track || !params.username;
    return [params, error];
  }

  protected getProxyResponse = async (
    params: ApiEndpointRequestPathParamType
  ) => {
    return await this.proxy.getTrackInfo(
      params.artist,
      params.track,
      params.username
    );
  };
}

export const endpointFactory = new ArtistTopAlbums();
export default endpointFactory.createHandler();
