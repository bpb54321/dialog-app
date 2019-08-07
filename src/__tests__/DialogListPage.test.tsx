import React from "react";
import {
  cleanup,
  render,
  RenderResult,
  waitForElementToBeRemoved
} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {withLoadingSpinner} from "../higher-order-components/withLoadingSpinner";
import {DialogList, DialogListProps} from "../components/DialogList";
import {ShallowDialog} from "../types/Dialog";
import DialogListPage from "../pages/DialogListPage";
import {GlobalProvider, GlobalState} from "../contexts/GlobalStateContext";
import Role from "../types/Role";
import fetchData from "../utils/fetch-data";
import {BrowserRouter} from "react-router-dom";

jest.mock("../utils/fetch-data", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('DialogListPage', () => {

  let wrapper: RenderResult;
  let mockRemoveDialogFromList = jest.fn();
  let mockDialogs = [] as ShallowDialog[];
  let DialogListWithLoadingSpinner = withLoadingSpinner<DialogListProps>(DialogList, true);
  let mockContext: GlobalState = {
    apiEndpoint: "",
    chosenRole: {} as Role,
    token: "123",
  };

  beforeEach(() => {

  });

  afterEach(() => {
    cleanup();
  });


  test(`When the DialogListPage is initially mounted
  Then a loading spinner should appear in the place of the DialogList component
  When DialogList page fetches some dialogs
  Then the loading spinner should disappear
  And the dialog names should be listed`, async function () {

    (fetchData as jest.Mock).mockImplementation(() => {
      return Promise.resolve([
        {
          "id": "abc",
          "name": "Dialog 1",
          "languageCode": "fr-FR",
        },
        {
          "id": "def",
          "name": "Dialog 2",
          "languageCode": "fr-FR",
        },
        {
          "id": "ghi",
          "name": "Dialog 3",
          "languageCode": "fr-FR"
        }
      ]);
    });

    await act((async () => {
      wrapper = render(
        <GlobalProvider
          children={
            <BrowserRouter>
              <DialogListPage
                context={mockContext}
                match={{}}
                location={{}}
                history={{}}
              />
            </BrowserRouter>
          }
        />
      );

      wrapper.getByTestId("loading-spinner");

      await waitForElementToBeRemoved(() => wrapper.getByTestId("loading-spinner"));

      wrapper.getByDisplayValue(/dialog 1/i);
      wrapper.getByDisplayValue(/dialog 2/i);
      wrapper.getByDisplayValue(/dialog 3/i);
    }) as (() => void));

  });
});

