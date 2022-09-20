import { render } from "@testing-library/react";
import NavBarAvatar from "../../navbar.avatar/navbar.avatar.component";
import NavBarLinkContainer from "../../navbar.link/navbar.link.container";
import NavBarLogo from "../navbar.logo.component";
import navbarTranslations from "@locales/navbar.json";
import routes from "@src/config/routes";
import { _t } from "@src/hooks/__mocks__/locale.mock";

jest.mock("@src/hooks/locale");

jest.mock("../../navbar.avatar/navbar.avatar.component", () =>
  require("@fixtures/react/child").createComponent("NavBarAvatar")
);

jest.mock("../../navbar.link/navbar.link.container", () =>
  require("@fixtures/react/parent").createComponent("NavBarLink")
);

describe("NavBarLogo", () => {
  let mockCurrentPath: string;
  let mockTransaction: boolean;

  const mockCloseMobileMenu = jest.fn();
  const mockTracker = jest.fn();
  const mockAuthData = {
    name: "mockUser",
    image: "https://mock/profile/url",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(
      <NavBarLogo
        closeMobileMenu={mockCloseMobileMenu}
        currentPath={mockCurrentPath}
        tracker={mockTracker}
        transaction={mockTransaction}
        user={mockAuthData}
      />
    );
  };

  const checkNavBarLink = () => {
    it("should render the title NavBarLinkContainer with the correct props", () => {
      expect(NavBarLinkContainer).toBeCalledTimes(1);
      expect(NavBarLinkContainer).toBeCalledWith(
        {
          closeMobileMenu: mockCloseMobileMenu,
          children: _t(navbarTranslations.title),
          selected: routes.home === mockCurrentPath,
          path: routes.home,
          tracker: mockTracker,
          transaction: mockTransaction,
        },
        {}
      );
    });
  };

  const checkNavBarAvatar = () => {
    it("should render the Avatar with the correct props", () => {
      expect(NavBarAvatar).toBeCalledTimes(1);
      expect(NavBarAvatar).toBeCalledWith(
        {
          user: mockAuthData,
        },
        {}
      );
    });
  };

  const scenario1 = () => {
    describe("when the currentPath is NOT home", () => {
      beforeEach(() => {
        mockCurrentPath = routes.about;

        arrange();
      });

      checkNavBarLink();
      checkNavBarAvatar();
    });
  };

  const scenario2 = () => {
    describe("when the currentPath is home", () => {
      beforeEach(() => {
        mockCurrentPath = routes.home;

        arrange();
      });

      checkNavBarLink();
      checkNavBarAvatar();
    });
  };

  describe("when there is a transaction", () => {
    beforeEach(() => (mockTransaction = true));

    scenario1();
    scenario2();
  });

  describe("when there is NOT a transaction", () => {
    beforeEach(() => (mockTransaction = false));

    scenario1();
    scenario2();
  });
});
