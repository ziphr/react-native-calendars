import React, {Component} from 'react';
import {FlatList, ActivityIndicator, View} from 'react-native';
import XDate from 'xdate';
import Reservation from './reservation';

// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/theo/Projects/Upgrade/TypeScript/Z... Remove this comment to see the full error message
import dateutils from '../../dateutils';
import styleConstructor from './style';

type Props = {
  rowHasChanged?: (...args: any[]) => any;
  renderItem?: (...args: any[]) => any;
  renderDay?: (...args: any[]) => any;
  renderEmptyDate?: (...args: any[]) => any;
  onDayChange?: (...args: any[]) => any;
  onScroll?: (...args: any[]) => any;
  reservations?: any;
  selectedDay?: any; // TODO: PropTypes.instanceOf(XDate)
  topDay?: any; // TODO: PropTypes.instanceOf(XDate)
};

type State = any;

class ReactComp extends Component<Props, State> {
  heights: any;

  list: any;

  scrollOver: any;

  selectedDay: any;

  styles: any;

  constructor(props: Props) {
    super(props);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'theme' does not exist on type 'Props'.
    this.styles = styleConstructor(props.theme);
    this.state = {
      reservations: [],
    };
    this.heights = [];
    this.selectedDay = this.props.selectedDay;
    this.scrollOver = true;
  }

  componentWillMount() {
    this.updateDataSource(this.getReservations(this.props).reservations);
  }

  updateDataSource(reservations: any) {
    this.setState({
      reservations,
    });
  }

  updateReservations(props: any) {
    const reservations = this.getReservations(props);
    if (this.list && !dateutils.sameDate(props.selectedDay, this.selectedDay)) {
      let scrollPosition = 0;
      for (let i = 0; i < reservations.scrollPosition; i++) {
        scrollPosition += this.heights[i] || 0;
      }
      this.scrollOver = false;
      this.list.scrollToOffset({offset: scrollPosition, animated: true});
    }
    this.selectedDay = props.selectedDay;
    this.updateDataSource(reservations.reservations);
  }

  componentWillReceiveProps(props: Props) {
    if (!dateutils.sameDate(props.topDay, this.props.topDay)) {
      this.setState(
        {
          reservations: [],
        },
        () => {
          this.updateReservations(props);
        },
      );
    } else {
      this.updateReservations(props);
    }
  }

  onScroll(event: any) {
    const yOffset = event.nativeEvent.contentOffset.y;
    // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
    this.props.onScroll(yOffset);
    let topRowOffset = 0;
    let topRow;
    for (topRow = 0; topRow < this.heights.length; topRow++) {
      if (topRowOffset + this.heights[topRow] / 2 >= yOffset) {
        break;
      }
      topRowOffset += this.heights[topRow];
    }
    const row = this.state.reservations[topRow];
    if (!row) return;
    const {day} = row;
    const sameDate = dateutils.sameDate(day, this.selectedDay);
    if (!sameDate && this.scrollOver) {
      this.selectedDay = day.clone();
      // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      this.props.onDayChange(day.clone());
    }
  }

  onRowLayoutChange(ind: any, event: any) {
    this.heights[ind] = event.nativeEvent.layout.height;
  }

  renderRow({item, index}: any) {
    return (
      <View onLayout={this.onRowLayoutChange.bind(this, index)}>
        <Reservation
          // @ts-expect-error ts-migrate(2322) FIXME: Property 'item' does not exist on type 'IntrinsicA... Remove this comment to see the full error message
          item={item}
          renderDay={this.props.renderDay}
          renderEmptyDate={this.props.renderEmptyDate}
          renderItem={this.props.renderItem}
          rowHasChanged={this.props.rowHasChanged}
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'theme' does not exist on type 'Readonly<... Remove this comment to see the full error message
          theme={this.props.theme}
        />
      </View>
    );
  }

  getReservationsForDay(iterator: any, props: any) {
    const day = iterator.clone();
    const res = props.reservations[day.toString('yyyy-MM-dd')];
    if (res && res.length) {
      return res.map((reservation: any, i: any) => {
        return {
          reservation,
          date: i ? false : day,
          day,
        };
      });
    }
    if (res) {
      return [
        {
          date: iterator.clone(),
          day,
        },
      ];
    } else {
      return false;
    }
  }

  onListTouch() {
    this.scrollOver = true;
  }

  getReservations(props: any) {
    if (!props.reservations || !props.selectedDay) {
      return {reservations: [], scrollPosition: 0};
    }
    let reservations: any = [];
    if (this.state.reservations && this.state.reservations.length) {
      const iterator = this.state.reservations[0].day.clone();
      while (iterator.getTime() < props.selectedDay.getTime()) {
        const res = this.getReservationsForDay(iterator, props);
        if (!res) {
          reservations = [];
          break;
        } else {
          reservations = reservations.concat(res);
        }
        iterator.addDays(1);
      }
    }
    const scrollPosition = reservations.length;
    const iterator = props.selectedDay.clone();
    for (let i = 0; i < 31; i++) {
      const res = this.getReservationsForDay(iterator, props);
      if (res) {
        reservations = reservations.concat(res);
      }
      iterator.addDays(1);
    }

    return {reservations, scrollPosition};
  }

  render() {
    if (
      !this.props.reservations ||
      !this.props.reservations[this.props.selectedDay.toString('yyyy-MM-dd')]
    ) {
      // @ts-expect-error ts-migrate(2551) FIXME: Property 'renderEmptyData' does not exist on type ... Remove this comment to see the full error message
      if (this.props.renderEmptyData) {
        // @ts-expect-error ts-migrate(2551) FIXME: Property 'renderEmptyData' does not exist on type ... Remove this comment to see the full error message
        return this.props.renderEmptyData();
      }
      return <ActivityIndicator style={{marginTop: 80}} />;
    }
    return (
      <FlatList
        ref={(c: any) => (this.list = c)}
        data={this.state.reservations}
        keyExtractor={(item: any, index: any) => `${index}`}
        onMoveShouldSetResponderCapture={() => {
          this.onListTouch();
          return false;
        }}
        onScroll={this.onScroll.bind(this)}
        renderItem={this.renderRow.bind(this)}
        scrollEventThrottle={200}
        showsVerticalScrollIndicator={false}
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Readonly<... Remove this comment to see the full error message
        style={this.props.style}
      />
    );
  }
}

export default ReactComp;
