import React from 'react';
import {act} from 'react-dom/test-utils';
import {
  render,
  RenderResult,
  cleanup,
  waitForDomChange
} from "@testing-library/react";
import {RolePicker} from "../components/RolePicker";
import {GlobalProvider} from "../contexts/GlobalStateContext";

jest.mock("../utils/fetch-data", () => {

  return jest.fn(() => {

    return Promise.resolve({
      name: "Test Dialog",
      roles: [
        {
          id: "abc",
          name: "Role 1",
        }, {
          id: "def",
          name: "Role 2"
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
      wrapper = render(
        <GlobalProvider speechRecognition={{}}
          children={<RolePicker history={history} match={match}/>}
        />
      );

      await waitForDomChange();
    }) as () => void);
  });

  afterEach(cleanup);

  it(`When the component fetches the roles associated with a given Dialog
    Then it should display the roles as options in it's select element`, async function () {

    const firstRoleOption = wrapper.getByText("Role 1");
    expect(firstRoleOption.tagName).toBe("OPTION");

    const secondRoleOption = wrapper.getByText("Role 2");
    expect(secondRoleOption.tagName).toBe("OPTION");
  });
});
