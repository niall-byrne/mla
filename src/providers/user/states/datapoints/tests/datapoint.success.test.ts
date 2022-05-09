import { mockAlbumsReport } from "../../../tests/fixtures/mock.user.state.data";
import ReducerState from "../datapoint.success.class";
import type { UserActionType } from "../../../../../types/user/action.types";
import type { UserStateInterface } from "../../../../../types/user/state.types";

const testType = "DataPointSuccessFetch";
type actionType = UserActionType & { type: typeof testType };

describe(testType, () => {
  let stateClass: ReducerState;
  let action: actionType;
  let received: UserStateInterface;
  const testIntegrationType = "TEST";
  const testUserName = "testUserName";
  const testState = {
    data: { integration: testIntegrationType },
    userName: testUserName,
    profileUrl: "mockProfile",
  } as UserStateInterface;

  const arrange = (state: UserStateInterface, action: actionType) => {
    stateClass = new ReducerState(state, action);
    received = stateClass.apply();
  };

  describe("When Initialized", () => {
    describe("apply", () => {
      describe("with a matching action", () => {
        beforeEach(() => {
          action = {
            type: testType,
            data: mockAlbumsReport,
          };
          arrange(testState, action);
        });

        it("should return the correct state", () => {
          expect(received.inProgress).toBe(false);
          expect(received.profileUrl).toBe(testState.profileUrl);
          expect(received.userName).toBe(testState.userName);
          expect(received.data).toStrictEqual({
            integration: testIntegrationType,
            report: action.data,
          });
          expect(received.error).toBe(null);
          expect(received.ready).toBe(false);
          expect(received.retries).toBe(stateClass.initialRetries);
        });
      });

      describe("with a NON matching action", () => {
        beforeEach(() => {
          action = {
            type: "UnknownType",
          } as unknown as actionType;
          arrange(testState, action);
        });

        it("should return the correct state", () => {
          expect(received).toStrictEqual(testState);
        });
      });
    });
  });
});
