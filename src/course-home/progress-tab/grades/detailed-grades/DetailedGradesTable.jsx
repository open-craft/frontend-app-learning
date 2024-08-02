import React from 'react';
import { useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import {
  getLocale, injectIntl, intlShape, isRtl,
} from '@edx/frontend-platform/i18n';
import { DataTable } from '@edx/paragon';

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
            && subsection.showGrades
            && (subsection.numPointsPossible > 0 || subsection.numPointsEarned > 0)
        ),
      );

      if (subsectionScores.length === 0) {
        return null;
      }

      const detailedGradesData = subsectionScores.map((subsection) => ({
        subsectionTitle: <SubsectionTitleCell subsection={subsection} />,
        score: <span className={subsection.learnerHasAccess ? '' : 'greyed-out'}>{subsection.numPointsEarned}{isLocaleRtl ? '\\' : '/'}{subsection.numPointsPossible}</span>,
      }));

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
