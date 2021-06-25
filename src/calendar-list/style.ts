import {StyleSheet} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar-list.main';

export default function getStyle(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      backgroundColor: appStyle.calendarBackground,
    },
    placeholder: {
      backgroundColor: appStyle.calendarBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderText: {
      fontSize: 30,
      fontWeight: '200',
      color: appStyle.dayTextColor,
    },
    calendar: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    // @ts-expect-error ts-migrate(7053) FIXME: Property 'stylesheet.calendar-list.main' does not ... Remove this comment to see the full error message
    ...(theme[STYLESHEET_ID] || {}),
  });
}
