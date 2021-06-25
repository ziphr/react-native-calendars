import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.period';

const FILLER_HEIGHT = 34;

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginLeft: -1,
    },
    base: {
      // borderWidth: 1,
      width: 38,
      height: FILLER_HEIGHT,
      alignItems: 'center',
    },
    fillers: {
      position: 'absolute',
      height: FILLER_HEIGHT,
      flexDirection: 'row',
      left: 0,
      right: 0,
    },
    leftFiller: {
      height: FILLER_HEIGHT,
      flex: 1,
    },
    rightFiller: {
      height: FILLER_HEIGHT,
      flex: 1,
    },
    text: {
      marginTop: 7,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: '300',
      color: appStyle.dayTextColor || '#2d4150',
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    todayText: {
      fontWeight: '500',
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'todayTextColor' does not exist on type '... Remove this comment to see the full error message
      color: theme.todayTextColor || appStyle.dayTextColor,
    },
    disabledText: {
      color: appStyle.textDisabledColor,
    },
    quickAction: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: '#c1e4fe',
    },
    quickActionText: {
      marginTop: 6,
      color: appStyle.textColor,
    },
    firstQuickAction: {
      backgroundColor: appStyle.textLinkColor,
    },
    firstQuickActionText: {
      color: 'white',
    },
    naText: {
      color: '#b6c1cd',
    },
    // @ts-expect-error ts-migrate(7053) FIXME: Property 'stylesheet.day.period' does not exist on... Remove this comment to see the full error message
    ...(theme[STYLESHEET_ID] || {}),
  });
}
