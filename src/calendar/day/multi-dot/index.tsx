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
          this.props.marking.marking === nextProps.marking.marking &&
          this.props.marking.selected === nextProps.marking.selected &&
          this.props.marking.disabled === nextProps.marking.disabled &&
          this.props.marking.dots === nextProps.marking.dots
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

  renderDots(marking: any) {
    const baseDotStyle = [this.style.dot, this.style.visibleDot];
    if (
      marking.dots &&
      Array.isArray(marking.dots) &&
      marking.dots.length > 0
    ) {
      // Filter out dots so that we we process only those items which have key and color property
      const validDots = marking.dots.filter((d: any) => d && d.key && d.color);
      return validDots.map((dot: any) => {
        return (
          <View
            key={dot.key}
            style={[
              baseDotStyle,
              {
                backgroundColor:
                  marking.selected && dot.selectedDotColor
                    ? dot.selectedDotColor
                    : dot.color,
              },
            ]}
          />
        );
      });
    }
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];

    const marking = this.props.marking || {};
    const dot = this.renderDots(marking);

    if (marking.selected) {
      containerStyle.push(this.style.selected);
      textStyle.push(this.style.selectedText);
    } else if (
      typeof marking.disabled !== 'undefined'
        ? marking.disabled
        : this.props.state === 'disabled'
    ) {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
      containerStyle.push(this.style.todayBorder);
    }
    return (
      <TouchableOpacity
        onPress={this.onDayPress}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 33,
          // backgroundColor: 'red',
        }}>
        <View style={containerStyle}>
          <Text style={textStyle}>{String(this.props.children)}</Text>
        </View>
        <View style={{height: 5, flexDirection: 'row', alignItems: 'center'}}>
          {dot}
        </View>
      </TouchableOpacity>
    );
  }
}

export default Day;
