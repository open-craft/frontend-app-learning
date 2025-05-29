import { useIntl } from '@edx/frontend-platform/i18n';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { CoursewareSearch, CoursewareSearchToggle } from '../course-home/courseware-search';
import { useCoursewareSearchState } from '../course-home/courseware-search/hooks';
import Tabs from '../generic/tabs/Tabs';

import messages from './messages';

const CourseTabsNavigation = ({ activeTabSlug, className, tabs }) => {
  const { show } = useCoursewareSearchState();
  const intl = useIntl();

  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation', className)}>
      <div className="container-xl">
        <Tabs
          className="nav-underline-tabs"
          aria-label={intl.formatMessage(messages.courseMaterial)}
        >
          <PluginSlot id="course_tab_links_slot">
            {tabs.map(({
              url,
              title,
              slug,
            }) => (
              <a
                key={slug}
                className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
                href={url}
              >
                {title}
              </a>
            ))}
          </PluginSlot>
        </Tabs>
      </div>
      <div className="course-tabs-navigation__search-toggle">
        <CoursewareSearchToggle />
      </div>
      {show && <CoursewareSearch />}
    </div>
  );
};

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default CourseTabsNavigation;
