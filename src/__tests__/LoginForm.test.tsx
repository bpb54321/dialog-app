import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {LoginForm, LoginFormProps} from "../components/LoginForm";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import {withLoadingSpinner} from "../higher-order-components/withLoadingSpinner";

describe('LoginForm', () => {

  let wrapper: RenderResult;

  beforeEach(() => {
    const LoginFormWithLoadingSpinner = withLoadingSpinner<LoginFormProps>(LoginForm);
    act(() => {
      wrapper = render(
        <GlobalProvider
          children={<LoginFormWithLoadingSpinner history={{}}/>}
        />
      );
    });
  });

  afterEach(() => {
    cleanup();
  });


  test(`When the login form is submitted
  Then a loading spinner should appear`, function () {
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

  });
});

