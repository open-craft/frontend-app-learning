import React from 'react';
import classNames from 'classnames';
import { useIntl } from '@edx/frontend-platform/i18n';
import { CoursewareSearch, CoursewareSearchToggle } from '../course-home/courseware-search';
import { useCoursewareSearchState } from '../course-home/courseware-search/hooks';

import Tabs from '../generic/tabs/Tabs';
import messages from './messages';

export interface CourseTabsNavigationProps {
  activeTabSlug?: string;
  tabs: Array<{
    title: string;
    slug: string;
    url: string;
  }>;
}

const CourseTabsNavigation = ({
  activeTabSlug = undefined,
  tabs,
}:CourseTabsNavigationProps) => {
  const intl = useIntl();
  const { show } = useCoursewareSearchState();

  return (
    <div id="courseTabsNavigation" className="mb-3 course-tabs-navigation">
      <div className="container-xl">
        <div className="nav-bar">
          <div className="nav-menu">
            <Tabs
              className="nav-underline-tabs"
              aria-label={intl.formatMessage(messages.courseMaterial)}
            >
              {tabs.map(({ url, title, slug }) => (
                <a
                  key={slug}
                  className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
                  href={url}
                >
                  {title}
                </a>
              ))}
            </Tabs>
          </div>
          <div className="search-toggle">
            <CoursewareSearchToggle />
          </div>
        </div>
      </div>
      {show && <CoursewareSearch />}
    </div>
  );
};

export default CourseTabsNavigation;
