import React, {FunctionComponent} from "react";
import loadingSpinner from "../css/LoadingSpinner.module.css";

interface Props {

}

export const LoadingSpinner: FunctionComponent<Props> = () => {
  return (
    // TODO: Added screen reader text that broadcasts "Loading..."
    <div className={loadingSpinner.loadingSpinner} data-testid={"loading-spinner"}>
      <div className={loadingSpinner.firstSegment}></div>
      <div className={loadingSpinner.secondSegment}></div>
      <div className={loadingSpinner.thirdSegment}></div>
      <div className={loadingSpinner.segment}></div>
    </div>
  );
};
