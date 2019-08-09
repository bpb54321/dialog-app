import React from "react";
import {
  cleanup,
  render,
  RenderResult,
  waitForElementToBeRemoved
} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";
import {BrowserRouter} from "react-router-dom";
import {DialogEditPage} from "../pages/DialogEditPage";

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

    (fetchData as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        id: "abc",
        name: "Test Dialog",
        languageCode: "en-US",
        roles: [
          {
            id: "123",
            name: "John",
          },
          {
            id: "456",
            name: "Jane",
          },
        ],
        lines: [],
      });
    });

    await act((async () => {
      wrapper = render(
        <GlobalProvider
          children={
            <BrowserRouter>
              <DialogEditPage
                match={{
                  params: {
                    dialogId: "xyz"
                  }
                }}
                location={{}}
                history={{}}
              />
            </BrowserRouter>
          }
        />
      );

    }) as (() => void));

  });
});

