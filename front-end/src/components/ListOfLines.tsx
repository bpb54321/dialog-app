import React from 'react';
import LineData from "../types/LineData";
import {Line} from "./Line";
import {Dialog} from "../types/Dialog";

interface Props {
  dialog: Dialog,
  lastLineToDisplay: number;
}

interface State {
}

export default class ListOfLines extends React.Component<Props, State> {

  state = {};

  incrementLine = () => {

  };

  render() {
    return (
      <ul data-testid={"lines"} >
        {this.props.dialog.lines.filter((lineData: LineData) => {
          return lineData.number <= this.props.lastLineToDisplay;
        }).map((lineData: LineData, index, lines) => {
          return (
            <Line
              key={lineData.number}
              text={lineData.text}
              guess={lineData.guess}
              role={lineData.role}
              incrementLine={this.incrementLine}
            />
          );
        })}
      </ul>
    );
  }
}
