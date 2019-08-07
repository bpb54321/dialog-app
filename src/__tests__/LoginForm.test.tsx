import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitForElementToBeRemoved
} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {LoginForm} from "../components/LoginForm";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";

jest.mock("../utils/fetch-data", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

describe('LoginForm', () => {

  let wrapper: RenderResult;

  beforeEach(() => {
    act(() => {
      wrapper = render(
        <GlobalProvider
          children={<LoginForm history={{}}/>}
        />
      );
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });


  test(`When the login form is submitted
  Then a loading spinner should appear
  When the login form receives a succesful response
  Then the loading spinner should disappear`, async function () {

    (fetchData as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        token: "123",
      });
    });

    act(() => {
      fireEvent.change(wrapper.getByLabelText(/email/i), {
        target: {
          value: "tester@gmail.com",
        }
      });
    });

    act(() => {
      fireEvent.change(wrapper.getByLabelText(/password/i), {
        target: {
          value: "password",
        }
      });
    });

    act(() => {
      fireEvent.click(wrapper.getByText(/submit/i));
    });

    wrapper.getByTestId("loading-spinner");

    await waitForElementToBeRemoved(() => wrapper.getByTestId("loading-spinner"));

  });

  test(`When the login form is submitted with usename and password not found in the database
  And the login form receives a response with an error
  Then the error message should appear in the component`, async function () {

    (fetchData as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error("No such user found"));
    });

    act(() => {
      fireEvent.change(wrapper.getByLabelText(/email/i), {
        target: {
          value: "tester-without-account@gmail.com",
        }
      });
    });

    act(() => {
      fireEvent.change(wrapper.getByLabelText(/password/i), {
        target: {
          value: "password",
        }
      });
    });

    act(() => {
      fireEvent.click(wrapper.getByText(/submit/i));
    });

    await waitForElementToBeRemoved(() => wrapper.getByTestId("loading-spinner"));

    wrapper.getByText(/no such user found/i);

  });
});

