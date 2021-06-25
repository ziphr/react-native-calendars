import React, {Component} from 'react';
import {FlatList, Platform} from 'react-native';
import XDate from 'xdate';

// @ts-expect-error ts-migrate(2306) FIXME: File '/Users/theo/Projects/Upgrade/TypeScript/ZipH... Remove this comment to see the full error message
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/theo/Projects/Upgrade/TypeScript/Z... Remove this comment to see the full error message
import dateutils from '../dateutils';
import Calendar from '../calendar';
import CalendarListItem from './item';

const calendarHeight = 360;

/*
(ts-migrate) TODO: Migrate the remaining prop types
...Calendar.propTypes
*/
type Props = {
  pastScrollRange?: number;
  futureScrollRange?: number;
  scrollEnabled?: boolean;
  showScrollIndicator?: boolean;
};

type State = any;
class CalendarList extends Component<Props, State> {
  futureScrollRange: any;

  lastScrollPosition: any;

  listView: any;

  onViewableItemsChangedBound: any;

  pastScrollRange: any;

  renderCalendarBound: any;

  style: any;

  constructor(props: Props) {
    super(props);
    this.pastScrollRange =
      props.pastScrollRange === undefined ? 50 : props.pastScrollRange;
    this.futureScrollRange =
      props.futureScrollRange === undefined ? 50 : props.futureScrollRange;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'theme' does not exist on type 'Props'.
    this.style = styleConstructor(props.theme);
    const rows = [];
    const texts = [];
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'Props'.
    const date = parseDate(props.current) || XDate();
    for (let i = 0; i <= this.pastScrollRange + this.futureScrollRange; i++) {
      const rangeDate = date.clone().addMonths(i - this.pastScrollRange, true);
      const rangeDateStr = rangeDate.toString('MMM yyyy');
      texts.push(rangeDateStr);
      /*
       * This selects range around current shown month [-0, +2] or [-1, +1] month for detail calendar rendering.
       * If `this.pastScrollRange` is `undefined` it's equal to `false` or 0 in next condition.
       */
      if (
        (this.pastScrollRange - 1 <= i && i <= this.pastScrollRange + 1) ||
        (!this.pastScrollRange && i <= this.pastScrollRange + 2)
      ) {
        rows.push(rangeDate);
      } else {
        rows.push(rangeDateStr);
      }
    }

    this.state = {
      rows,
      texts,
      openDate: date,
      initialized: false,
    };
    this.lastScrollPosition = -1000;

    this.onViewableItemsChangedBound = this.onViewableItemsChanged.bind(this);
    this.renderCalendarBound = this.renderCalendar.bind(this);
  }

  scrollToDay(d: any, offset: any, animated: any) {
    const day = parseDate(d);
    const diffMonths = Math.round(
      this.state.openDate
        .clone()
        .setDate(1)
        .diffMonths(day.clone().setDate(1)),
    );
    let scrollAmount =
      calendarHeight * this.pastScrollRange +
      diffMonths * calendarHeight +
      (offset || 0);
    let week = 0;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'firstDay' does not exist on type 'Readon... Remove this comment to see the full error message
    const days = dateutils.page(day, this.props.firstDay);
    for (let i = 0; i < days.length; i++) {
      week = Math.floor(i / 7);
      if (dateutils.sameDate(days[i], day)) {
        scrollAmount += 46 * week;
        break;
      }
    }
    this.listView.scrollToOffset({offset: scrollAmount, animated});
  }

  scrollToMonth(m: any) {
    const month = parseDate(m);
    const scrollTo = month || this.state.openDate;
    let diffMonths = this.state.openDate.diffMonths(scrollTo);
    diffMonths =
      diffMonths < 0 ? Math.ceil(diffMonths) : Math.floor(diffMonths);
    const scrollAmount =
      calendarHeight * this.pastScrollRange + diffMonths * calendarHeight;
    // console.log(month, this.state.openDate);
    // console.log(scrollAmount, diffMonths);
    this.listView.scrollToOffset({offset: scrollAmount, animated: false});
  }

