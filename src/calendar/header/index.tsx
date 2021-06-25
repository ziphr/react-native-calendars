import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import XDate from 'xdate';
import styleConstructor from './style';
// @ts-expect-error ts-migrate(2459) FIXME: Module '"../../dateutils"' declares 'weekDayNames'... Remove this comment to see the full error message
import {weekDayNames} from '../../dateutils';

type Props = {
  theme?: any;
  hideArrows?: boolean;
  month?: any; // TODO: PropTypes.instanceOf(XDate)
  addMonth?: (...args: any[]) => any;
  showIndicator?: boolean;
  firstDay?: number;
  renderArrow?: (...args: any[]) => any;
  hideDayNames?: boolean;
  weekNumbers?: boolean;
};

class CalendarHeader extends Component<Props> {
  style: any;

  constructor(props: Props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
  }

  addMonth() {
    // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    this.props.addMonth(1);
  }

  substractMonth() {
    // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps: Props) {
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    return false;
  }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    const weekDaysNames = weekDayNames(this.props.firstDay);
    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.substractMonth}
          style={this.style.arrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('left')
          ) : (
            <Image
              source={require('../img/previous.png')}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
      rightArrow = (
        <TouchableOpacity onPress={this.addMonth} style={this.style.arrow}>
          {this.props.renderArrow ? (
            this.props.renderArrow('right')
          ) : (
            <Image
              source={require('../img/next.png')}
              style={this.style.arrowImage}
            />
          )}
        </TouchableOpacity>
      );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator />;
    }
    return (
      <View>
        <View style={this.style.header}>
          {leftArrow}
          <View style={{flexDirection: 'row'}}>
            <Text style={this.style.monthText}>
              {this.props.month.toString(
                // @ts-expect-error ts-migrate(2339) FIXME: Property 'monthFormat' does not exist on type 'Rea... Remove this comment to see the full error message
                this.props.monthFormat ? this.props.monthFormat : 'MMMM yyyy',
              )}
            </Text>
            {indicator}
          </View>
          {rightArrow}
        </View>
        {!this.props.hideDayNames && (
          <View style={this.style.week}>
            {this.props.weekNumbers && (
              <Text style={this.style.dayHeader}></Text>
            )}
            {weekDaysNames.map((day: any, idx: any) => (
              <Text key={idx} numberOfLines={1} style={this.style.dayHeader}>
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }
}

export default CalendarHeader;
