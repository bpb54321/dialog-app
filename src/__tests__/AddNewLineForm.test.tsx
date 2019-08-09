import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";
import {BrowserRouter} from "react-router-dom";
import {DialogEditPage} from "../pages/DialogEditPage";
import LineData from "../types/LineData";
import {AddNewLineForm} from "../components/AddNewLineForm";

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


  test(`Given our dialog has 0 lines
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

    const line1Text = "This is the text for line 1.";
    const line2Text = "This is the text for line 2.";

    const mockAddLineToDialog = jest.fn();

    act(() => {
      wrapper = render(
        <GlobalProvider
          children={
            <BrowserRouter>
              <AddNewLineForm
                numberOfLinesInDialog={0}
                dialogId={dialogId}
                rolesInDialog={[
                  role1,
                  role2,
                ]}
                addLineToDialog={mockAddLineToDialog}
              />
            </BrowserRouter>
          }
        />
      );
    });

    act(() => {
      // Fill in inputs to create new line
      fireEvent.change(wrapper.getByTestId("new-line-role"), {
        target: {
          value: role1.id,
        }
      });
    });

    act(() => {
      fireEvent.change(wrapper.getByTestId("new-line-text"), {
        target: {
          value: line1Text,
        }
      });
    });

    // Prepare our mocked API to return the created line data that we would expect, given the arguments
    // that are passed into fetchData
    (fetchData as jest.Mock).mockImplementation((...args) => {
      const queryVariables = args[1];
      return Promise.resolve({
        id: String(Math.round(Math.random()*1000)), // Would be generated by API
        text: queryVariables.text,
        number: queryVariables.number,
        role: {
          id: queryVariables.roleId,
        },
      });
    });

    // Awaiting the asynchronuse fetchData call triggered by the submit event
    await act((async () => {
      fireEvent.submit(wrapper.getByTestId("add-new-line-form"), {
        preventDefault: jest.fn(),
      });
    }) as () => void);

    let mockAddLineToDialogParameter = mockAddLineToDialog.mock.calls[0][0];

    expect(mockAddLineToDialogParameter.number).toBe(1);
    expect(mockAddLineToDialogParameter.text).toBe(line1Text);
    expect(mockAddLineToDialogParameter.role.id).toBe(role1.id);

    // Once the lines are updated in the parent dialog, this components props should update and it should re-render
    act(() => {
      wrapper.rerender(
        <GlobalProvider
          children={
            <BrowserRouter>
              <AddNewLineForm
                numberOfLinesInDialog={1}
                dialogId={dialogId}
                rolesInDialog={[
                  role1,
                  role2,
                ]}
                addLineToDialog={mockAddLineToDialog}
              />
            </BrowserRouter>
          }
        />
      );
    });

    // --------Add Second Line --------------------  //

    act(() => {
      // Fill in inputs to create new line
      fireEvent.change(wrapper.getByTestId("new-line-role"), {
        target: {
          value: role2.id,
        }
      });
    });

    act(() => {
      fireEvent.change(wrapper.getByTestId("new-line-text"), {
        target: {
          value: line2Text,
        }
      });
    });

    await act((async () => {
      fireEvent.submit(wrapper.getByTestId("add-new-line-form"), {
        preventDefault: jest.fn(),
      });
    }) as () => void);

    mockAddLineToDialogParameter = mockAddLineToDialog.mock.calls[1][0];

    expect(mockAddLineToDialogParameter.number).toBe(2);
    expect(mockAddLineToDialogParameter.text).toBe(line2Text);
    expect(mockAddLineToDialogParameter.role.id).toBe(role2.id);
  });
});

