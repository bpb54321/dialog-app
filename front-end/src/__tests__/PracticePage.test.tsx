import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
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

  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  test(`Given a dialog with at least 1 line
      And the first line is assigned to Role 1
      And Role 1 is the chosen role
      Then no lines should be printed out
      And the user should be presented with the line guess input`, async function () {

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

    expect(wrapper.queryByText(/this is the text for line 1/i)).toBeNull();

    wrapper.getByTestId("line-guess");
  });

  test(`Given a dialog with at least 2 lines
      And the first line is assigned to Role 1
      And the second line is assigned to Role 2
      And Role 2 is the chosen role
      Then the first line should be displayed
      And the user should be presented with the Next Line button
      And the line guess input should not be displayed
      When the user clicks on the Next Line button
      Then the user should be presented with the line guess input`, async function () {

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

    expect(wrapper.queryByText(/this is the text for line 1/i)).not.toBeNull();

    expect(wrapper.queryAllByText(/next line/i)).toHaveLength(1);

    expect(wrapper.queryByTestId("line-guess")).toBeNull();

    act(() => {
      fireEvent.click(wrapper.getByText(/next line/i));
    });

    await waitForElement(() => wrapper.getByTestId("line-guess"));
  });

  test(`Given a dialog 3 lines long where Role 1 and Role 2 alternate lines
      And Role 1 is the chosen role
      When Role 1 enters a guess for Line 1
      And he submits the guess
      Then the submitted guess and the correct text for the line should be displayed
      When Role 1 enters a guess for Line 3
      And he submits the guess
      Then all the line guesses and correct answers should be displayed
      And there should be no guess input on the page`, async function () {


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
          {
            "text": "This is the text for line 3.",
            "number": 3,
            "role": {
              "id": "abc",
              "name": "Role 1"
            }
          }
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

    let guessInput = await waitForElement(() => {
      return wrapper.getByLabelText(/line guess/i);
    });

    act(() => {
      fireEvent.change(guessInput, {
        target: {
          value: "Guess for Line 1",
        }
      });
    });

    act(() => {
      fireEvent.submit(wrapper.getByTestId("line-guess"));
    });

    await waitForElement(() => [
      wrapper.getByText(/this is the text for line 1/i),
      wrapper.getByText(/guess for line 1/i),
    ]);

    // Assert that line 2, assigned to Role 2, is displayed
    expect(wrapper.queryByText(/this is the text for line 2/i)).not.toBeNull();

    // Click the Next Line button
    act(() => {
      fireEvent.click(wrapper.getByText(/next line/i));
    });

    // Assert Line Guess is displayed again
    guessInput = await waitForElement(() => {
      return wrapper.getByLabelText(/line guess/i);
    });

    // Second guess
    fireEvent.change(guessInput, {
      target: {
        value: "Guess for Line 3"
      }
    });

    act(() => {
      fireEvent.submit(wrapper.getByTestId("line-guess"));
    });

    // Assert all lines are now displayed
    await waitForElement(() => [
      wrapper.getByText(/this is the text for line 3/i),
      wrapper.getByText(/guess for line 3/i),
    ]);
    
    // Assert that next line button and line guess are not displayed
    expect(wrapper.queryByText(/next line/i)).toBeNull();
    expect(wrapper.queryByTestId("line-guess")).toBeNull();

  });

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

