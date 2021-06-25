import React, {Component} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

import styleConstructor from './style';

type Props = {
  state?: 'disabled' | 'today' | '';
  theme?: any;
  marking?: any;
  onPress?: (...args: any[]) => any;
  date?: any;
};

class Day extends Component<Props> {
  style: any;

  constructor(props: Props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress() {
    // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    this.props.onPress(this.props.date);
  }

  shouldComponentUpdate(nextProps: Props) {
    const changed = ['state', 'children', 'marking', 'onPress'].reduce(
      // @ts-expect-error ts-migrate(2769) FIXME: Type 'string' is not assignable to type 'boolean'.
      (prev, next) => {
        if (prev) {
          return prev;
        }
        // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
        if (nextProps[next] !== this.props[next]) {
          return next;
        }
        return prev;
      },
      false,
    );
    if (changed === 'marking') {
      let markingChanged = false;
      if (this.props.marking && nextProps.marking) {
        markingChanged = !(
          this.props.marking.marked === nextProps.marking.marked &&
          this.props.marking.selected === nextProps.marking.selected &&
          this.props.marking.dotColor === nextProps.marking.dotColor &&
          this.props.marking.disabled === nextProps.marking.disabled
        );
      } else {
        markingChanged = true;
      }
      // console.log('marking changed', markingChanged);
      return markingChanged;
    }
    // console.log('changed', changed);
    return !!changed;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    const dotStyle = [this.style.dot];

    let marking = this.props.marking || {};
    if (marking && marking.constructor === Array && marking.length) {
      marking = {
        marking: true,
      };
    }
    let dot;
    if (marking.marked) {
      dotStyle.push(this.style.visibleDot);
      if (marking.dotColor) {
        dotStyle.push({backgroundColor: marking.dotColor});
      }
      dot = <View style={dotStyle} />;
    }

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      dotStyle.push(this.style.selectedDot);
      textStyle.push(this.style.selectedText);
    } else if (
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled'
    ) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }
    return (
      <TouchableOpacity
        disabled={
          typeof marking.disabled !== 'undefined'
            ? marking.disabled
            : this.props.state === 'disabled'
        }
        onPress={this.onDayPress}
        style={containerStyle}>
        <Text style={textStyle}>{String(this.props.children)}</Text>
        {dot}
      </TouchableOpacity>
    );
  }
}

export default Day;
