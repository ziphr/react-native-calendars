import {StyleSheet, Platform} from 'react-native';
import * as defaultStyle from '../../../style';

const STYLESHEET_ID = 'stylesheet.day.basic';

export default function styleConstructor(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    base: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      // marginTop: 4,
      fontSize: appStyle.textDayFontSize,
      fontFamily: appStyle.textDayFontFamily,
      fontWeight: '300',
      color: appStyle.dayTextColor,
      backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    alignedText: {
      marginTop: Platform.OS === 'android' ? 4 : 6,
    },
    selected: {
      backgroundColor: appStyle.selectedDayBackgroundColor,
      borderRadius: 12,
    },
    todayText: {
      color: appStyle.todayTextColor,
    },
    todayBorder: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: appStyle.todayTextColor,
    },
    selectedText: {
      color: appStyle.selectedDayTextColor,
    },
    disabledText: {
      color: appStyle.textDisabledColor,
    },
    dot: {
      width: 5,
      height: 5,
      marginTop: 2,
      marginLeft: 1,
      marginRight: 1,
      borderRadius: 2.5,
      opacity: 0,
    },
    visibleDot: {
      opacity: 1,
      backgroundColor: appStyle.dotColor,
    },
    selectedDot: {
      backgroundColor: appStyle.selectedDotColor,
    },
    // @ts-expect-error ts-migrate(7053) FIXME: Property 'stylesheet.day.basic' does not exist on ... Remove this comment to see the full error message
    ...(theme[STYLESHEET_ID] || {}),
  });
}
