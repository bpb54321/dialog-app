import React from "react";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {LoginForm} from "../components/LoginForm";
import {GlobalProvider} from "../contexts/GlobalStateContext";

describe('LoginPage', () => {

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

