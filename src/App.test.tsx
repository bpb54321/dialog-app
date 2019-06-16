import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import Line from "./Line";

// Sample dialog data
import { auMarche } from "./data/au-marche-dialog";

describe('App', () => {

  const app = shallow<App>(<App />);

  it("has a default current line number of 0", () => {
    const app = shallow<App>(<App />);
    expect(app.instance().state.currentLineNumber).toEqual(0);
  });

  it("prints all the lines up to the current line", () => {
    expect(app.find(Line)).toHaveLength(1);

    app.instance().setState({
      currentLineNumber: 1,
    });
    expect(app.find(Line)).toHaveLength(2);

    app.instance().setState({
      currentLineNumber: 2,
    });
    expect(app.find(Line)).toHaveLength(3);

  });


});

