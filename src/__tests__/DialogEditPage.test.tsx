import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  wait,
  waitForElement,
  waitForElementToBeRemoved
} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";
import {BrowserRouter} from "react-router-dom";
import {DialogEditPage} from "../pages/DialogEditPage";
import LineData from "../types/LineData";

jest.mock("../utils/fetch-data", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('DialogEditPage', () => {

  let wrapper: RenderResult;

  beforeEach(() => {

  });

  afterEach(() => {
    cleanup();
  });


  test(`Given the dialog has 0 lines
  And the dialog has two roles
  When we add lines to the dialog
  Then their line numbers should be assigned automatically in the order in which they are added.`, async function () {

    const role1 = {
      id: "123",
      name: "John",
    };
    const role2 = {
      id: "456",
      name: "Jane",
    };

    const dialogId = "abc";

    const line1: LineData = {
      id: "101112",
      number: 0, // only used as a placeholder here, to satisfy LineData type
      guess: "",
      role: role1,
      text: "This is the text for line 1.",
    };

    const line2: LineData = {
      id: "131415",
      number: 0, // only used as a placeholder here, to satisfy LineData type
      guess: "",
      role: role2,
      text: "This is the text for line 2.",
    };

    // Initial dialogs that are loaded
    (fetchData as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        id: dialogId,
        name: "Test Dialog",
        languageCode: "en-US",
        roles: [
          role1,
          role2,
        ],
        lines: [],
      });
    });

    wrapper = render(
      <GlobalProvider
        children={
          <BrowserRouter>
            <DialogEditPage
              match={{
                params: {
                  dialogId: dialogId
                }
              }}
              location={{}}
              history={{}}
            />
          </BrowserRouter>
        }
      />
    );

    await waitForElementToBeRemoved(() => {
      return wrapper.getByText(/loading dialog/i);
    });

    // Fill in inputs to create new line
    fireEvent.change(wrapper.getByTestId("new-line-role"), {
      target: {
        value: line1.role.id,
      }
    });

    fireEvent.change(wrapper.getByTestId("new-line-text"), {
      target: {
        value: line1.text,
      }
    });

    // Set up mock return value from fetchData (just so fetchData doesn't throw error)
    (fetchData as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(line1);
    });

    fireEvent.submit(wrapper.getByTestId("add-new-line-form"), {
      preventDefault: jest.fn(),
    });

    // Wait for 1 line update component to appear
    await wait(() => {
      const lineUpdateComponents = wrapper.getAllByTestId("line-with-update-and-delete");
      expect(lineUpdateComponents).toHaveLength(1);
    });

    // Assert that fetch data with CreateLineQuery was called with line number equal to 1
    expect((fetchData as jest.Mock).mock.calls[1]).toContainEqual({
      text: line1.text,
      roleId: line1.role.id,
      dialogId: dialogId,
      number: 1,
    });

    // --------Add Second Line --------------------  //

    // Fill in inputs to create new line
    fireEvent.change(wrapper.getByTestId("new-line-role"), {
      target: {
        value: line2.role.id,
      }
    });

    fireEvent.change(wrapper.getByTestId("new-line-text"), {
      target: {
        value: line2.text,
      }
    });

    // Set up mock return value from fetchData (just so fetchData doesn't throw error)
    (fetchData as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve(line2);
    });

    fireEvent.submit(wrapper.getByTestId("add-new-line-form"), {
      preventDefault: jest.fn(),
    });

    // Wait for 2 line update components to appear
    await wait(() => {
      const lineUpdateComponents = wrapper.getAllByTestId("line-with-update-and-delete");
      expect(lineUpdateComponents).toHaveLength(2);
    });

    // Assert that fetch data with CreateLineQuery was called with line number equal to 2
    expect((fetchData as jest.Mock).mock.calls[2]).toContainEqual({
      text: line2.text,
      roleId: line2.role.id,
      dialogId: dialogId,
      number: 2,
    });

  });
});

