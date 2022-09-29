import LastFMBaseClient from "../../lastfm.api.client.base.class";
import LastFMReport from "../top20.artists.class";
import apiRoutes from "@src/config/apiRoutes";

describe("LastFMTopArtistsReport", () => {
  const mockDispatch = jest.fn();
  const mockEvent = jest.fn();
  let instance: LastFMReport;

  const arrange = () => {
    return new LastFMReport(mockDispatch, mockEvent);
  };

  describe("when a request returns not found", () => {
    beforeEach(() => {
      instance = arrange();
    });

    it("should be an instance of the LastFMBaseClient abstract base class", () => {
      expect(instance).toBeInstanceOf(LastFMBaseClient);
    });

    it("should have the correct api route configured", () => {
      expect(instance.route).toBe(apiRoutes.v2.reports.lastfm.top20artists);
    });

    it("should have the correct event type configured", () => {
      expect(instance.eventType).toBe("TOP20 ARTISTS");
    });
  });
});
