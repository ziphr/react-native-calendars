//@ts-nocheck
import React, {Component} from 'react';
import {Text, View, Dimensions, Animated, ViewPropTypes} from 'react-native';
import XDate from 'xdate';

// @ts-expect-error ts-migrate(2306) FIXME: File '/Users/theo/Projects/Upgrade/TypeScript/ZipH... Remove this comment to see the full error message
import {parseDate, xdateToData} from '../interface';
// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/theo/Projects/Upgrade/TypeScript/Z... Remove this comment to see the full error message
import dateutils from '../dateutils';
import CalendarList from '../calendar-list';
import ReservationsList from './reservation-list';
import styleConstructor from './style';
import {VelocityTracker} from '../input';

const HEADER_HEIGHT = 104;
const KNOB_HEIGHT = 24;

// Fallback when RN version is < 0.44
// @ts-expect-error ts-migrate(2339) FIXME: Property 'propTypes' does not exist on type 'typeo... Remove this comment to see the full error message
const viewPropTypes = ViewPropTypes || View.propTypes;

type Props = {
  theme?: any;
  style?: any; // TODO: viewPropTypes.style
  items?: any;
  loadItemsForMonth?: (...args: any[]) => any;
  onCalendarToggled?: (...args: any[]) => any;
  onDayPress?: (...args: any[]) => any;
  onDaychange?: (...args: any[]) => any;
  renderItem?: (...args: any[]) => any;
  renderDay?: (...args: any[]) => any;
  renderKnob?: (...args: any[]) => any;
  renderEmptyDay?: (...args: any[]) => any;
  renderEmptyData?: (...args: any[]) => any;
  rowHasChanged?: (...args: any[]) => any;
  pastScrollRange?: number;
  futureScrollRange?: number;
  selected?: any;
  minDate?: any;
  maxDate?: any;
  markedDates?: any;
  markingType?: string;
  hideKnob?: boolean;
  monthFormat?: string;
};

type State = any;

export default class AgendaView extends Component<Props, State> {
  _isMounted: any;

  calendar: any;

  currentMonth: any;

  headerState: any;

  knob: any;

  knobTracker: any;

  list: any;

  scrollPad: any;

  scrollTimeout: any;

  styles: any;

  viewHeight: any;

  viewWidth: any;

  constructor(props: Props) {
    super(props);
    this.styles = styleConstructor(props.theme);
    const windowSize = Dimensions.get('window');
    this.viewHeight = windowSize.height;
    this.viewWidth = windowSize.width;
    this.scrollTimeout = undefined;
    this.headerState = 'idle';
    this.state = {
      scrollY: new Animated.Value(0),
      calendarIsReady: false,
      calendarScrollable: false,
      firstResevationLoad: false,
      selectedDay: parseDate(this.props.selected) || XDate(true),
      topDay: parseDate(this.props.selected) || XDate(true),
    };
    this.currentMonth = this.state.selectedDay.clone();
    this.onLayout = this.onLayout.bind(this);
    this.onScrollPadLayout = this.onScrollPadLayout.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onStartDrag = this.onStartDrag.bind(this);
    this.onSnapAfterDrag = this.onSnapAfterDrag.bind(this);
    this.generateMarkings = this.generateMarkings.bind(this);
    this.knobTracker = new VelocityTracker();
    this.state.scrollY.addListener(({value}: any) =>
      this.knobTracker.add(value),
    );
  }

  calendarOffset() {
    return 90 - this.viewHeight / 2;
  }

  initialScrollPadPosition() {
    return Math.max(0, this.viewHeight - HEADER_HEIGHT);
  }

  setScrollPadPosition(y: any, animated: any) {
    this.scrollPad._component.scrollTo({x: 0, y, animated});
  }

  onScrollPadLayout() {
    // When user touches knob, the actual component that receives touch events is a ScrollView.
    // It needs to be scrolled to the bottom, so that when user moves finger downwards,
    // scroll position actually changes (it would stay at 0, when scrolled to the top).
    this.setScrollPadPosition(this.initialScrollPadPosition(), false);
    // delay rendering calendar in full height because otherwise it still flickers sometimes
    setTimeout(() => this.setState({calendarIsReady: true}), 0);
  }

  onLayout(event: any) {
    this.viewHeight = event.nativeEvent.layout.height;
    this.viewWidth = event.nativeEvent.layout.width;
    this.calendar.scrollToDay(
      this.state.selectedDay.clone(),
      this.calendarOffset(),
      false,
    );
    this.forceUpdate();
  }

  onTouchStart() {
    this.headerState = 'touched';
    if (this.knob) {
      this.knob.setNativeProps({style: {opacity: 0.5}});
    }
  }

  onTouchEnd() {
    if (this.knob) {
      this.knob.setNativeProps({style: {opacity: 1}});
    }

    if (this.headerState === 'touched') {
      this.setScrollPadPosition(0, true);
      this.enableCalendarScrolling();
    }
    this.headerState = 'idle';
  }

