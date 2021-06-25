//@ts-nocheck
import React, { Component } from 'react';
import {View, ViewPropTypes, Text} from 'react-native';

import XDate from 'xdate';
import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import UnitDay from './day/period';
import MultiDotDay from './day/multi-dot';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';

// Fallback when RN version is < 0.44
// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
const viewPropTypes = ViewPropTypes || View.propTypes;

const EmptyArray: any = [];

type Props = {
  theme?: any;
  markedDates?: any;
  style?: any; // TODO: viewPropTypes.style
  current?: any;
  minDate?: any;
  maxDate?: any;
  firstDay?: number;
  markingType?: string;
  hideArrows?: boolean;
  displayLoadingIndicator?: boolean;
  hideExtraDays?: boolean;
  onDayPress?: (...args: any[]) => any;
  onMonthChange?: (...args: any[]) => any;
  onVisibleMonthsChange?: (...args: any[]) => any;
  renderArrow?: (...args: any[]) => any;
  dayComponent?: any;
  monthFormat?: string;
  disableMonthChange?: boolean;
  hideDayNames?: boolean;
  disabledByDefault?: boolean;
};

type State = any;

class Calendar extends Component<Props, State> {
  style: any;

  constructor(props: Props) {
    super(props);
    this.style = styleConstructor(this.props.theme);
    let currentMonth;
    if (props.current) {
      currentMonth = parseDate(props.current);
    } else {
      currentMonth = XDate();
    }
    this.state = {
      currentMonth,
    };

    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.pressDay = this.pressDay.bind(this);
    this.shouldComponentUpdate = shouldComponentUpdate;
  }

  componentWillReceiveProps(nextProps: Props) {
    const current = parseDate(nextProps.current);
    if (
      current &&
      current.toString('yyyy MM') !==
        this.state.currentMonth.toString('yyyy MM')
    ) {
      this.setState({
        currentMonth: current.clone(),
      });
    }
  }

  updateMonth(day: any, doNotTriggerListeners: any) {
    if (
      day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')
    ) {
      return;
    }
    this.setState(
      {
        currentMonth: day.clone(),
      },
      () => {
        if (!doNotTriggerListeners) {
          const currMont = this.state.currentMonth.clone();
          if (this.props.onMonthChange) {
            this.props.onMonthChange(xdateToData(currMont));
          }
          if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange([xdateToData(currMont)]);
          }
        }
      },
    );
  }

  pressDay(date: any) {
    const day = parseDate(date);
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if (
      !(minDate && !dateutils.isGTE(day, minDate)) &&
      !(maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      const shouldUpdateMonth =
        this.props.disableMonthChange === undefined ||
        !this.props.disableMonthChange;
      if (shouldUpdateMonth) {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        this.updateMonth(day);
      }
      if (this.props.onDayPress) {
        this.props.onDayPress(xdateToData(day));
      }
    }
  }

  addMonth(count: any) {
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  }

  renderDay(day: any, id: any) {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';
    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if (
      (minDate && !dateutils.isGTE(day, minDate)) ||
      (maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
      state = 'disabled';
    } else if (dateutils.sameDate(day, XDate())) {
      state = 'today';
    }
    let dayComp;
    if (
      !dateutils.sameMonth(day, this.state.currentMonth) &&
      this.props.hideExtraDays
    ) {
      if (this.props.markingType === 'period') {
        dayComp = <View key={id} style={{flex: 1}} />;
      } else {
        dayComp = <View key={id} style={{width: 32}} />;
      }
    } else {
      const DayComp = this.getDayComponent();
      const date = day.getDate();
      dayComp = (
        <DayComp
          key={id}
          date={xdateToData(day)}
          marking={this.getDateMarking(day)}
          onPress={this.pressDay}
          state={state}
          theme={this.props.theme}>
          {date}
        </DayComp>
      );
    }
    return dayComp;
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
    case 'period':
      return UnitDay;
    case 'multi-dot':
      return MultiDotDay;
    default:
      return Day;
    }
  }

  getDateMarking(day: any) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates =
      this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    }
    return false;
  }

  renderWeekNumber(weekNumber: any) {
    return (
      <View
        key={`week-${weekNumber}`}
        style={{
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>{weekNumber}</Text>
      </View>
    );
  }

  renderWeek(days: any, id: any) {
    const week = [];
    days.forEach((day: any, id2: any) => {
      week.push(this.renderDay(day, id2));
    }, this);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'showWeekNumbers' does not exist on type ... Remove this comment to see the full error message
    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[0].getWeek()));
    }

    return (
      <View key={id} style={this.style.week}>
        {week}
      </View>
    );
  }

  render() {
    const days = dateutils.page(this.state.currentMonth, this.props.firstDay);
    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = parseDate(this.props.current);
    if (current) {
      const lastMonthOfDay = current
        .clone()
        .addMonths(1, true)
        .setDate(1)
        .addDays(-1)
        .toString('yyyy-MM-dd');
      if (
        this.props.displayLoadingIndicator &&
        !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])
      ) {
        indicator = true;
      }
    }
    return (
      <View style={[this.style.container, this.props.style]}>
        <CalendarHeader
          addMonth={this.addMonth}
          firstDay={this.props.firstDay}
          hideArrows={this.props.hideArrows}
          hideDayNames={this.props.hideDayNames}
          month={this.state.currentMonth}
          // @ts-expect-error ts-migrate(2322) FIXME: Property 'monthFormat' does not exist on type 'Int... Remove this comment to see the full error message
          monthFormat={this.props.monthFormat}
          renderArrow={this.props.renderArrow}
          showIndicator={indicator}
          theme={this.props.theme}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'showWeekNumbers' does not exist on type ... Remove this comment to see the full error message
          weekNumbers={this.props.showWeekNumbers}
        />
        {weeks}
      </View>
    );
  }
}

export default Calendar;
