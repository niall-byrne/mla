import { render } from "@testing-library/react";
import ReportPage from "@src/components/reports/lastfm/common/report.page/report.page";
import Top20ArtistsReport from "@src/components/reports/lastfm/top20.artists/top20.artists.container";
import routes from "@src/config/routes";
import FourOhFour from "@src/pages/404";
import Page, { getStaticProps } from "@src/pages/reports/lastfm/top20artists";
import mockCheckCall from "@src/tests/fixtures/mock.component.call";
import getPageProps from "@src/utils/page.props.static";

jest.mock("@src/utils/page.props.static", () =>
  jest.fn(() => "mockStaticProps")
);

jest.mock("@src/components/reports/lastfm/common/report.page/report.page", () =>
  require("@fixtures/react").createComponent("ReportPage")
);

jest.mock(
  "@src/components/reports/lastfm/top20.artists/top20.artists.container",
  () => require("@fixtures/react").createComponent("Top20ArtistsReport")
);

jest.mock("@src/pages/404", () =>
  require("@fixtures/react").createComponent("FourOhFour")
);

describe("getStaticProps", () => {
  it("should be the return value of pagePropsGenerator", () => {
    expect(getStaticProps).toBe("mockStaticProps");
  });

  it("should be generated by a correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({
      pageKey: "lastfm",
      translations: ["cards", "lastfm"],
    });
  });
});

describe(routes.reports.lastfm.top20artists, () => {
  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<Page />);
  };

  describe("when rendered", () => {
    beforeEach(() => {
      arrange();
    });

    it("should call the ReportPage correctly", () => {
      expect(ReportPage).toBeCalledTimes(1);
      mockCheckCall(
        ReportPage,
        {
          ReportContainer: Top20ArtistsReport,
          NoUserComponent: FourOhFour,
        },
        0,
        ["stateReset"]
      );
    });
  });
});
