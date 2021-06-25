//@ts-nocheck
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import XDate from 'xdate';
// @ts-expect-error ts-migrate(2306) FIXME: File '/Users/theo/Projects/Upgrade/TypeScript/ZipH... Remove this comment to see the full error message
import {xdateToData} from '../../interface';
// @ts-expect-error ts-migrate(1192) FIXME: Module '"/Users/theo/Projects/Upgrade/TypeScript/Z... Remove this comment to see the full error message
import dateutils from '../../dateutils';
import styleConstructor from './style';

class ReservationListItem extends Component {
  styles: any;

  constructor(props: any) {
    super(props);
    this.styles = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const r1 = this.props.item;
    const r2 = nextProps.item;
    let changed = true;
    if (!r1 && !r2) {
      changed = false;
    } else if (r1 && r2) {
      if (r1.day.getTime() !== r2.day.getTime()) {
        changed = true;
      } else if (!r1.reservation && !r2.reservation) {
        changed = false;
      } else if (r1.reservation && r2.reservation) {
        if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'rowHasChanged' does not exist on type 'R... Remove this comment to see the full error message
          changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
        }
      }
    }
    return changed;
  }

  renderDate(date: any, item: any) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderDay' does not exist on type 'Reado... Remove this comment to see the full error message
    if (this.props.renderDay) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderDay' does not exist on type 'Reado... Remove this comment to see the full error message
      return this.props.renderDay(date ? xdateToData(date) : undefined, item);
    }
    const today = dateutils.sameDate(date, XDate())
      ? this.styles.today
      : undefined;
    if (date) {
      return (
        <View style={this.styles.day}>
          <Text style={[this.styles.dayNum, today]}>{date.getDate()}</Text>
          <Text style={[this.styles.dayText, today]}>
            {XDate.locales[XDate.defaultLocale].dayNamesShort[date.getDay()]}
          </Text>
        </View>
      );
    }
    return <View style={this.styles.day} />;
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'item' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const {reservation, date} = this.props.item;
    let content;
    if (reservation) {
      const firstItem = !!date;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderItem' does not exist on type 'Read... Remove this comment to see the full error message
      content = this.props.renderItem(reservation, firstItem);
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'renderEmptyDate' does not exist on type ... Remove this comment to see the full error message
      content = this.props.renderEmptyDate(date);
    }
    return (
      <View style={this.styles.container}>
        {this.renderDate(date, reservation)}
        <View style={{flex: 1}}>{content}</View>
      </View>
    );
  }
}

export default ReservationListItem;
