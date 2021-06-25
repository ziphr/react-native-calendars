// @ts-expect-error ts-migrate(2306) FIXME: File '/Users/theo/Projects/Upgrade/TypeScript/ZipH... Remove this comment to see the full error message
import {parseDate} from '../interface';

export default function shouldComponentUpdate(nextProps: any, nextState: any) {
  let shouldUpdate = (nextProps.selected || []).reduce(
    (prev: any, next: any, i: any) => {
      // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
      const currentSelected = (this.props.selected || [])[i];
      if (
        !currentSelected ||
        !next ||
        parseDate(currentSelected).getTime() !== parseDate(next).getTime()
      ) {
        return {
          update: true,
          field: 'selected',
        };
      }
      return prev;
    },
    {update: false},
  );

  shouldUpdate = ['markedDates', 'hideExtraDays'].reduce((prev, next) => {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    if (!prev.update && nextProps[next] !== this.props[next]) {
      return {
        update: true,
        field: next,
      };
    }
    return prev;
  }, shouldUpdate);

  shouldUpdate = ['minDate', 'maxDate', 'current'].reduce((prev, next) => {
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    const prevDate = parseDate(this.props[next]);
    const nextDate = parseDate(nextProps[next]);
    if (prev.update) {
      return prev;
    }
    if (prevDate !== nextDate) {
      if (prevDate && nextDate && prevDate.getTime() === nextDate.getTime()) {
        return prev;
      }
      return {
        update: true,
        field: next,
      };
    }
    return prev;
  }, shouldUpdate);

  // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
  if (nextState.currentMonth !== this.state.currentMonth) {
    shouldUpdate = {
      update: true,
      field: 'current',
    };
  }
  // console.log(shouldUpdate.field, shouldUpdate.update);
  return shouldUpdate.update;
}
