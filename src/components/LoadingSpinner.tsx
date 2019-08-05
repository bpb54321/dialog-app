import React, {FunctionComponent} from "react";

interface Props {

}

export const LoadingSpinner: FunctionComponent<Props> = () => {
  return (
    <div data-testid={"loading-spinner"}>
      Loading...
    </div>
  );
};
