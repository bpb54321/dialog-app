import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  within
} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";
import {BrowserRouter} from "react-router-dom";
import {DialogEditPage} from "../pages/DialogEditPage";
import {AddNewLineForm} from "../components/AddNewLineForm";
import ListOfLines from "../components/ListOfLines";
import {Dialog} from "../types/Dialog";
import LineData from "../types/LineData";

describe('ListOfLines', () => {

  let wrapper: RenderResult;

  const role1 = {
    id: "123",
    name: "John",
  };
  const role2 = {
    id: "456",
    name: "Jane",
  };

  const line1: LineData = {
    number: 1,
    id: "line-1",
    role: role1,
    text: "This is the text for line 1.",
  };

  const line2: LineData = {
    number: 2,
    id: "line-2",
    role: role2,
    text: "This is the text for line 2.",
  };

  const dialog: Dialog = {
    id: "12345abc",
    name: "Test Dialog",
    languageCode: "en-US",
    roles: [
      role1,
      role2,
    ],
    lines: [
      line1,
      line2,
    ],
  };

  beforeEach(() => {

  });

  afterEach(() => {
    cleanup();
  });

  test(`Given a dialog with roles and lines
      And a ListOfLines where lastLineToDisplay is 1
      Then the first line will be displayed
      And the Next Line button will be displayed inside of the first line component.`, async function () {

    wrapper = render(<ListOfLines dialog={dialog} lastLineToDisplay={1}/>);

    const line1Element = within(wrapper.getAllByTestId("line")[0]);

    line1Element.getByText(line1.text);
    line1Element.getByText(/next line/i);
  });

  test(`Given a dialog with roles and lines
      And a ListOfLines where lastLineToDisplay is 2
      Then Line 1 and Line 2 are displayed
      And the Next Line button is not displayed inside Line 1
      And the Next Line button is displayed inside Line 2.`, async function () {

    wrapper = render(<ListOfLines dialog={dialog} lastLineToDisplay={2}/>);

    const line1Element = within(wrapper.getAllByTestId("line")[0]);

    expect(line1Element.queryByText(line1.text)).not.toBeNull();
    expect(line1Element.queryByText(/next line/i)).toBeNull();

    const line2Element = within(wrapper.getAllByTestId("line")[1]);

    expect(line2Element.queryByText(line2.text)).not.toBeNull();
    expect(line2Element.queryByText(/next line/i)).not.toBeNull();
  });
});

