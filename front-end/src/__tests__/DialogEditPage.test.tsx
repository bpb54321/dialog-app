import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  wait,
  waitForElementToBeRemoved
} from "@testing-library/react";
import { within } from '@testing-library/dom';
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
  const line3Text = "This is the text for line 3.";

  beforeEach(() => {

  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  describe(`Automatic line numbering`, () => {
    test(`Given a dialog with 0 lines
        When I add 2 lines
        Then the first line should be numbered 1
        And the second line should be number 2`,
      async function () {

        //region ARRANGE
        // Initial dialog that is loaded
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
        //endregion

        await act((async () => {
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
        }) as () => void);

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

        await act((async () => {
          fireEvent.submit(wrapper.getByTestId("add-new-line-form"), {
            preventDefault: jest.fn(),
          });

          // Wait for 1 line update component to appear
          await wait(() => {
            const lines = wrapper.getAllByTestId("line-with-update-and-delete");
            expect(lines).toHaveLength(1);
          });
        }) as () => void);

        let line1 = within(wrapper.getAllByTestId("line-with-update-and-delete")[0]);
        line1.getByText(line1Text);

        // --------Add Second Line --------------------  //

        act(() => {
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

          await wait(() => {
            const lines = wrapper.getAllByTestId("line-with-update-and-delete");
            expect(lines).toHaveLength(2);
          });
        }) as () => void);

        line1 = within(wrapper.getAllByTestId("line-with-update-and-delete")[0]);
        line1.getByText(line1Text);

        let line2 = within(wrapper.getAllByTestId("line-with-update-and-delete")[1]);
        line2.getByText(line2Text);
      }
    );

    test(`Given a dialog with 3 lines
        When I delete line 2 of 3
        Then the remaining lines should be numbered 1 and 2`,
      async function () {

        //region ARRANGE
        // Initial dialog that is loaded, this time 3 lines are already created
        (fetchData as jest.Mock).mockImplementationOnce(() => {
          return Promise.resolve({
            id: dialogId,
            name: "Test Dialog",
            languageCode: "en-US",
            roles: [
              role1,
              role2,
            ],
            lines: [
              {
                id: "a",
                text: line1Text,
                role: role1,
                guess: "",
                number: 1,
              },
              {
                id: "b",
                text: line2Text,
                role: role2,
                guess: "",
                number: 2,
              },
              {
                id: "c",
                text: line3Text,
                role: role1,
                guess: "",
                number: 3,
              },
            ] as LineData[],
          });
        });
        //endregion

        //region ACT
        await act((async () => {
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
        }) as () => void);

        // Prepare for call to DeleteLine query
        // The call to fetchData must return a Promise, because a then() is chained to it, since we send an UpdateLine
        // query once the DeleteLine query is sucessful
        (fetchData as jest.Mock).mockImplementationOnce(() => {
          return Promise.resolve(true); // true means deletion was successful
        });

        await act((async () => {
          // Delete line 2
          fireEvent.click(wrapper.getAllByText(/delete line/i)[1]);

          await wait(() => {
            expect(wrapper.getAllByTestId("line-with-update-and-delete")).toHaveLength(2);
          });
        }) as () => void);
        //endregion

        //region ASSERT
        let line1 = within(wrapper.getAllByTestId("line-with-update-and-delete")[0]);
        line1.getByText(line1Text);

        let updatedLine3 = within(wrapper.getAllByTestId("line-with-update-and-delete")[1]);
        updatedLine3.getByText(line3Text);
        //endregion

    });
  });

  describe(`Moving lines up and down in the dialog`, () => {
    test(
      `Given a dialog with 3 lines
        When I click the Move Line Up button on the third line
        Then the third line moves to position 2
        And the second line moves to position 3`,
      async function() {
        //region ARRANGE
        // Initial dialog that is loaded, this time 3 lines are already created
        (fetchData as jest.Mock).mockImplementationOnce(() => {
          return Promise.resolve({
            id: dialogId,
            name: "Test Dialog",
            languageCode: "en-US",
            roles: [
              role1,
              role2,
            ],
            lines: [
              {
                id: "a",
                text: line1Text,
                role: role1,
                guess: "",
                number: 1,
              },
              {
                id: "b",
                text: line2Text,
                role: role2,
                guess: "",
                number: 2,
              },
              {
                id: "c",
                text: line3Text,
                role: role1,
                guess: "",
                number: 3,
              },
            ] as LineData[],
          });
        });
        //endregion

        //region ACT
        await act((async () => {
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
        }) as () => void);

        // Prepare for call to UpdateLine query
        (fetchData as jest.Mock).mockImplementationOnce(() => {
          return Promise.resolve({});
        });

        await act((async () => {
          // Move line 3 up to line 2
          const line3 = within(wrapper.getAllByTestId("line-with-update-and-delete")[2]);
          fireEvent.click(line3.getByText(/move line up/i));
        }) as () => void);
        //endregion

        //region ASSERT
        const line2 = within(wrapper.getAllByTestId("line-with-update-and-delete")[1]);
        line2.getByText(line3Text);
        const line3 = within(wrapper.getAllByTestId("line-with-update-and-delete")[2]);
        line3.getByText(line2Text);
        //endregion
      }
    );

    test(
      `Given a dialog with 3 lines
        When I click the Move Line Down button on the first line
        Then the first line moves to position 2
        And the second line moves to position 1`,
      async function() {
        //region ARRANGE
        // Initial dialog that is loaded, this time 3 lines are already created
        (fetchData as jest.Mock).mockImplementationOnce(() => {
          return Promise.resolve({
            id: dialogId,
            name: "Test Dialog",
            languageCode: "en-US",
            roles: [
              role1,
              role2,
            ],
            lines: [
              {
                id: "a",
                text: line1Text,
                role: role1,
                guess: "",
                number: 1,
              },
              {
                id: "b",
                text: line2Text,
                role: role2,
                guess: "",
                number: 2,
              },
              {
                id: "c",
                text: line3Text,
                role: role1,
                guess: "",
                number: 3,
              },
            ] as LineData[],
          });
        });
        //endregion

        //region ACT
        await act((async () => {
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
        }) as () => void);

        // Prepare for call to UpdateLine query
        (fetchData as jest.Mock).mockImplementationOnce(() => {
          return Promise.resolve({});
        });

        await act((async () => {
          fireEvent.click(wrapper.getAllByText(/move line down/i)[0]);
        }) as () => void);
        //endregion

        //region ASSERT
        const line1 = within(wrapper.getAllByTestId("line-with-update-and-delete")[0]);
        line1.getByText(line2Text);
        const line2 = within(wrapper.getAllByTestId("line-with-update-and-delete")[1]);
        line2.getByText(line1Text);
        //endregion
      }
    );

    test(
      `Given a dialog with 3 lines
        Then the first line has a Move Line Down button but not Move Line Up button
        And the second line has both a Move Line Down and Move Line Up button
        And the third line has a Move Line Up button but no Move Line Down button`,
      async function() {
        //region ARRANGE
        // Initial dialog that is loaded, this time 3 lines are already created
        (fetchData as jest.Mock).mockImplementationOnce(() => {
          return Promise.resolve({
            id: dialogId,
            name: "Test Dialog",
            languageCode: "en-US",
            roles: [
              role1,
              role2,
            ],
            lines: [
              {
                id: "a",
                text: line1Text,
                role: role1,
                guess: "",
                number: 1,
              },
              {
                id: "b",
                text: line2Text,
                role: role2,
                guess: "",
                number: 2,
              },
              {
                id: "c",
                text: line3Text,
                role: role1,
                guess: "",
                number: 3,
              },
            ] as LineData[],
          });
        });
        //endregion

        //region ACT
        await act((async () => {
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
        }) as () => void);
        //endregion

        //region ASSERT
        const line1 = within(wrapper.getAllByTestId("line-with-update-and-delete")[0]);
        line1.getByText(/move line down/i);
        expect(line1.queryByText(/move line up/i)).toBeNull();

        const line2 = within(wrapper.getAllByTestId("line-with-update-and-delete")[1]);
        line2.getByText(/move line up/i);
        line2.getByText(/move line down/i);

        const line3 = within(wrapper.getAllByTestId("line-with-update-and-delete")[2]);
        line3.getByText(/move line up/i);
        expect(line3.queryByText(/move line down/i)).toBeNull();

        //endregion
      }
    );

  });
});