  componentWillReceiveProps(props: Props) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'Readonl... Remove this comment to see the full error message
    const current = parseDate(this.props.current);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'current' does not exist on type 'Props'.
    const nextCurrent = parseDate(props.current);
    if (nextCurrent && current && nextCurrent.getTime() !== current.getTime()) {
      this.scrollToMonth(nextCurrent);
    }

    const rowclone = this.state.rows;
    const newrows = [];
    for (let i = 0; i < rowclone.length; i++) {
      let val = this.state.texts[i];
      if (rowclone[i].getTime) {
        val = rowclone[i].clone();
        val.propbump = rowclone[i].propbump ? rowclone[i].propbump + 1 : 1;
      }
      newrows.push(val);
    }
    this.setState({
      rows: newrows,
    });
  }

  onViewableItemsChanged({viewableItems}: any) {
    function rowIsCloseToViewable(index: any, distance: any) {
      for (let i = 0; i < viewableItems.length; i++) {
        if (Math.abs(index - parseInt(viewableItems[i].index)) <= distance) {
          return true;
        }
      }
      return false;
    }

    const rowclone = this.state.rows;
    const newrows = [];
    const visibleMonths = [];
    for (let i = 0; i < rowclone.length; i++) {
      let val = rowclone[i];
      const rowShouldBeRendered = rowIsCloseToViewable(i, 1);
      if (rowShouldBeRendered && !rowclone[i].getTime) {
        val = this.state.openDate
          .clone()
          .addMonths(i - this.pastScrollRange, true);
      } else if (!rowShouldBeRendered) {
        val = this.state.texts[i];
      }
      newrows.push(val);
      if (rowIsCloseToViewable(i, 0)) {
        visibleMonths.push(xdateToData(val));
      }
    }
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onVisibleMonthsChange' does not exist on... Remove this comment to see the full error message
    if (this.props.onVisibleMonthsChange) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onVisibleMonthsChange' does not exist on... Remove this comment to see the full error message
      this.props.onVisibleMonthsChange(visibleMonths);
    }
    this.setState({
      rows: newrows,
    });
  }

  renderCalendar({item}: any) {
    return (
      <CalendarListItem
        // @ts-expect-error ts-migrate(2322) FIXME: Property 'calendarHeight' does not exist on type '... Remove this comment to see the full error message
        calendarHeight={calendarHeight}
        item={item}
        {...this.props}
      />
    );
  }

  getItemLayout(data: any, index: any) {
    return {length: calendarHeight, offset: calendarHeight * index, index};
  }

  getMonthIndex(month: any) {
    const diffMonths =
      this.state.openDate.diffMonths(month) + this.pastScrollRange;
    return diffMonths;
  }

  render() {
    return (
      <FlatList
        ref={(c: any) => (this.listView = c)}
        // scrollEventThrottle={1000}
        data={this.state.rows}
        getItemLayout={this.getItemLayout}
        // @ts-expect-error ts-migrate(2769) FIXME: Property 'initialListSize' does not exist on type ... Remove this comment to see the full error message
        initialListSize={this.pastScrollRange * this.futureScrollRange + 1}
        // snapToAlignment='start'
        // snapToInterval={calendarHeight}
        initialScrollIndex={
          this.state.openDate ? this.getMonthIndex(this.state.openDate) : false
        }
        keyExtractor={(item: any, index: any) => `${index}`}
        onViewableItemsChanged={this.onViewableItemsChangedBound}
        pageSize={1}
        removeClippedSubviews={Platform.OS !== 'android'}
        renderItem={this.renderCalendarBound}
        scrollEnabled={
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'scrollingEnabled' does not exist on type... Remove this comment to see the full error message
          this.props.scrollingEnabled !== undefined
            ? // @ts-expect-error ts-migrate(2339) FIXME: Property 'scrollingEnabled' does not exist on type... Remove this comment to see the full error message
              this.props.scrollingEnabled
            : true
        }
        showsVerticalScrollIndicator={
          this.props.showScrollIndicator !== undefined
            ? this.props.showScrollIndicator
            : false
        }
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Readonly<... Remove this comment to see the full error message
        style={[this.style.container, this.props.style]}
      />
    );
  }
}

export default CalendarList;
