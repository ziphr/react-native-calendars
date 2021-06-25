import { language } from '@app/screens/drawer/drawer.config';
import I18n from '@app/i18n/i18n';

const XDate = require('xdate');

function sameMonth(a: any, b: any) {
  return (
    a instanceof XDate &&
    b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth()
  );
}

function sameDate(a: any, b: any) {
  return (
    a instanceof XDate &&
    b instanceof XDate &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isGTE(a: any, b: any) {
  return b.diffDays(a) > -1;
}

function isLTE(a: any, b: any) {
  return a.diffDays(b) > -1;
}

function fromTo(a: any, b: any) {
  const days = [];
  let from = +a;
  const to = +b;
  for (; from <= to; from = new XDate(from, true).addDays(1).getTime()) {
    days.push(new XDate(from, true));
  }
  return days;
}

function month(xd: any) {
  const year = xd.getFullYear();
  const month = xd.getMonth();
  const days = new Date(year, month + 1, 0).getDate();

  const firstDay = new XDate(year, month, 1, 0, 0, 0, true);
  const lastDay = new XDate(year, month, days, 0, 0, 0, true);

  return fromTo(firstDay, lastDay);
}

function weekDayNames(firstDayOfWeek = 1) {
  let weekDaysNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  if (I18n.currentLocale() === language.ID) {
    weekDaysNames = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
  }
    

  const dayShift = firstDayOfWeek % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames
      .slice(dayShift)
      .concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function page(xd: any, firstDayOfWeek: any) {
  const days = month(xd);
  let before = [];
  let after = [];

  const fdow = (7 + firstDayOfWeek) % 7 || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  const from = days[0].clone();
  if (from.getDay() !== fdow) {
    from.addDays(-(from.getDay() + 7 - fdow) % 7);
  }

  const to = days[days.length - 1].clone();
  const day = to.getDay();
  if (day !== ldow) {
    to.addDays((ldow + 7 - day) % 7);
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameDate,
  month,
  page,
  fromTo,
  isLTE,
  isGTE,
};
