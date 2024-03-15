import { render } from "@testing-library/react";
import UserNameForm from "../username.form.component";
import UserNameFormContainer from "../username.form.container";
import { fields } from "../username.form.identifiers";
import lastfmTranslations from "@locales/lastfm.json";
import lastfmSettings from "@src/config/lastfm";
import checkMockCall from "@src/fixtures/mocks/mock.component.call";
import mockAuthHook, {
  mockUserProfile,
} from "@src/web/authentication/session/hooks/__mocks__/auth.hook.mock";
import mockFormHook from "@src/web/forms/generics/state/controllers/__mocks__/forms.controller.hook.mock";
import { _t } from "@src/web/locale/translation/hooks/__mocks__/translation.hook.mock";
import mockRouterHook from "@src/web/navigation/routing/hooks/__mocks__/router.hook.mock";
import type { LastFMUserSearchInterface } from "@src/web/forms/lastfm/types/username.form.types";
import type { FormikHelpers } from "formik";

jest.mock("@src/web/authentication/session/hooks/auth.hook");

jest.mock("@src/web/forms/generics/state/controllers/forms.controller.hook");

jest.mock(
  "@src/web/navigation/navbar/state/controllers/navbar.controller.hook"
);

jest.mock("@src/web/locale/translation/hooks/translation.hook");

jest.mock("@src/web/navigation/routing/hooks/router.hook");

jest.mock("../username.form.component", () =>
  require("@fixtures/react/child").createComponent("UserNameForm", "default", {
    id: require("../username.form.identifiers").ids.username,
  })
);

describe("UserNameFormContainer", () => {
  let validateUserName: (username: string) => string | undefined;
  let handleSubmit: (
    values: LastFMUserSearchInterface,
    actions: FormikHelpers<LastFMUserSearchInterface>
  ) => void;

  const mockRoute = "/a/very/fancy/route/to/something";

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<UserNameFormContainer route={mockRoute} />);
  };

  describe("when rendered", () => {
    beforeEach(() => arrange());

    it("should render the UserNameForm component with the correct props", () => {
      expect(UserNameForm).toHaveBeenCalledTimes(1);
      checkMockCall(
        UserNameForm,
        {
          placeHolderText: _t(lastfmTranslations.search.fieldPlaceholder),
          submitButtonText: _t(lastfmTranslations.search.buttonText),
        },
        0,
        ["handleSubmit", "validateUserName"]
      );
    });
  });

  describe("validateName", () => {
    let returnValue: string | undefined;

    beforeEach(() => jest.clearAllMocks());

    beforeEach(() => {
      arrange();

      expect(UserNameForm).toHaveBeenCalledTimes(1);
      validateUserName =
        jest.mocked(UserNameForm).mock.calls[0][0].validateUserName;
    });

    describe("when called on a non-existing username (minimum length is 1)", () => {
      beforeEach(() => (returnValue = validateUserName("")));

      it("should return the correct value", () => {
        expect(returnValue).toBe(
          _t(lastfmTranslations.search.errors[fields.username].required)
        );
      });

      it("should generate an error", () => {
        expect(mockFormHook.error.open).toHaveBeenCalledTimes(1);
        expect(mockFormHook.error.open).toHaveBeenCalledWith(
          fields.username,
          _t(lastfmTranslations.search.errors[fields.username].required)
        );
      });
    });

    describe("when called on username that's too long", () => {
      beforeEach(
        () =>
          (returnValue = validateUserName(
            "1".repeat(lastfmSettings.search.maxUserLength + 1)
          ))
      );

      it("should return the correct value", () => {
        expect(returnValue).toBe(
          _t(lastfmTranslations.search.errors[fields.username].valid)
        );
      });

      it("should generate an error", () => {
        expect(mockFormHook.error.open).toHaveBeenCalledTimes(1);
        expect(mockFormHook.error.open).toHaveBeenCalledWith(
          fields.username,
          _t(lastfmTranslations.search.errors[fields.username].valid)
        );
      });
    });

    describe("when called on a valid username", () => {
      beforeEach(() => (returnValue = validateUserName("niall-byrne")));

      it("should return the correct value", () => {
        expect(returnValue).toBe(undefined);
      });

      it("should NOT generate an error", () => {
        expect(mockFormHook.error.open).toHaveBeenCalledTimes(0);
      });

      it("should close existing errors", () => {
        expect(mockFormHook.error.close).toHaveBeenCalledTimes(1);
        expect(mockFormHook.error.close).toHaveBeenCalledWith(fields.username);
      });
    });
  });

  describe("handleSubmit", () => {
    const arrangeHandleSubmit = () => {
      arrange();
      expect(UserNameForm).toHaveBeenCalledTimes(1);
      handleSubmit = jest.mocked(UserNameForm).mock.calls[0][0].handleSubmit;
    };

    const mockAction = {
      setSubmitting: jest.fn(),
    } as never as FormikHelpers<LastFMUserSearchInterface>;

    describe.each(["camelCaseUserName", "snake-case-user-name"])(
      "with a valid username (%s)",

      (mockUserName) => {
        const mockFormContent = { username: mockUserName };

        describe("when the user is logged in", () => {
          beforeEach(() => {
            mockAuthHook.status = "authenticated";
            mockAuthHook.user = mockUserProfile;
            arrangeHandleSubmit();
          });

          describe("when submitted with a username", () => {
            beforeEach(() => handleSubmit(mockFormContent, mockAction));

            it("should NOT call setSubmitting", () => {
              expect(mockAction.setSubmitting).toHaveBeenCalledTimes(0);
            });

            it("should redirect to the expected route", () => {
              const caseConvertedMockFormContent = {
                username: mockFormContent.username.toLocaleLowerCase(),
              };
              const query = new URLSearchParams(caseConvertedMockFormContent);

              expect(mockRouterHook.push).toHaveBeenCalledTimes(1);
              expect(mockRouterHook.push).toHaveBeenCalledWith(
                `${mockRoute}?${query.toString()}`
              );
            });
          });
        });

        describe("when the user is not logged in", () => {
          beforeEach(() => {
            mockAuthHook.status = "unauthenticated";
            mockAuthHook.user = null;
            arrangeHandleSubmit();
          });

          describe("when submitted with a username", () => {
            beforeEach(() => handleSubmit(mockFormContent, mockAction));

            it("should call setSubmitting as expected", () => {
              expect(mockAction.setSubmitting).toHaveBeenCalledTimes(1);
              expect(mockAction.setSubmitting).toHaveBeenCalledWith(false);
            });

            it("should generate an error", () => {
              expect(mockFormHook.error.open).toHaveBeenCalledTimes(1);
              expect(mockFormHook.error.open).toHaveBeenCalledWith(
                "session",
                _t(lastfmTranslations.search.errors.session.notLoggedIn)
              );
            });

            it("should NOT redirect", () => {
              expect(mockRouterHook.push).toHaveBeenCalledTimes(0);
            });
          });
        });
      }
    );
  });
});
