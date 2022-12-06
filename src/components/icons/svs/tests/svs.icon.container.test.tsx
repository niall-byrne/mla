import { render } from "@testing-library/react";
import SVSIcon from "../svs.icon.component";
import SVSIconContainer, { SVSIconContainerProps } from "../svs.icon.container";
import mainTranslations from "@locales/main.json";
import { _t } from "@src/hooks/__mocks__/locale.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/locale.hook");

jest.mock("../svs.icon.component", () =>
  require("@fixtures/react/child").createComponent("SVSIcon")
);

describe("SVSIconContainer", () => {
  let currentProps: SVSIconContainerProps;

  const baseProps: SVSIconContainerProps = {
    width: 50,
    height: 50,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetProps();
  });

  const arrange = () => {
    render(<SVSIconContainer {...currentProps} />);
  };

  const resetProps = () => (currentProps = { ...baseProps });

  describe("when rendered with defaults", () => {
    beforeEach(() => {
      delete currentProps.height;
      delete currentProps.width;

      arrange();
    });

    it("should render the SVSIcon component with the correct props", () => {
      expect(SVSIcon).toBeCalledTimes(1);
      checkMockCall(
        SVSIcon,
        {
          altText: _t(mainTranslations.altText.svs),
          height: 50,
          width: 50,
        },
        0
      );
    });
  });

  describe("when rendered with configured values", () => {
    beforeEach(() => {
      currentProps.height = 100;
      currentProps.width = 150;

      arrange();
    });

    it("should render the SVSIcon component with the correct props", () => {
      expect(SVSIcon).toBeCalledTimes(1);
      checkMockCall(
        SVSIcon,
        {
          altText: _t(mainTranslations.altText.svs),
          height: currentProps.height,
          width: currentProps.width,
        },
        0
      );
    });
  });
});
