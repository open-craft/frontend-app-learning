import React from 'react';
import { useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import {
  getLocale, injectIntl, intlShape, isRtl,
} from '@edx/frontend-platform/i18n';
import { DataTable } from '@openedx/paragon';

import { useModel } from '../../../../generic/model-store';
import messages from '../messages';
import SubsectionTitleCell from './SubsectionTitleCell';

const DetailedGradesTable = ({ intl }) => {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    sectionScores,
  } = useModel('progress', courseId);

  const { course, isMasquerading } = useModel('courseHomeMeta', courseId);
  const isStaff = course?.isStaff;

  const isLocaleRtl = isRtl(getLocale());
  const showUngradedAssignments = (
    getConfig().SHOW_UNGRADED_ASSIGNMENT_PROGRESS === 'true'
    || getConfig().SHOW_UNGRADED_ASSIGNMENT_PROGRESS === true
  );
  return (
    sectionScores.map((chapter) => {
      const subsectionScores = chapter.subsections.filter(
        (subsection) => !!(
          (showUngradedAssignments || subsection.hasGradedAssignment)
            && (subsection.numPointsPossible > 0 || subsection.numPointsEarned > 0)
        ),
      );

      if (subsectionScores.length === 0) {
        return null;
      }

      const detailedGradesData = subsectionScores.map((subsection) => {
        let scoreDisplay;

        if (subsection.showCorrectness === 'never') {
          scoreDisplay = 'This score is hidden.';
        } else if (
          !isStaff && !isMasquerading
          && (subsection.showCorrectness === 'past_due' || subsection.showCorrectness === 'never_but_include_grade')
          && Date.parse(subsection.due) > Date.now()
        ) {
          const formattedDate = intl.formatDate(new Date(subsection.due), {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short',
          });
          scoreDisplay = `Score will appear at ${formattedDate}`;
        } else {
          scoreDisplay = `${subsection.numPointsEarned}${isLocaleRtl ? '\\' : '/'}${subsection.numPointsPossible}`;
        }

        return {
          subsectionTitle: <SubsectionTitleCell subsection={subsection} />,
          score: <span className={subsection.learnerHasAccess ? '' : 'greyed-out'}>{scoreDisplay}</span>,
        };
      });

      return (
        <div className="my-3" key={`${chapter.displayName}-grades-table`}>
          <DataTable
            data={detailedGradesData}
            itemCount={detailedGradesData.length}
            columns={[
              {
                Header: chapter.displayName,
                accessor: 'subsectionTitle',
                headerClassName: 'h5 mb-0',
                cellClassName: 'mw-100',
              },
              {
                Header: `${intl.formatMessage(messages.score)}`,
                accessor: 'score',
                headerClassName: 'justify-content-end h5 mb-0',
                cellClassName: 'align-top text-right small',
              },
            ]}
          >
            <DataTable.Table />
          </DataTable>
        </div>
      );
    })
  );
};

DetailedGradesTable.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(DetailedGradesTable);