  onStartDrag() {
    this.headerState = 'dragged';
    this.knobTracker.reset();
  }

  onSnapAfterDrag(e: any) {
    // on Android onTouchEnd is not called if dragging was started
    this.onTouchEnd();
    const currentY = e.nativeEvent.contentOffset.y;
    this.knobTracker.add(currentY);
    const projectedY =
        currentY + this.knobTracker.estimateSpeed() * 250 /* ms */;
    const maxY = this.initialScrollPadPosition();
    const snapY = projectedY > maxY / 2 ? maxY : 0;
    this.setScrollPadPosition(snapY, true);
    if (snapY === 0) {
      this.enableCalendarScrolling();
    }
  }

  onVisibleMonthsChange(months: any) {
    if (this.props.items && !this.state.firstResevationLoad) {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        if (this.props.loadItemsForMonth && this._isMounted) {
          this.props.loadItemsForMonth(months[0]);
        }
      }, 200);
    }
  }

  loadReservations(props: any) {
    if (
      (!props.items || !Object.keys(props.items).length) &&
      !this.state.firstResevationLoad
    ) {
      this.setState(
        {
          firstResevationLoad: true,
        },
        () => {
          if (this.props.loadItemsForMonth) {
            this.props.loadItemsForMonth(xdateToData(this.state.selectedDay));
          }
        },
      );
    }
  }

  componentWillMount() {
    this._isMounted = true;
    this.loadReservations(this.props);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillReceiveProps(props: Props) {
    if (props.items) {
      this.setState({
        firstResevationLoad: false,
      });
    } else {
      this.loadReservations(props);
    }
  }

  enableCalendarScrolling() {
    this.setState({
      calendarScrollable: true,
    });
    if (this.props.onCalendarToggled) {
      this.props.onCalendarToggled(true);
    }
    // Enlarge calendarOffset here as a workaround on iOS to force repaint.
    // Otherwise the month after current one or before current one remains invisible.
    // The problem is caused by overflow: 'hidden' style, which we need for dragging
    // to be performant.
    // Another working solution for this bug would be to set removeClippedSubviews={false}
    // in CalendarList listView, but that might impact performance when scrolling
    // month list in expanded CalendarList.
    // Further info https://github.com/facebook/react-native/issues/1831
    this.calendar.scrollToDay(
      this.state.selectedDay,
      this.calendarOffset() + 1,
      true,
    );
  }

  _chooseDayFromCalendar(d: any) {
    this.chooseDay(d, !this.state.calendarScrollable);
  }

  chooseDay(d: any, optimisticScroll: any) {
    const day = parseDate(d);
    this.setState({
      calendarScrollable: false,
      selectedDay: day.clone(),
    });
    if (this.props.onCalendarToggled) {
      this.props.onCalendarToggled(false);
    }
    if (!optimisticScroll) {
      this.setState({
        topDay: day.clone(),
      });
    }
    this.setScrollPadPosition(this.initialScrollPadPosition(), true);
    this.calendar.scrollToDay(day, this.calendarOffset(), true);
    if (this.props.loadItemsForMonth) {
      this.props.loadItemsForMonth(xdateToData(day));
    }
    if (this.props.onDayPress) {
      this.props.onDayPress(xdateToData(day));
    }
  }

  renderReservations() {
    return (
      <ReservationsList
        ref={(c: any) => (this.list = c)}
        onDayChange={this.onDayChange.bind(this)}
        onScroll={() => {}}
        renderDay={this.props.renderDay}
        renderEmptyData={this.props.renderEmptyData}
        // @ts-expect-error ts-migrate(2551) FIXME: Property 'renderEmptyDate' does not exist on type ... Remove this comment to see the full error message
        renderEmptyDate={this.props.renderEmptyDate}
        renderItem={this.props.renderItem}
        reservations={this.props.items}
        rowHasChanged={this.props.rowHasChanged}
        selectedDay={this.state.selectedDay}
        theme={this.props.theme}
        topDay={this.state.topDay}
      />
    );
  }

  onDayChange(day: any) {
    const newDate = parseDate(day);
    const withAnimation = dateutils.sameMonth(newDate, this.state.selectedDay);
    this.calendar.scrollToDay(day, this.calendarOffset(), withAnimation);
    this.setState({
      selectedDay: parseDate(day),
    });

    // @ts-expect-error ts-migrate(2551) FIXME: Property 'onDayChange' does not exist on type 'Rea... Remove this comment to see the full error message
    if (this.props.onDayChange) {
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'onDayChange' does not exist on type 'Rea... Remove this comment to see the full error message
      this.props.onDayChange(xdateToData(newDate));
    }
  }

  generateMarkings() {
    let markings = this.props.markedDates;
    if (!markings) {
      markings = {};
      Object.keys(this.props.items || {}).forEach(key => {
        if (this.props.items[key] && this.props.items[key].length) {
          markings[key] = {marked: true};
        }
      });
    }
    const key = this.state.selectedDay.toString('yyyy-MM-dd');
    return {
      ...markings,
      [key]: {...(markings[key] || {}), ...{selected: true}},
    };
  }

  render() {
    const agendaHeight = Math.max(0, this.viewHeight - HEADER_HEIGHT);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'firstDay' does not exist on type 'Readon... Remove this comment to see the full error message
    const weekDaysNames = dateutils.weekDayNames(this.props.firstDay);
    const weekdaysStyle = [
      this.styles.weekdays,
      {
        opacity: this.state.scrollY.interpolate({
          inputRange: [agendaHeight - HEADER_HEIGHT, agendaHeight],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            translateY: this.state.scrollY.interpolate({
              inputRange: [
                Math.max(0, agendaHeight - HEADER_HEIGHT),
                agendaHeight,
              ],
              outputRange: [-HEADER_HEIGHT, 0],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    ];

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [agendaHeight, 0],
      extrapolate: 'clamp',
    });

    const contentTranslate = this.state.scrollY.interpolate({
      inputRange: [0, agendaHeight],
      outputRange: [0, agendaHeight / 2],
      extrapolate: 'clamp',
    });

    const headerStyle = [
      this.styles.header,
      {bottom: agendaHeight, transform: [{translateY: headerTranslate}]},
    ];

    if (!this.state.calendarIsReady) {
      // limit header height until everything is setup for calendar dragging
      headerStyle.push({height: 0});
      // fill header with appStyle.calendarBackground background to reduce flickering
      weekdaysStyle.push({height: HEADER_HEIGHT});
    }

    const shouldAllowDragging =
      !this.props.hideKnob && !this.state.calendarScrollable;
    const scrollPadPosition =
      (shouldAllowDragging ? HEADER_HEIGHT : 0) - KNOB_HEIGHT;

    const scrollPadStyle = {
      position: 'absolute',
      width: 80,
      height: KNOB_HEIGHT,
      top: scrollPadPosition,
      left: (this.viewWidth - 80) / 2,
    };

    let knob = <View style={this.styles.knobContainer} />;

    if (!this.props.hideKnob) {
      const knobView = this.props.renderKnob ? (
        this.props.renderKnob()
      ) : (
        <View style={this.styles.knob} />
      );
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'Element'.
      knob = this.state.calendarScrollable ? null : (
        <View style={this.styles.knobContainer}>
          <View ref={(c: any) => (this.knob = c)}>{knobView}</View>
        </View>
      );
    }

    return (
      <View
        onLayout={this.onLayout}
        style={[this.props.style, {flex: 1, overflow: 'hidden'}]}>
        <View style={this.styles.reservations}>
          {this.renderReservations()}
        </View>
        <Animated.View style={headerStyle}>
          <Animated.View
            style={{flex: 1, transform: [{translateY: contentTranslate}]}}>
            <CalendarList
              ref={(c: any) => (this.calendar = c)}
              // @ts-expect-error ts-migrate(2322) FIXME: Property 'current' does not exist on type 'Intrins... Remove this comment to see the full error message
              current={this.currentMonth}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'dayComponent' does not exist on type 'Re... Remove this comment to see the full error message
              dayComponent={this.props.dayComponent}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'firstDay' does not exist on type 'Readon... Remove this comment to see the full error message
              firstDay={this.props.firstDay}
              futureScrollRange={this.props.futureScrollRange}
              hideExtraDays={this.state.calendarScrollable}
              markedDates={this.generateMarkings()}
              markingType={this.props.markingType}
              maxDate={this.props.maxDate}
              minDate={this.props.minDate}
              monthFormat={this.props.monthFormat}
              onDayPress={this._chooseDayFromCalendar.bind(this)}
              onVisibleMonthsChange={this.onVisibleMonthsChange.bind(this)}
              pastScrollRange={this.props.pastScrollRange}
              scrollingEnabled={this.state.calendarScrollable}
              theme={this.props.theme}
            />
          </Animated.View>
          {knob}
        </Animated.View>
        <Animated.View style={weekdaysStyle}>
          {weekDaysNames.map((day: any) => (
            <Text key={day} style={this.styles.weekday} numberOfLines={1}>
              {day}
            </Text>
          ))}
        </Animated.View>
        <Animated.ScrollView
          ref={(c: any) => (this.scrollPad = c)}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
            {useNativeDriver: true},
          )}
          onScrollBeginDrag={this.onStartDrag}
          onScrollEndDrag={this.onSnapAfterDrag}
          onTouchEnd={this.onTouchEnd}
          onTouchStart={this.onTouchStart}
          overScrollMode="never"
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type '"absolute... Remove this comment to see the full error message
          style={scrollPadStyle}>
          <View
            style={{height: agendaHeight + KNOB_HEIGHT}}
            onLayout={this.onScrollPadLayout}
          />
        </Animated.ScrollView>
      </View>
    );
  }
}
