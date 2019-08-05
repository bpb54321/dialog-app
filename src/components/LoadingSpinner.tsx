import React, {FunctionComponent} from "react";
import "../css/LoadingSpinner.css";

interface Props {

}

export const LoadingSpinner: FunctionComponent<Props> = () => {
  return (
    // TODO: Added screen reader text that broadcasts "Loading..."
    <div className="loading-spinner" data-testid={"loading-spinner"}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
