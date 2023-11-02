import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import AuthenticationContainer from "../authentication.container";
import { testIDs as AuthModalTestIDs } from "../modals/signin/modal.signin.identifiers";
import { testIDs as SpinnerModalTestIDs } from "../modals/spinner/modal.spinner.identifiers";
import authenticationTranslations from "@locales/authentication.json";
import routes from "@src/config/routes";
import Events from "@src/web/analytics/collection/events/definitions";
import mockAnalyticsCollectionHook from "@src/web/analytics/collection/state/hooks/__mocks__/analytics.hook.mock";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import mockToggleHook from "@src/web/ui/generics/state/hooks/__mocks__/toggle.hook.mock";

jest.mock("@src/web/analytics/collection/state/hooks/analytics.hook");

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("@src/web/ui/generics/state/hooks/toggle.hook");

jest.mock(
  "@src/web/ui/scrollbars/vertical/components/vertical.scrollbar.container",
  () =>
    require("@fixtures/react/child").createComponent(
      "VerticalScrollBarContainer"
    )
);

jest.mock("@src/vendors/integrations/web.framework/vendor");

describe("AuthenticationContainer", () => {
  let mockCallBack: (() => void) | undefined;

  const providers: (keyof typeof authenticationTranslations.buttons)[] = [
    "facebook",
    "github",
    "google",
    "lastfm",
    "spotify",
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const arrange = () => {
    render(<AuthenticationContainer onModalClose={mockCallBack} />);
  };

  const checkModal = () => {
    it("should display the modal title text", async () => {
      const title = await screen.findByTestId(
        AuthModalTestIDs.AuthenticationModalTitle
      );
      await waitFor(() => expect(title).toBeVisible());
      expect(
        await within(title).findByText(_t(authenticationTranslations.title))
      ).toBeTruthy();
    });

    it("should display the modal close button", async () => {
      const button = await screen.findByTestId(
        AuthModalTestIDs.AuthenticationModalCloseButton
      );
      await waitFor(() => expect(button).toBeVisible());
    });

    it("should generate an analytics event", async () => {
      expect(mockAnalyticsCollectionHook.event).toHaveBeenCalledTimes(1);
      expect(mockAnalyticsCollectionHook.event).toHaveBeenCalledWith(
        Events.Auth.OpenModal
      );
    });
  };

  const checkModalSwitch = () => {
    it("should close the authentication modal", async () => {
      await waitFor(
        () =>
          expect(
            screen.queryByTestId(AuthModalTestIDs.AuthenticationModalTitle)
          ).toBeNull
      );
    });

    it("should open the spinner modal, and display the title", async () => {
      expect(
        await screen.findByTestId(
          SpinnerModalTestIDs.AuthenticationSpinnerModalTitle
        )
      ).toBeTruthy();
    });

    it("should open the spinner modal, and display the spinner", async () => {
      expect(
        await screen.findByTestId(
          SpinnerModalTestIDs.AuthenticationSpinnerModalSpinner
        )
      ).toBeTruthy();
    });
  };

  const checkLoginButtons = () => {
    providers.map((provider) => {
      describe(`when the ${provider} button is clicked`, () => {
        beforeEach(async () => {
          jest.clearAllMocks();
          const button = await screen.findByText(
            _t(authenticationTranslations.buttons[provider])
          );
          await waitFor(() => expect(button).toBeVisible());
          fireEvent.click(button);
        });

        it("should start the sign-in sequence", () => {
          expect(mockAuthHook.signIn).toHaveBeenCalledWith(provider);
        });

        it("should generate an analytics event", () => {
          expect(mockAnalyticsCollectionHook.event).toHaveBeenCalledTimes(1);
          expect(mockAnalyticsCollectionHook.event).toHaveBeenCalledWith(
            Events.Auth.HandleLogin(provider)
          );
        });

        checkModalSwitch();
      });
    });
  };

  describe("modal is open", () => {
    beforeEach(() => (mockToggleHook.state = true));

    describe("user is logged in", () => {
      beforeEach(() => {
        mockAuthHook.status = "authenticated";
        mockAuthHook.user = mockUserProfile;
      });

      describe("when a callback is specified", () => {
        beforeEach(() => {
          mockCallBack = jest.fn();
          arrange();
        });

        checkModal();
        checkLoginButtons();

        describe("when the terms of service link is clicked", () => {
          beforeEach(async () => {
            const footer = await screen.findByTestId(
              AuthModalTestIDs.AuthenticationModalFooter
            );
            const link = await within(footer).findByText(
              _t(authenticationTranslations.terms)
            );
            fireEvent.click(link);
          });

          it("should close the modal", () => {
            expect(mockToggleHook.setFalse).toHaveBeenCalledTimes(1);
            expect(mockToggleHook.setFalse).toHaveBeenCalledWith();
          });

          it("should route to the correct url", () => {
            expect(mockRouterHook.push).toHaveBeenCalledTimes(1);
            expect(mockRouterHook.push).toHaveBeenCalledWith(
              routes.legal.terms
            );
          });
        });

        describe("when the close button is clicked", () => {
          beforeEach(async () => {
            const button = await screen.findByTestId(
              AuthModalTestIDs.AuthenticationModalCloseButton
            );
            await waitFor(() => expect(button).toBeVisible());
            fireEvent.click(button);
          });

          it("should call the callBack function", () => {
            expect(mockCallBack).toHaveBeenCalledTimes(1);
            expect(mockCallBack).toHaveBeenCalledWith();
          });

          it("should NOT change the route", () => {
            expect(mockRouterHook.push).toHaveBeenCalledTimes(0);
          });
        });
      });

      describe("when a callback is NOT specified", () => {
        beforeEach(() => {
          mockCallBack = undefined;
          arrange();
        });

        checkModal();
        checkLoginButtons();

        describe("when the modal close button is clicked", () => {
          beforeEach(async () => {
            jest.clearAllMocks();
            const button = await screen.findByTestId(
              AuthModalTestIDs.AuthenticationModalCloseButton
            );
            await waitFor(() => expect(button).toBeVisible());
            fireEvent.click(button);
          });

          it("should NOT call the callBack function", () => {
            expect(mockCallBack).toBe(undefined);
          });

          it("should push the correct url", () => {
            expect(mockRouterHook.push).toHaveBeenCalledTimes(1);
            expect(mockRouterHook.push).toHaveBeenCalledWith(routes.home);
          });

          it("should generate an analytics event", () => {
            expect(mockAnalyticsCollectionHook.event).toHaveBeenCalledTimes(1);
            expect(mockAnalyticsCollectionHook.event).toHaveBeenCalledWith(
              Events.Auth.CloseModal
            );
          });
        });
      });
    });
  });

  describe("modal is closed", () => {
    beforeEach(() => (mockToggleHook.state = false));

    describe("user is NOT logged in", () => {
      beforeEach(() => {
        mockAuthHook.status = "authenticated";
        mockAuthHook.user = null;
        arrange();
      });

      it("should NOT display the modal title text", async () => {
        expect(
          screen.queryByTestId(AuthModalTestIDs.AuthenticationModalTitle)
        ).toBeNull();
      });
    });
  });
});
