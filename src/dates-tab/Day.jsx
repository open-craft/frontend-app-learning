import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { FormattedDate, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { useModel } from '../model-store';

import { getBadgeListAndColor } from './badgelist';
import { isLearnerAssignment } from './utils';

import './Day.scss';

function Day({
  date, first, intl, items, last,
}) {
  const {
    courseId,
  } = useSelector(state => state.courseware);

  const {
    userTimezone,
  } = useModel('dates', courseId);
  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const { color, badges } = getBadgeListAndColor(date, intl, null, items);

  return (
    <div className="dates-day pb-4">
      {/* Top Line */}
      {!first && <div className="dates-line-top border border-left border-gray-900 bg-gray-900" />}

      {/* Dot */}
      <div className={classNames(color, 'dates-dot border border-gray-900')} />

      {/* Bottom Line */}
      {!last && <div className="dates-line-bottom border border-left border-gray-900 bg-gray-900" />}

      {/* Content */}
      <div className="d-inline-block ml-3 pl-3">
        <div>
          <h5 className="d-inline text-dark-500">
            <FormattedDate
              value={date}
              day="numeric"
              month="short"
              weekday="short"
              year="numeric"
              {...timezoneFormatArgs}
            />
          </h5>
          {badges}
        </div>
        {items.map((item) => {
          const { badges: itemBadges } = getBadgeListAndColor(date, intl, item, items);
          const showLink = item.link && isLearnerAssignment(item);
          const title = showLink ? (<u><a href={item.link} className="text-reset">{item.title}</a></u>) : item.title;
          const available = item.learnerHasAccess && (item.link || !isLearnerAssignment(item));
          const textColor = available ? 'text-dark-500' : 'text-dark-200';
          return (
            <div key={item.title + item.date} className={textColor}>
              <div><span className="font-weight-bold">{title}</span>{itemBadges}</div>
              <div>{item.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Day.propTypes = {
  date: PropTypes.objectOf(Date).isRequired,
  first: PropTypes.bool,
  intl: intlShape.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    dateType: PropTypes.string,
    description: PropTypes.string,
    dueNext: PropTypes.bool,
    learnerHasAccess: PropTypes.bool,
    link: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  last: PropTypes.bool,
};

Day.defaultProps = {
  first: false,
  last: false,
};

export default injectIntl(Day);
