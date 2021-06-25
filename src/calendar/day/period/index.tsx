import React, {Component} from 'react';
// import _ from 'lodash';
import {TouchableWithoutFeedback, Text, View} from 'react-native';

import * as defaultStyle from '../../../style';
import styleConstructor from './style';

type Props = {
  state?: 'selected' | 'disabled' | 'today' | '';
  theme?: any;
  marking?: any;
  onPress?: (...args: any[]) => any;
  date?: any;
  markingExists?: boolean;
};

class Day extends Component<Props> {
  markingStyle: any;

  style: any;

  theme: any;

  constructor(props: Props) {
    super(props);
    this.theme = {...defaultStyle, ...(props.theme || {})};
    this.style = styleConstructor(props.theme);
    this.markingStyle = this.getDrawingStyle(props.marking || []);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress() {
    // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    this.props.onPress(this.props.date);
  }

  shouldComponentUpdate(nextProps: Props) {
    const newMarkingStyle = this.getDrawingStyle(nextProps.marking);

    if (JSON.stringify(this.markingStyle) !== JSON.stringify(newMarkingStyle)) {
      this.markingStyle = newMarkingStyle;
      return true;
    }

    return ['state', 'children'].reduce((prev, next) => {
      // @ts-expect-error ts-migrate(7053) FIXME: No index signature with a parameter of type 'strin... Remove this comment to see the full error message
      if (prev || nextProps[next] !== this.props[next]) {
        return true;
      }
      return prev;
    }, false);
  }

  getDrawingStyle(marking: any) {
    const defaultStyle = {textStyle: {}};
    if (!marking) {
      return defaultStyle;
    }
    if (this.props.marking.disabled) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'color' does not exist on type '{}'.
      defaultStyle.textStyle.color = this.theme.textDisabledColor;
    } else if (this.props.marking.selected) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'color' does not exist on type '{}'.
      defaultStyle.textStyle.color = this.theme.selectedDayTextColor;
    }
    const resultStyle = [marking].reduce((prev, next) => {
      if (next.quickAction) {
        if (next.first || next.last) {
          prev.containerStyle = this.style.firstQuickAction;
          prev.textStyle = this.style.firstQuickActionText;
          if (next.endSelected && next.first && !next.last) {
            prev.rightFillerStyle = '#c1e4fe';
          } else if (next.endSelected && next.last && !next.first) {
            prev.leftFillerStyle = '#c1e4fe';
          }
        } else if (!next.endSelected) {
          prev.containerStyle = this.style.quickAction;
          prev.textStyle = this.style.quickActionText;
        } else if (next.endSelected) {
          prev.leftFillerStyle = '#c1e4fe';
          prev.rightFillerStyle = '#c1e4fe';
        }
        return prev;
      }

      const {color} = next;
      if (next.status === 'NotAvailable') {
        prev.textStyle = this.style.naText;
      }
      if (next.startingDay) {
        prev.startingDay = {
          color,
        };
      }
      if (next.endingDay) {
        prev.endingDay = {
          color,
        };
      }
      if (!next.startingDay && !next.endingDay) {
        prev.day = {
          color,
        };
      }
      if (next.textColor) {
        prev.textStyle.color = next.textColor;
      }
      return prev;
    }, defaultStyle);
    return resultStyle;
  }

  render() {
    const containerStyle = [this.style.base];
    const textStyle = [this.style.text];
    let leftFillerStyle = {};
    let rightFillerStyle = {};
    let fillerStyle = {};
    let fillers;

    if (this.props.state === 'disabled') {
      textStyle.push(this.style.disabledText);
    } else if (this.props.state === 'today') {
      textStyle.push(this.style.todayText);
    }

    if (this.props.marking) {
      containerStyle.push({
        borderRadius: 17,
      });

      const flags = this.markingStyle;
      if (flags.textStyle) {
        textStyle.push(flags.textStyle);
      }
      if (flags.containerStyle) {
        containerStyle.push(flags.containerStyle);
      }
      if (flags.leftFillerStyle) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'backgroundColor' does not exist on type ... Remove this comment to see the full error message
        leftFillerStyle.backgroundColor = flags.leftFillerStyle;
      }
      if (flags.rightFillerStyle) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'backgroundColor' does not exist on type ... Remove this comment to see the full error message
        rightFillerStyle.backgroundColor = flags.rightFillerStyle;
      }

      if (flags.startingDay && !flags.endingDay) {
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground,
        };
        rightFillerStyle = {
          backgroundColor: flags.startingDay.color,
        };
        containerStyle.push({
          backgroundColor: flags.startingDay.color,
        });
      } else if (flags.endingDay && !flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground,
        };
        leftFillerStyle = {
          backgroundColor: flags.endingDay.color,
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color,
        });
      } else if (flags.day) {
        leftFillerStyle = {backgroundColor: flags.day.color};
        rightFillerStyle = {backgroundColor: flags.day.color};
        // #177 bug
        fillerStyle = {backgroundColor: flags.day.color};
      } else if (flags.endingDay && flags.startingDay) {
        rightFillerStyle = {
          backgroundColor: this.theme.calendarBackground,
        };
        leftFillerStyle = {
          backgroundColor: this.theme.calendarBackground,
        };
        containerStyle.push({
          backgroundColor: flags.endingDay.color,
        });
      }

      fillers = (
        <View style={[this.style.fillers, fillerStyle]}>
          <View style={[this.style.leftFiller, leftFillerStyle]} />
          <View style={[this.style.rightFiller, rightFillerStyle]} />
        </View>
      );
    }

    return (
      <TouchableWithoutFeedback onPress={this.onDayPress}>
        <View style={this.style.wrapper}>
          {fillers}
          <View style={containerStyle}>
            <Text style={textStyle}>{String(this.props.children)}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default Day;
