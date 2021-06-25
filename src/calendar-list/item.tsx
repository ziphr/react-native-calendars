import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Calendar from '../calendar';
import styleConstructor from './style';

class CalendarListItem extends Component {
  style: any;

  constructor(props: any) {
    super(props);
    this.style = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const r1 = this.props.item;
    const r2 = nextProps.item;
    return (
      r1.toString('yyyy MM') !== r2.toString('yyyy MM') ||
      !!(r2.propbump && r2.propbump !== r1.propbump)
    );
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const row = this.props.item;
    if (row.getTime) {
      return (
        <Calendar
          current={row}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'dayComponent' does not exist on type 'Re... Remove this comment to see the full error message
          dayComponent={this.props.dayComponent}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'disabledByDefault' does not exist on typ... Remove this comment to see the full error message
          disabledByDefault={this.props.disabledByDefault}
          disableMonthChange
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'displayLoadingIndicator' does not exist ... Remove this comment to see the full error message
          displayLoadingIndicator={this.props.displayLoadingIndicator}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'firstDay' does not exist on type 'Readon... Remove this comment to see the full error message
          firstDay={this.props.firstDay}
          hideArrows
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideDayNames' does not exist on type 'Re... Remove this comment to see the full error message
          hideDayNames={this.props.hideDayNames}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'hideExtraDays' does not exist on type 'R... Remove this comment to see the full error message
          hideExtraDays={this.props.hideExtraDays === undefined ? true : this.props.hideExtraDays}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'markedDates' does not exist on type 'Rea... Remove this comment to see the full error message
          markedDates={this.props.markedDates}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'markingType' does not exist on type 'Rea... Remove this comment to see the full error message
          markingType={this.props.markingType}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'maxDate' does not exist on type 'Readonl... Remove this comment to see the full error message
          maxDate={this.props.maxDate}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'minDate' does not exist on type 'Readonl... Remove this comment to see the full error message
          minDate={this.props.minDate}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'monthFormat' does not exist on type 'Rea... Remove this comment to see the full error message
          monthFormat={this.props.monthFormat}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'onDayPress' does not exist on type 'Read... Remove this comment to see the full error message
          onDayPress={this.props.onDayPress}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'calendarHeight' does not exist on type '... Remove this comment to see the full error message
          style={[{height: this.props.calendarHeight}, this.style.calendar]}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'theme' does not exist on type 'Readonly<... Remove this comment to see the full error message
          theme={this.props.theme}
        />
      );
    }
    const text = row.toString();
    return (
      <View
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'calendarHeight' does not exist on type '... Remove this comment to see the full error message
        style={[{height: this.props.calendarHeight}, this.style.placeholder]}>
        <Text style={this.style.placeholderText}>{text}</Text>
      </View>
    );
  }
}

export default CalendarListItem;
