import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';

function getInsightsUrl(courseId) {
  const urlBase = getConfig().INSIGHTS_BASE_URL;
  let urlFull;
  if (urlBase) {
    urlFull = `${urlBase}/courses`;
    // This shouldn't actually be missing, at present,
    // but we're providing a reasonable fallback,
    // in case of either error or extension.
    if (courseId) {
      urlFull += `/${courseId}`;
    }
  }
  return urlFull;
}

function getStudioUrl(courseId, unitId) {
  const urlBase = getConfig().STUDIO_BASE_URL;
  let urlFull;
  if (urlBase) {
    if (unitId) {
      urlFull = `${urlBase}/container/${unitId}`;
    } else if (courseId) {
      urlFull = `{$urlBase}/course/${courseId}`;
    }
  }
  return urlFull;
}

function InstructorToolbar(props) {
  const {
    courseId,
    unitId,
  } = props;
  const urlInsights = getInsightsUrl(courseId);
  const urlLms = props.activeUnitLmsWebUrl;
  const urlStudio = getStudioUrl(courseId, unitId);
  return (
    <div className="bg-primary text-light">
      <div className="container-fluid py-3 d-md-flex justify-content-end align-items-center">
        <div className="flex-grow-1">
          &nbsp;
        </div>
        {urlLms && (
          <div className="flex-shrink-0">
            <a className="btn d-block btn-outline-light" href={urlLms}>View in the existing experience</a>
          </div>
        )}
        &nbsp;
        {urlStudio && (
          <div className="flex-shrink-0">
            <a className="btn d-block btn-outline-light" href={urlStudio}>View in Studio</a>
          </div>
        )}
        &nbsp;
        {urlInsights && (
          <div className="flex-shrink-0">
            <a className="btn d-block btn-outline-light" href={urlInsights}>View in Insights</a>
          </div>
        )}
      </div>
    </div>
  );
}

InstructorToolbar.propTypes = {
  activeUnitLmsWebUrl: PropTypes.string,
  courseId: PropTypes.string,
  unitId: PropTypes.string,
};

InstructorToolbar.defaultProps = {
  activeUnitLmsWebUrl: undefined,
  courseId: undefined,
  unitId: undefined,
};

const mapStateToProps = (state, props) => {
  if (!props.unitId) {
    return {};
  }

  const activeUnit = state.models.units[props.unitId];
  return {
    activeUnitLmsWebUrl: activeUnit ? activeUnit.lmsWebUrl : undefined,
  };
};

export default connect(mapStateToProps)(InstructorToolbar);
