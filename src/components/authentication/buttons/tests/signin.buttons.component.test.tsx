import { render } from "@testing-library/react";
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import SignInButtons from "../signin.buttons.component";
import authenticationTranslations from "@locales/authentication.json";
import AnalyticsButtonWrapper from "@src/components/analytics/analytics.button/analytics.button.container";
import SpotifyLoginButton from "@src/components/button/button.spotify/button.spotify.component";
import { MockUseLocale, _t } from "@src/hooks/__mocks__/locale.hook.mock";
import checkMockCall from "@src/tests/fixtures/mock.component.call";

jest.mock("react-social-login-buttons", () => ({
  FacebookLoginButton: jest.fn(() => "FacebookLoginButton"),
  GithubLoginButton: jest.fn(() => "GithubLoginButton"),
  GoogleLoginButton: jest.fn(() => "GoogleLoginButton"),
}));

jest.mock(
  "@src/components/button/button.spotify/button.spotify.component",
  () => jest.fn(() => "SpotifyLoginButton")
);

jest.mock(
  "@src/components/analytics/analytics.button/analytics.button.container",
  () =>
    require("@fixtures/react/parent").createComponent("AnalyticsButtonWrapper")
);

describe("AuthenticationComponent", () => {
  const buttonWidth = 245;

  const mockHandleSignIn = jest.fn();
  const mockT = new MockUseLocale("authentication").t;

  beforeEach(() => {
    jest.clearAllMocks();
    arrange();
  });

  const arrange = () => {
    render(<SignInButtons handleSignIn={mockHandleSignIn} t={mockT} />);
  };

  it("should call the AnalyticsWrapper component correctly", () => {
    expect(AnalyticsButtonWrapper).toBeCalledTimes(4);
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Facebook Login",
      },
      0
    );
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Github Login",
      },
      1
    );
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Google Login",
      },
      2
    );
    checkMockCall(
      AnalyticsButtonWrapper,
      {
        buttonName: "Spotify Login",
      },
      3
    );
  });

  it("should call the FacebookLoginButton component correctly", () => {
    expect(FacebookLoginButton).toBeCalledTimes(1);
    checkMockCall(
      FacebookLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: _t(authenticationTranslations.buttons.facebook),
      },
      0,
      ["onClick"]
    );
  });

  it("should call the GithubLoginButton component correctly", () => {
    expect(GithubLoginButton).toBeCalledTimes(1);
    checkMockCall(
      GithubLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: _t(authenticationTranslations.buttons.github),
      },
      0,
      ["onClick"]
    );
  });

  it("should call the GoogleLoginButton component correctly", () => {
    expect(GoogleLoginButton).toBeCalledTimes(1);
    checkMockCall(
      GoogleLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: _t(authenticationTranslations.buttons.google),
      },
      0,
      ["onClick"]
    );
  });

  it("should call the SpotifyLoginButton component correctly", () => {
    expect(SpotifyLoginButton).toBeCalledTimes(1);
    checkMockCall(
      SpotifyLoginButton,
      {
        style: { width: buttonWidth },
        align: "center",
        text: _t(authenticationTranslations.buttons.spotify),
      },
      0,
      ["onClick"]
    );
  });
});
