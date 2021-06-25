import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';

const STYLESHEET_ID = 'stylesheet.agenda.list';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    dayNum: {
      fontSize: 28,
      fontWeight: '200',
      color: appStyle.agendaDayNumColor,
    },
    dayText: {
      fontSize: 14,
      fontWeight: '300',
      color: appStyle.agendaDayTextColor,
      marginTop: -5,
      backgroundColor: 'rgba(0,0,0,0)',
    },
    day: {
      width: 63,
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: 32,
    },
    today: {
      color: appStyle.agendaTodayColor,
    },
    // @ts-expect-error ts-migrate(7053) FIXME: Property 'stylesheet.agenda.list' does not exist o... Remove this comment to see the full error message
    ...(theme[STYLESHEET_ID] || {}),
  });
}
