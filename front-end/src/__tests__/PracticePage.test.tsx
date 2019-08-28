import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  wait,
  waitForElement,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import {PracticePage} from "../pages/PracticePage";
import {act} from "react-dom/test-utils";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import Role from "../types/Role";
import fetchData from "../utils/fetch-data";

jest.mock("../utils/fetch-data", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('PracticePage', () => {

  let wrapper: RenderResult;
  const match = {
    params: {
      dialogId: "abc"
    }
  };

  let chosenRole: Role;

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it(
    `should not initially display the first line of the dialog when the chosen role is assigned to the first line`,
    async () => {

      //region Arrange
      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve({
          "name": "Test Dialog",
          "languageCode": "en-US",
          "lines": [
            {
              "text": "This is the text for line 1.",
              "number": 1,
              "role": {
                "id": "abc",
                "name": "Role 1"
              }
            },
          ]
        });
      });

      chosenRole = {
        "id": "abc",
        "name": "Role 1"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));
      //endregion

      //region Assert
      expect(wrapper.queryByText(/this is the text for line 1/i)).toBeNull();
      //endregion
    }
  );

  it(
    `should display the line guess input when the chosen role is assigned to the first line`,
    async () => {

      //region Arrange
      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve({
          "name": "Test Dialog",
          "languageCode": "en-US",
          "lines": [
            {
              "text": "This is the text for line 1.",
              "number": 1,
              "role": {
                "id": "abc",
                "name": "Role 1"
              }
            },
          ]
        });
      });

      chosenRole = {
        "id": "abc",
        "name": "Role 1"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));
      //endregion

      //region Assert
      wrapper.getByTestId("line-guess");
      //endregion
    }
  );

  it(
    `should display the first line of the dialog when the chosen role is assigned to the second line`,
    async () => {

      //region Arrange
      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve({
          "name": "Test Dialog",
          "languageCode": "en-US",
          "lines": [
            {
              "text": "This is the text for line 1.",
              "number": 1,
              "role": {
                "id": "abc",
                "name": "Role 1"
              }
            },
            {
              "text": "This is the text for line 2.",
              "number": 2,
              "role": {
                "id": "def",
                "name": "Role 2"
              }
            },
          ]
        });
      });

      chosenRole = {
        "id": "def",
        "name": "Role 2"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));
      //endregion

      //region Act
      //endregion

      //region Assert
      expect(wrapper.queryByText(/this is the text for line 1/i)).not.toBeNull();
      //endregion

    }
  );

  it(
    `should display a single Next Line button when the chosen role is assigned to the second line`,
    async () => {

      //region Arrange
      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve({
          "name": "Test Dialog",
          "languageCode": "en-US",
          "lines": [
            {
              "text": "This is the text for line 1.",
              "number": 1,
              "role": {
                "id": "abc",
                "name": "Role 1"
              }
            },
            {
              "text": "This is the text for line 2.",
              "number": 2,
              "role": {
                "id": "def",
                "name": "Role 2"
              }
            },
          ]
        });
      });

      chosenRole = {
        "id": "def",
        "name": "Role 2"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));
      //endregion

      //region Act
      //endregion

      //region Assert
      expect(wrapper.queryAllByText(/next line/i)).toHaveLength(1);
      //endregion

    }
  );

  it(
    `should not initially display a line guess input when the chosen role is assigned to the second line`,
    async () => {

      //region Arrange
      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve({
          "name": "Test Dialog",
          "languageCode": "en-US",
          "lines": [
            {
              "text": "This is the text for line 1.",
              "number": 1,
              "role": {
                "id": "abc",
                "name": "Role 1"
              }
            },
            {
              "text": "This is the text for line 2.",
              "number": 2,
              "role": {
                "id": "def",
                "name": "Role 2"
              }
            },
          ]
        });
      });

      chosenRole = {
        "id": "def",
        "name": "Role 2"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));
      //endregion

      //region Act
      //endregion

      //region Assert
      expect(wrapper.queryByTestId("line-guess")).toBeNull();
      //endregion

    }
  );

  it(
    `should display a line guess input when the user clicks the next line button immediately prior to one of his lines`,
    async () => {

      //region Arrange
      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve({
          "name": "Test Dialog",
          "languageCode": "en-US",
          "lines": [
            {
              "text": "This is the text for line 1.",
              "number": 1,
              "role": {
                "id": "abc",
                "name": "Role 1"
              }
            },
            {
              "text": "This is the text for line 2.",
              "number": 2,
              "role": {
                "id": "def",
                "name": "Role 2"
              }
            },
          ]
        });
      });

      chosenRole = {
        "id": "def",
        "name": "Role 2"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));
      //endregion

      //region Act
      act(() => {
        fireEvent.click(wrapper.getByText(/next line/i));
      });
      //endregion

      //region Assert
      await waitForElement(() => wrapper.getByTestId("line-guess"));
      //endregion

    }
  );

  it(
    `should display the submitted guess and the correct line text when the user submits her guess`,
    async () => {
      //region Arrange
      const dialog = {
        "name": "Test Dialog",
        "languageCode": "en-US",
        "lines": [
          {
            "text": "This is the text for line 1.",
            "number": 1,
            "role": {
              "id": "abc",
              "name": "Role 1"
            }
          }
        ]
      };

      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(dialog);
      });

      chosenRole = {
        "id": "abc",
        "name": "Role 1"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      let guessInput = await waitForElement(() => wrapper.getByLabelText(/line guess/i));
      //endregion

      //region Act
      const guess = "Guess for Line 1";
      act(() => {
        fireEvent.change(guessInput, {
          target: {
            value: guess,
          }
        });
      });

      await waitForElement(() => wrapper.getByText(guess));

      act(() => {
        fireEvent.submit(wrapper.getByTestId("line-guess"));
      });
      //endregion

      //region Assert
      let lines: HTMLElement[] = [];

      await wait(() => {
        lines = wrapper.getAllByTestId("line");
        expect(lines).toHaveLength(1);
      });

      const lineWrapper = within(lines[0]);

      lineWrapper.getByText(dialog.lines[0].text);
      lineWrapper.getByText(guess);
      //endregion
    }
  );

  it(
    `should display a single next line button after the guess and correct text are displayed if there are additional lines`,
    async () => {
      //region Arrange
      const dialog = {
        "name": "Test Dialog",
        "languageCode": "en-US",
        "lines": [
          {
            "text": "This is the text for line 1.",
            "number": 1,
            "role": {
              "id": "abc",
              "name": "Role 1"
            }
          },
          {
            "text": "This is the text for line 2.",
            "number": 2,
            "role": {
              "id": "def",
              "name": "Role 2"
            }
          }
        ]
      };

      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(dialog);
      });

      chosenRole = {
        "id": "abc",
        "name": "Role 1"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      let guessInput = await waitForElement(() => wrapper.getByLabelText(/line guess/i));
      //endregion

      //region Act
      const guess = "Guess for Line 1";
      act(() => {
        fireEvent.change(guessInput, {
          target: {
            value: guess,
          }
        });
      });

      await waitForElement(() => wrapper.getByText(guess));

      act(() => {
        fireEvent.submit(wrapper.getByTestId("line-guess"));
      });
      //endregion

      //region Assert
      const nextLineButtons = await waitForElement(() => wrapper.getAllByText(/next line/i));
      expect(nextLineButtons).toHaveLength(1);
      //endregion
    }
  );

  it(
    `should not display a next line button after the dialog has ended`,
    async () => {
      //region Arrange
      const dialog = {
        "name": "Test Dialog",
        "languageCode": "en-US",
        "lines": [
          {
            "text": "This is the text for line 1.",
            "number": 1,
            "role": {
              "id": "abc",
              "name": "Role 1"
            }
          },
          {
            "text": "This is the text for line 2.",
            "number": 2,
            "role": {
              "id": "def",
              "name": "Role 2"
            }
          }
        ]
      };

      (fetchData as jest.Mock).mockImplementationOnce(() => {
        return Promise.resolve(dialog);
      });

      chosenRole = {
        "id": "abc",
        "name": "Role 1"
      };

      act(() => {
        wrapper = render(
          <GlobalProvider
            children={<PracticePage match={match} chosenRole={chosenRole}/>}
          />
        );
      });

      let guessInput = await waitForElement(() => wrapper.getByLabelText(/line guess/i));

      const guess = "Guess for Line 1";
      act(() => {
        fireEvent.change(guessInput, {
          target: {
            value: guess,
          }
        });
      });

      await waitForElement(() => wrapper.getByText(guess));

      act(() => {
        fireEvent.submit(wrapper.getByTestId("line-guess"));
      });
      //endregion

      //region Act
      const nextLineButton = await waitForElement(() => wrapper.getByText(/next line/i));

      fireEvent.click(nextLineButton);

      //endregion

      //region Assert
      await wait(() => {
        expect(wrapper.getAllByTestId("line")).toHaveLength(2);
      });

      expect(wrapper.queryByText(/next line/i)).toBeNull();
      //endregion
    }
  );

  test(`Given a dialog with 4 lines
      And the first two lines are assigned to Role 1
      And the third line is assigned to Role 2
      And the fourth line is assigned to Role 1
      And the user has chosen Role 2
      When the dialog practice starts
      Then line 1 should be displayed
      And the user should be presented with a single Next Line button
      When the user clicks the Next Line Button
      Then line 2 should be displayed
      And the user should be presented with a single Next Line button
      When the user clicks the Next Line Button
      Then the user should be presented with the guess input for line 3
      When the user makes a guess for line 3 and submits the guess
      Then the submitted guess and the correct text for the line should be displayed
      And the user should be presented with a single Next Line button
      When the user clicks the Next Line button
      Then all the lines should be displayed in the dialog
      And neither the Next Line button nor the guess input should be displayed.`, async () => {

    const lines = [
      {
        "text": "This is the text for line 1.",
        "number": 1,
        "role": {
          "id": "abc",
          "name": "Role 1"
        }
      },
      {
        "text": "This is the text for line 2.",
        "number": 2,
        "role": {
          "id": "abc",
          "name": "Role 1"
        }
      },
      {
        "text": "This is the text for line 3.",
        "number": 3,
        "role": {
          "id": "def",
          "name": "Role 2"
        }
      },
      {
        "text": "This is the text for line 4.",
        "number": 4,
        "role": {
          "id": "abc",
          "name": "Role 1"
        }
      },
    ];

    (fetchData as jest.Mock).mockImplementationOnce(() => {
      return Promise.resolve({
        "name": "Test Dialog",
        "languageCode": "en-US",
        "lines": lines,
      });
    });

    chosenRole = {
      "id": "def",
      "name": "Role 2"
    };

    act(() => {
      wrapper = render(
        <GlobalProvider
          children={<PracticePage match={match} chosenRole={chosenRole}/>}
        />
      );
    });

    await waitForElement(() => wrapper.getByText(/this is the text for line 1/i));

    expect(wrapper.queryAllByText(/next line/i).length).toBe(1);

    expect(wrapper.queryByText(/this is the text for line 2/i)).toBeNull();

    act(() => {
      fireEvent.click(wrapper.getByText(/next line/i));
    });

    await waitForElement(() => wrapper.getByText(/this is the text for line 2/i));

    expect(wrapper.queryAllByText(/next line/i).length).toBe(1);

    act(() => {
      fireEvent.click(wrapper.getByText(/next line/i));
    });

    const lineGuessElement = await waitForElement(() => wrapper.getByTestId("line-guess"));
    const lineGuessWrapper = within(lineGuessElement);

    expect(wrapper.queryByText(/next line/i)).toBeNull();

    const guessForLine3 = "Guess for Line 3";
    act(() => {
      fireEvent.change(lineGuessWrapper.getByLabelText(/line guess/i), {
        target: {
          value: guessForLine3,
        }
      });

      fireEvent.click(lineGuessWrapper.getByDisplayValue(/submit guess/i));
    });

    await waitForElement(() => [
      wrapper.getByText(guessForLine3),
      wrapper.getByText(lines[2].text),
    ]);

    act(() => {
      fireEvent.click(wrapper.getByText(/next line/i));
    });

    await waitForElement(() => [
      wrapper.getByText(lines[0].text),
      wrapper.getByText(lines[1].text),
      wrapper.getByText(lines[2].text),
      wrapper.getByText(lines[3].text),
    ]);

    expect(wrapper.queryByText(/next line/i)).toBeNull();
    expect(wrapper.queryByLabelText(/line guess/i)).toBeNull();

  });
});

