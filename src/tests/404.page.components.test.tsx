import { render } from "@testing-library/react";
import ErrorBoundary from "../components/errors/boundary/error.boundary.component";
import ErrorDisplay from "../components/errors/display/error.display.component";
import Events from "../config/events";
import routes from "../config/routes";
import Page from "../pages/404";
import mockCheckCall from "../tests/fixtures/mock.component.call";
import getPageProps from "../utils/page.props.static";

jest.mock("../utils/page.props.static", () => jest.fn());
jest.mock("../components/errors/boundary/error.boundary.component", () =>
  createMockedComponent("ErrorBoundary")
);
jest.mock("../components/errors/display/error.display.component", () =>
  createMockedComponent("ErrorDisplay")
);

const createMockedComponent = (name: string) => {
  const {
    factoryInstance,
  } = require("../tests/fixtures/mock.component.children.factory.class");
  return factoryInstance.create(name);
};

describe("getStaticProps", () => {
  it("should be generated by the correct call to pagePropsGenerator", () => {
    expect(getPageProps).toBeCalledTimes(1);
    expect(getPageProps).toBeCalledWith({ pageKey: "default" });
  });
});

describe("404", () => {
  const arrange = () => {
    render(<Page />);
  };

  beforeEach(() => jest.clearAllMocks());

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call the ErrorBoundary correctly", () => {
      expect(ErrorBoundary).toBeCalledTimes(1);
      mockCheckCall(
        ErrorBoundary,
        {
          route: routes.home,
          eventDefinition: Events.General.Error,
        },
        0,
        ["stateReset"]
      );
    });

    it("should call the ErrorDisplay correctly", () => {
      expect(ErrorDisplay).toBeCalledTimes(1);
      mockCheckCall(ErrorDisplay, { errorKey: "404" }, 0, ["resetError"]);
    });
  });
});
