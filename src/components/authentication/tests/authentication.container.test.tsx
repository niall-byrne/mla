import { render } from "@testing-library/react";
import AuthenticationSignInModalContainer from "../authentication.container";
import ModalSignInComponent from "../modals/signin/modal.signin.container";
import mockAuthHook, {
  mockUserProfile,
} from "@src/hooks/__mocks__/auth.hook.mock";
import mockToggleHook from "@src/hooks/utility/__mocks__/toggle.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("@src/hooks/auth.hook");

jest.mock("@src/hooks/router.hook");

jest.mock("@src/hooks/utility/toggle.hook");

jest.mock("../modals/signin/modal.signin.container", () =>
  require("@fixtures/react/child").createComponent(
    "AuthenticationSignInModalContainer"
  )
);

describe("AuthenticationContainer", () => {
  let modalHidden: boolean;

  beforeEach(() => jest.clearAllMocks());

  const arrange = () => {
    render(<AuthenticationSignInModalContainer hidden={modalHidden} />);
  };

  const checkModalSignInComponent = () => {
    it("should call the ModalComponent with the correct props", () => {
      expect(ModalSignInComponent).toBeCalledTimes(1);
      checkMockCall(
        ModalSignInComponent,
        {
          isOpen: mockToggleHook.state,
        },
        0,
        ["handleSignIn", "onClose"]
      );
    });
  };

  describe("when the modal is NOT hidden", () => {
    beforeEach(() => {
      modalHidden = false;
    });

    describe("modal is open", () => {
      beforeEach(() => {
        mockToggleHook.state = true;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        checkModalSignInComponent();

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(1);
          expect(mockToggleHook.setFalse).toBeCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        checkModalSignInComponent();

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(0);
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(0);
        });
      });
    });

    describe("modal is closed", () => {
      beforeEach(() => {
        mockToggleHook.state = false;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        checkModalSignInComponent();

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(1);
          expect(mockToggleHook.setFalse).toBeCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        checkModalSignInComponent();

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(0);
        });

        it("should open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(1);
          expect(mockToggleHook.setTrue).toBeCalledWith();
        });
      });
    });
  });

  describe("when the modal is hidden", () => {
    beforeEach(() => {
      modalHidden = true;
    });

    describe("modal is open", () => {
      beforeEach(() => {
        mockToggleHook.state = true;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(1);
          expect(mockToggleHook.setFalse).toBeCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(0);
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(0);
        });
      });
    });

    describe("modal is closed", () => {
      beforeEach(() => {
        mockToggleHook.state = false;
      });

      describe("user is logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "authenticated";
          mockAuthHook.user = mockUserProfile;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(1);
          expect(mockToggleHook.setFalse).toBeCalledWith();
        });

        it("should NOT open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(0);
        });
      });

      describe("user is NOT logged in", () => {
        beforeEach(() => {
          mockAuthHook.status = "unauthenticated";
          mockAuthHook.user = null;
          arrange();
        });

        it("should NOT call the ModalComponent", () => {
          expect(ModalSignInComponent).toBeCalledTimes(0);
        });

        it("should NOT close the modal on render", () => {
          expect(mockToggleHook.setFalse).toBeCalledTimes(0);
        });

        it("should open the modal on render", () => {
          expect(mockToggleHook.setTrue).toBeCalledTimes(1);
          expect(mockToggleHook.setTrue).toBeCalledWith();
        });
      });
    });
  });
});
