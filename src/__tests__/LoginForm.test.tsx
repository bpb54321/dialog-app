import React from "react";
import {cleanup, render, RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import {LoginForm} from "../components/LoginForm";

describe('LoginPage', () => {

  let wrapper: RenderResult;

  beforeEach(() => {
    act(() => {
      render(
        <LoginForm history={{}}/>
      );
    });
  });

  afterEach(() => {
    cleanup();
  });


  test("When ", function () {

  });
});

