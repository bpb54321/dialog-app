import React from 'react';
import {act} from 'react-dom/test-utils';
import {
  render,
  RenderResult,
  cleanup,
  waitForDomChange
} from "@testing-library/react";
import {RolePicker} from "../components/RolePicker";
import {GlobalContextObject} from "../contexts/GlobalStateContext";



jest.mock("../utils/fetch-data", () => {

  return jest.fn( (query: string, queryVariables: {[index: string]: any},
                  topLevelQueryField: string, globalContext: GlobalContextObject) => {

    return Promise.resolve({
      name: "Test Dialog",
      roles: [
        {
          id: "abc",
          name: "Role 0",
        }, {
          id: "def",
          name: "Role 1"
        }
      ],
    });
  });
});

describe('RolePicker', () => {
  let wrapper: RenderResult;
  let mockFunction: jest.Mock;
  const history = {};
  const match = {
    params: {
      dialogId: "abc"
    }
  };

  beforeEach(async () => {
    mockFunction = jest.fn();
    await act((async () => {
      wrapper = render(<RolePicker history={history} match={match}/>);

      // Wait for fetch data to run
      await waitForDomChange();
    }) as (() => void)); // Hack to prevent TS from complaining about signature of callback passed to act().
    // TODO: Remove TS hack once typings for react-dom are updated.
  });

  afterEach(cleanup);

  it(`When the component fetches the roles associated with a given Dialog
        Then it should display the roles as options in it's select element`, function () {

    const firstRoleOption = wrapper.getByText("Role 0");
    expect(firstRoleOption.tagName).toBe("OPTION");

    const secondRoleOption = wrapper.getByText("Role 1");
    expect(secondRoleOption.tagName).toBe("OPTION");
  });
});
