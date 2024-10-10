import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { breakpoints, useWindowSize } from '@edx/paragon';

import { getAuthenticatedHttpClient, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import CertificateStatus from './certificate-status/CertificateStatus';
import CourseCompletion from './course-completion/CourseCompletion';
import CourseGrade from './grades/course-grade/CourseGrade';
import DetailedGrades from './grades/detailed-grades/DetailedGrades';
import GradeSummary from './grades/grade-summary/GradeSummary';
import ProgressHeader from './ProgressHeader';
import RelatedLinks from './related-links/RelatedLinks';

import { useModel } from '../../generic/model-store';

const ProgressTab = () => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    gradesFeatureIsFullyLocked,
  } = useModel('progress', courseId);

  const applyLockedOverlay = gradesFeatureIsFullyLocked ? 'locked-overlay' : '';
  const [visibility, setVisibility] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  // If the visibility is undefined before loading is complete, then hide the component,
  // however if it's still false after loading is complete that means the visibility just
  // isn't configured, in which case default to being visible.
  const isVisible = (component) => visibility?.[`show${component}`] ?? isLoaded;
  useEffect(async () => {
    const authenticatedUser = getAuthenticatedUser();
    const url = new URL(`${getConfig().LMS_BASE_URL}/api/courses/v2/blocks/`);
    url.searchParams.append('course_id', courseId);
    url.searchParams.append('username', authenticatedUser ? authenticatedUser.username : '');
    url.searchParams.append('requested_fields', 'other_course_settings');
    const { data } = await getAuthenticatedHttpClient().get(url.href, {});
    setVisibility(data.blocks[data.root]?.other_course_settings?.progressPage ?? {});
    setIsLoaded(true);
  }, [courseId]);

  const windowWidth = useWindowSize().width;
  if (windowWidth === undefined) {
    // Bail because we don't want to load <CertificateStatus/> twice, emitting 'visited' events both times.
    // This is a hacky solution, since the user can resize the screen and still get two visited events.
    // But I'm leaving a larger refactor as an exercise to a future reader.
    return null;
  }

  const wideScreen = windowWidth >= breakpoints.large.minWidth;
  return (
    <>
      <ProgressHeader />
      <div className="row w-100 m-0">
        {/* Main body */}
        <div className="col-12 col-md-8 p-0">
          <CourseCompletion />
          {!wideScreen && isVisible('CertificateStatus') && <CertificateStatus />}
          {isVisible('Grades') && <CourseGrade />}
          <div className={`grades my-4 p-4 rounded raised-card ${applyLockedOverlay}`} aria-hidden={gradesFeatureIsFullyLocked}>
            {isVisible('GradeSummary') && <GradeSummary />}
            {isVisible('GradeSummary') && <DetailedGrades />}
          </div>
        </div>

        {/* Side panel */}
        <div className="col-12 col-md-4 p-0 px-md-4">
          {wideScreen && isVisible('CertificateStatus') && <CertificateStatus />}
          {isVisible('RelatedLinks') && <RelatedLinks />}
        </div>
      </div>
    </>
  );
};

export default ProgressTab;
