import { act, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { InitialState } from "../../providers/user/user.initial";
import { UserContext } from "../../providers/user/user.provider";
import useLastFM from "../lastfm";
import type { UserContextInterface } from "../../types/user/context.types";

jest.mock("../../clients/api/reports/lastfm.class", () => {
  return jest.fn().mockImplementation(() => {
    return {
      retrieveAlbumReport: mockRetrieve,
    };
  });
});

const mockRetrieve = jest.fn();

interface MockUserContextWithChildren {
  children?: React.ReactNode;
  mockContext: UserContextInterface;
}

describe("useLastFM", () => {
  const mockUserName = "user1234";
  const mockDispatch = jest.fn();
  let received: ReturnType<typeof arrange>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const providerWrapper = ({
    children,
    mockContext,
  }: MockUserContextWithChildren) => {
    return (
      <UserContext.Provider value={mockContext}>
        {children}
      </UserContext.Provider>
    );
  };

  const arrange = (providerProps: UserContextInterface) => {
    return renderHook(() => useLastFM(), {
      wrapper: providerWrapper,
      initialProps: {
        mockContext: providerProps,
      },
    });
  };

  describe("is rendered", () => {
    beforeEach(() => {
      received = arrange({
        userProperties: { ...InitialState },
        dispatch: mockDispatch,
      });
    });

    it("should contain the correct properties", () => {
      expect(received.result.current.userProperties).toStrictEqual(
        InitialState
      );
    });

    it("should contain the correct functions", () => {
      expect(received.result.current.top20).toBeInstanceOf(Function);
      expect(received.result.current.clear).toBeInstanceOf(Function);
    });
  });

  describe("top20", () => {
    beforeEach(async () => {
      act(() => received.result.current.top20(mockUserName));
    });

    it("should retrieve the report from lastfm", async () => {
      await waitFor(() => expect(mockRetrieve).toBeCalledTimes(1));
      expect(mockRetrieve).toHaveBeenCalledWith(mockUserName);
    });
  });

  describe("clear", () => {
    it("should dispatch the reducer correctly", async () => {
      act(() => received.result.current.clear());
      await waitFor(() => expect(mockDispatch).toBeCalledTimes(1));
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "ResetState",
      });
    });
  });
});
