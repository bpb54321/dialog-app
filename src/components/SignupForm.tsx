import React, {ChangeEvent, FormEvent, FunctionComponent, useContext, useState} from 'react';
import {GlobalStateContext} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";

const signupQuery =
  `
    mutation Signup($email: String!, $password: String!, $name: String!) {
      signup(email: $email, password: $password, name: $name) {
        token,
        user {
          name
        }
      }
    }
  `;

export const SignupForm: FunctionComponent = () => {

  const context = useContext(GlobalStateContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();

    try {
      const queryVariables = {
        name,
        email,
        password,
      };

      const {token} = await fetchData(signupQuery, queryVariables, "signup", context);

      window.sessionStorage.setItem('token', token);

      context.actions.setGlobalState({
        token: token
      });

    } catch (error) {

      setErrorMessage(error.message);

    }
  };

  return (
    <div>
      <form
        className={"auth-form"}
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className={"form-control"}>
          <label htmlFor="name">Name</label>
          <input
            id={"name"}
            type={"text"}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            required
          />
        </div>
        <div className={"form-control"}>
          <label htmlFor="email">Email</label>
          <input
            id={"email"}
            type={"email"}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setEmail(event.target.value);
            }}
            required
          />
        </div>
        <div className={"form-control"}>
          <label htmlFor="password">Password</label>
          <input
            id={"password"}
            type={"password"}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            required
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
};
