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

describe('DialogListPage', () => {

  let wrapper: RenderResult;
  let mockRemoveDialogFromList = jest.fn();
  let mockDialogs = [] as ShallowDialog[];
  let DialogListWithLoadingSpinner = withLoadingSpinner<DialogListProps>(DialogList, true);

  beforeEach(() => {
    act(() => {
      wrapper = render(
        <DialogListWithLoadingSpinner
          dialogs={mockDialogs}
          match={{}}
          removeDialogFromList={mockRemoveDialogFromList}
        />
      );
    });
  });

  afterEach(() => {
    cleanup();
  });


  test(`When the component is initially mounted
  Then a loading spinner should appear
  When the list of dialogs passed into the component has at least one dialog
  Then the loading spinner should disappear
  And the dialog names should be listed`, async function () {

    wrapper.getByTestId("loading-spinner");

    mockDialogs = [
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
          "languageCode": "fr-FR",
        }
      ];

    act(() => {
      wrapper.rerender(
        <DialogListWithLoadingSpinner
          dialogs={mockDialogs}
          match={{}}
          removeDialogFromList={mockRemoveDialogFromList}
        />
      );
    });

    await waitForElementToBeRemoved(() => wrapper.getByTestId("loading-spinner"));

    wrapper.getByText(/dialog 1/i);
    wrapper.getByText(/dialog 2/i);
    wrapper.getByText(/dialog 3/i);

  });
});

