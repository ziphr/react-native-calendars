import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../style';

const STYLESHEET_ID = 'stylesheet.calendar.main';

export default function getStyle(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      paddingLeft: 5,
      paddingRight: 5,
      height: Platform.OS === 'ios' ? 269 : 271,
      backgroundColor: appStyle.calendarBackground,
    },
    week: {
      marginTop: 3,
      marginBottom: 3,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    // @ts-expect-error ts-migrate(7053) FIXME: Property 'stylesheet.calendar.main' does not exist... Remove this comment to see the full error message
    ...(theme[STYLESHEET_ID] || {}),
  });
}
