import React, {useState, Dispatch, SetStateAction, FunctionComponent} from "react";
import {LoadingSpinner} from "../components/LoadingSpinner";

export interface WithLoadingSpinnerProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

/**
 * Will show a loading spinner in place of the component when the component is loading.
 * P is the props interface of the wrapped component.
 * @param Component The component to wrap.
 */
export function withLoadingSpinner<P>(Component: React.ComponentType<P>) {

  const WrappedComponent: FunctionComponent<P> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    debugger;

    if (isLoading) {
      return (
        <LoadingSpinner/>
      );
    } else {
      return (
        <Component {...props} setIsLoading={setIsLoading}/>
      );
    }
  };

  return WrappedComponent;
}
