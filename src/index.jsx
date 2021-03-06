import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
  mergeConfig,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';

import { messages as headerMessages } from '@edx/frontend-component-header';
import Footer, { messages as footerMessages } from '@edx/frontend-component-footer';

import appMessages from './i18n';
import { UserMessagesProvider } from './user-messages';

import './index.scss';
import './assets/favicon.ico';
import CourseHome from './course-home';
import CoursewareContainer from './courseware';
import CoursewareRedirect from './CoursewareRedirect';
import DatesTab from './dates-tab';
import { TabContainer } from './tab-page';

import store from './store';
import { fetchCourse, fetchDatesTab } from './data';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider store={store}>
      <UserMessagesProvider>
        <Switch>
          <Route path="/redirect" component={CoursewareRedirect} />
          <Route path="/course/:courseId/home">
            <TabContainer tab="courseware" fetch={fetchCourse}>
              <CourseHome />
            </TabContainer>
          </Route>
          <Route path="/course/:courseId/dates">
            <TabContainer tab="dates" fetch={fetchDatesTab}>
              <DatesTab />
            </TabContainer>
          </Route>
          <Route
            path={[
              '/course/:courseId/:sequenceId/:unitId',
              '/course/:courseId/:sequenceId',
              '/course/:courseId',
            ]}
            component={CoursewareContainer}
          />
        </Switch>
        <Footer />
      </UserMessagesProvider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  handlers: {
    config: () => {
      mergeConfig({
        INSIGHTS_BASE_URL: process.env.INSIGHTS_BASE_URL || null,
        STUDIO_BASE_URL: process.env.STUDIO_BASE_URL || null,
      }, 'LearnerAppConfig');
    },
  },
  // TODO: Remove this once the course blocks api supports unauthenticated
  // access and we are prepared to support public courses in this app.
  requireAuthenticatedUser: true,
  messages: [
    appMessages,
    headerMessages,
    footerMessages,
  ],
});
