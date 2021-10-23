import EventDefinition from "./event.class";
import type { ReportType } from "../types/analytics.types";

const Events = {
  Auth: {
    CloseModal: new EventDefinition({
      category: "AUTH",
      label: "MODAL",
      action: "AUTHENTICATION MODAL WAS CLOSED.",
    }),
    HandleLogin: (provider: string) =>
      new EventDefinition({
        category: "AUTH",
        label: "LOGIN",
        action: `LOGIN FLOW STARTED USING PROVIDER: ${provider}.`,
      }),
    Logout: new EventDefinition({
      category: "AUTH",
      label: "LOGOUT",
      action: `LOGOUT FLOW STARTED.`,
    }),
    OpenModal: new EventDefinition({
      category: "AUTH",
      label: "MODAL",
      action: "AUTHENTICATION MODAL WAS OPENED.",
    }),
  },
  LastFM: {
    ReportPresented: (title: ReportType) =>
      new EventDefinition({
        category: "LAST.FM",
        label: "REPORT",
        action: `REPORT PRESENTED TO USER: ${title}.`,
      }),
    AlbumViewed: (artistName: string, albumName: string) =>
      new EventDefinition({
        category: "LAST.FM",
        label: "DATA: ALBUM",
        action: `VIEWED ALBUM DETAILS: ${artistName}:${albumName}.`,
      }),
    ArtistViewed: (artistName: string) =>
      new EventDefinition({
        category: "LAST.FM",
        label: "DATA: ARTIST",
        action: `VIEWED ARTIST DETAILS: ${artistName}.`,
      }),
  },
  General: {
    Error: new EventDefinition({
      category: "MAIN",
      label: "ERROR",
      action: "Unspecified error was caught by the error boundary.",
    }),
    Test: new EventDefinition({
      category: "TEST",
      label: "TEST",
      action: "test event was processed.",
    }),
  },
};

export default Events;
