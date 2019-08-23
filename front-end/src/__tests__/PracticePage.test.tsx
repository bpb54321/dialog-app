import React from 'react';
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitForElement,
  waitForElementToBeRemoved,
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

    wrapper.getByPlaceholderText(/text of the next line for role 1/i);
  });

  test(`Given a dialog with at least 2 lines
      And the first line is assigned to Role 1
      And the second line is assigned to Role 2
      And Role 2 is the chosen role
      Then the first line should be displayed
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

    await waitForElement(() => wrapper.getByText(/this is the text for line 1/i));

    wrapper.getByPlaceholderText(/text of the next line for role 2/i);
  });

  test(`When Role 1 enters a guess for Line 1
    And he submits the guess
    Then the submitted guess and the correct text for the line should be displayed
    And Role 1 should be presented with a guess input
    When Role 1 enters a guess for Line 3
    And he submits the guess
    Then the submitted guess and the correct text for the line should be displayed
    And Role 1 should be presented with a guess input
    When Role 1 enters a guess for Line 5
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
          },
          {
            "text": "This is the text for line 4.",
            "number": 4,
            "role": {
              "id": "def",
              "name": "Role 2"
            }
          },
          {
            "text": "This is the text for line 5.",
            "number": 5,
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
      return wrapper.getByPlaceholderText(/text of the next line for role 1/i);
    });

    fireEvent.change(guessInput, {
      target: {
        value: "This is my guess for Line 1",
      }
    });

    fireEvent.click(wrapper.getByDisplayValue(/submit guess/i));

    await waitForElement(() => [
      wrapper.getByText(/this is the text for line 1/i),
      wrapper.getByText(/this is my guess for line 1/i),
    ]);

    // Second guess
    fireEvent.change(wrapper.getByPlaceholderText(/text of the next line for role 1/i), {
      target: {
        value: "This is my guess for Line 3"
      }
    });

    fireEvent.click(wrapper.getByDisplayValue(/submit guess/i));

    await waitForElement(() => [
      wrapper.getByText(/this is the text for line 3/i),
      wrapper.getByText(/this is my guess for line 3/i),
    ]);

    // Third guess
    fireEvent.change(wrapper.getByPlaceholderText(/text of the next line for role 1/i), {
      target: {
        value: "This is my guess for Line 5"
      }
    });

    fireEvent.click(wrapper.getByDisplayValue(/submit guess/i));

    await waitForElement(() => [
      wrapper.getByText(/this is the text for line 1/i),
      wrapper.getByText(/this is the text for line 3/i),
      wrapper.getByText(/this is the text for line 5/i),
      wrapper.getByText(/this is my guess for line 1/i),
      wrapper.getByText(/this is my guess for line 3/i),
      wrapper.getByText(/this is my guess for line 5/i),
    ]);

    expect(wrapper.queryByPlaceholderText(/text of the next line for role 1/i)).toBeNull();

  });

  test(`Given Role 1 has two lines in a row at the beginning of the dialog
      And the user has chosen Role 2
      When the dialog practice starts
      Then line 1 should be displayed
      And the user should be presented with the Next Line button`, () => {

  });
});

