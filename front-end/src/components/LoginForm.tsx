import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useGlobalDispatch, useGlobalState} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";
import {WithLoadingSpinnerProps} from "../higher-order-components/withLoadingSpinner";
import {LoadingSpinner} from "./LoadingSpinner";

export interface LoginFormProps {
  history: any;
}

const loginQuery =
  `
    mutation LoginQuery($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
    }
  `;

export const LoginForm: React.FunctionComponent<LoginFormProps & Partial<WithLoadingSpinnerProps>> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const globalState = useGlobalState();
  const globalDispatch = useGlobalDispatch();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const queryVariables = {
        email,
        password,
      };

      const {token} = await fetchData(loginQuery, queryVariables, "login", globalState);

      setIsLoading(false);

      window.sessionStorage.setItem('token', token);

      globalDispatch({
        ...globalState,
        token: token,
      });

    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    switch (event.target.id) {
      case "email":
        setEmail(event.target.value);
        break;
      case "password":
        setPassword(event.target.value);
        break;
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  } else {
    return (
      <div>
        <form
          className={"auth-form"}
          onSubmit={handleSubmit}
        >
          <div className={"form-control"}>
            <label htmlFor="email">Email</label>
            <input
              id={"email"}
              type={"email"}
              onChange={handleInputChange}
            />
          </div>
          <div className={"form-control"}>
            <label htmlFor="password">Password</label>
            <input
              id={"password"}
              type={"password"}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type={"submit"}>Submit</button>
          </div>
          {
            errorMessage
              ?
              <p>{errorMessage}</p>
              :
              null
          }
        </form>
      </div>
    );
  }
};
