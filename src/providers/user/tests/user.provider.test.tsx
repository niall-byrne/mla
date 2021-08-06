import { render } from "@testing-library/react";
import React from "react";
import InitialValues from "../user.initial";
import UserProvider, { UserContext } from "../user.provider";
import type { UserContextInterface } from "../../../types/user/context.types";

describe("UserProvider", () => {
  const received: Partial<UserContextInterface> = {};

  const arrange = () => {
    render(
      <UserProvider>
        <UserContext.Consumer>
          {(state) => (
            <div>
              {"Place Holder Div"}
              {JSON.stringify(Object.assign(received, state))}
            </div>
          )}
        </UserContext.Consumer>
      </UserProvider>
    );
  };

  describe("when initialized", () => {
    beforeEach(() => {
      arrange();
    });

    it("should contain the expected properties", () => {
      const properties = received as UserContextInterface;
      expect(properties.dispatch).toBeInstanceOf(Function);
      expect(properties.userProperties).toBe(InitialValues.userProperties);
    });
  });
});
