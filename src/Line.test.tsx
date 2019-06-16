import React from 'react';
import { shallow } from 'enzyme';
import Line from "./Line";

describe('Line', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Line text={""} />);
  });

  it('should render the text passed to it', function () {
    const text = "Qu'est-ce que tu as envie de manger demain midi?";
    const wrapper = shallow(<Line
        text={text}
    />);
    expect(wrapper.contains(<p>{text}</p>)).toEqual(true);
  });
});

