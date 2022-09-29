import { Container } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import TermsOfServiceHeader from "../terms.header.component";
import dialogueSettings from "@src/config/dialogue";
import { MockUseLocale } from "@src/hooks/__mocks__/locale.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@chakra-ui/react", () => {
  const { createChakraMock } = require("@fixtures/chakra");
  return createChakraMock(["Container"]);
});

describe("TermsOfServiceHeader", () => {
  const mockT = new MockUseLocale("legal").t;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    return render(<TermsOfServiceHeader t={mockT} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should call Container with the correct props", () => {
      expect(Container).toBeCalledTimes(2);
      checkMockCall(
        Container,
        {
          centerContent: true,
          mb: 3,
          fontSize: dialogueSettings.smallTextFontSize,
        },
        0
      );
      checkMockCall(
        Container,
        {
          centerContent: true,
          mb: 3,
          fontSize: dialogueSettings.smallTextFontSize,
        },
        1
      );
    });
  });
});
