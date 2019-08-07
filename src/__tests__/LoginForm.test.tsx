import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitForElementToBeRemoved
} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {LoginForm, LoginFormProps} from "../components/LoginForm";
import {GlobalProvider} from "../contexts/GlobalStateContext";

jest.mock("../utils/fetch-data", () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return {
        token: "123",
      };
    }),
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
    jest.clearAllMocks();
    cleanup();
  });


  test(`When the login form is submitted
  Then a loading spinner should appear
  When the login form receives a succesful response
  Then the loading spinner should disappear`, async function () {
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
});

