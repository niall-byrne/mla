import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import NextAuthConfig from "../../../pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

jest.mock("next-auth", () => jest.fn());
jest.mock("next-auth/providers/facebook", () => jest.fn());
jest.mock("next-auth/providers/github", () => jest.fn());
jest.mock("next-auth/providers/google", () => jest.fn());

describe("NextAuthConfig", () => {
  let originalEnvironment: typeof process.env;
  let req: MockRequest<NextApiRequest>;
  let res: MockResponse<NextApiResponse>;
  let mockValueIndex = 0;

  function mockValue() {
    const value = `mockValue${mockValueIndex}`;
    mockValueIndex++;
    return value;
  }

  beforeAll(() => {
    originalEnvironment = process.env;
    process.env.AUTH_FACEBOOK_ID = mockValue();
    process.env.AUTH_FACEBOOK_SECRET = mockValue();
    process.env.AUTH_GITHUB_ID = mockValue();
    process.env.AUTH_GITHUB_SECRET = mockValue();
    process.env.AUTH_GOOGLE_ID = mockValue();
    process.env.AUTH_GOOGLE_SECRET = mockValue();
    process.env.AUTH_MASTER_SECRET_KEY = mockValue();
    process.env.AUTH_MASTER_JWT_SECRET = mockValue();
    process.env.AUTH_MASTER_JWT_SIGNING_KEY = mockValue();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnvironment;
  });

  const arrange = async () => {
    ({ req: req, res: res } = createMocks<NextApiRequest, NextApiResponse>({
      url: "/",
      method: "GET",
    }));
    await NextAuthConfig(req, res);
  };

  describe("NextAuth processes a request", () => {
    beforeEach(async () => {
      await arrange();
    });

    it("should initialize the Facebook Provider", async () => {
      expect(FacebookProvider).toBeCalledTimes(1);
      expect(FacebookProvider).toBeCalledWith({
        clientId: process.env.AUTH_FACEBOOK_ID,
        clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      });
    });

    it("should initialize the GithubProvider Provider", async () => {
      expect(GithubProvider).toBeCalledTimes(1);
      expect(GithubProvider).toBeCalledWith({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      });
    });

    it("should initialize the GoogleProvider Provider", async () => {
      expect(GoogleProvider).toBeCalledTimes(1);
      expect(GoogleProvider).toBeCalledWith({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      });
    });

    it("should initialize the JWT Key", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(call.jwt.secret).toBe(process.env.AUTH_MASTER_JWT_SECRET);
      expect(call.jwt.signingKey).toBe(process.env.AUTH_MASTER_JWT_SIGNING_KEY);
    });

    it("should initialize the Secret hash value", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(call.secret).toBe(process.env.AUTH_MASTER_SECRET_KEY);
    });

    it("should initialize the Session", async () => {
      expect(NextAuth).toBeCalledTimes(1);
      const call = (NextAuth as jest.Mock).mock.calls[0][2];
      expect(call.session.maxAge).toBe(7 * 24 * 60 * 60);
      expect(call.session.jwt).toBe(true);
    });
  });
});
