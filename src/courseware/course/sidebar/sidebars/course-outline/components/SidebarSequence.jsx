import { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Badge, Collapsible } from '@openedx/paragon';

import courseOutlineMessages from '@src/course-home/outline-tab/messages';
import { useCourseOutlineSidebar } from '../hooks';
import CompletionIcon from './CompletionIcon';
import SidebarUnit from './SidebarUnit';
import { UNIT_ICON_TYPES } from './UnitIcon';

const SidebarSequence = ({
  courseId,
  defaultOpen,
  sequence,
  activeUnitId,
}) => {
  const intl = useIntl();
  const {
    id,
    complete,
    title,
    specialExamInfo,
    unitIds,
    type,
    completionStat,
    optionalCompletion,
  } = sequence;

  const [open, setOpen] = useState(defaultOpen);
  const { activeSequenceId, units, isEnabledCompletionTracking } = useCourseOutlineSidebar();
  const isActiveSequence = id === activeSequenceId;

  const sectionTitle = (
    <>
      <div className="col-auto p-0" style={{ fontSize: '1.1rem' }}>
        <CompletionIcon completionStat={completionStat} enabled={isEnabledCompletionTracking} />
      </div>
      <div className="col-10 d-flex flex-column flex-grow-1 ml-3 mr-auto p-0 text-left">
        <span className="d-flex justify-content-between align-middle text-dark-500">
          {title}
          {optionalCompletion && (
            <Badge className="align-self-center text-uppercase border" variant="light" data-testid="optional-completion-badge-sidebar-sequence">
              {intl.formatMessage(courseOutlineMessages.optionalCompletion)}
            </Badge>
          )}
        </span>
        {specialExamInfo && <span className="align-middle small text-muted">{specialExamInfo}</span>}
        {isEnabledCompletionTracking && (
          <span className="sr-only">
            , {intl.formatMessage(complete
            ? courseOutlineMessages.completedAssignment
            : courseOutlineMessages.incompleteAssignment)}
          </span>
        )}
      </div>
    </>
  );

  return (
    <li>
      <Collapsible
        className={classNames('mb-2', { 'active-section': isActiveSequence, 'bg-info-100': isActiveSequence && !open })}
        styling="card-lg text-break"
        title={sectionTitle}
        open={open}
        onToggle={() => setOpen(!open)}
      >
        <ol className="list-unstyled">
          {unitIds.map((unitId, index) => (
            <SidebarUnit
              key={unitId}
              id={unitId}
              courseId={courseId}
              sequenceId={id}
              unit={units[unitId]}
              isActive={activeUnitId === unitId}
              activeUnitId={activeUnitId}
              isFirst={index === 0}
              isLocked={type === UNIT_ICON_TYPES.lock}
              isCompletionTrackingEnabled={isEnabledCompletionTracking}
            />
          ))}
        </ol>
      </Collapsible>
    </li>
  );
};

SidebarSequence.propTypes = {
  courseId: PropTypes.string.isRequired,
  defaultOpen: PropTypes.bool.isRequired,
  sequence: PropTypes.shape({
    complete: PropTypes.bool,
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    specialExamInfo: PropTypes.string,
    unitIds: PropTypes.arrayOf(PropTypes.string),
    completionStat: PropTypes.shape({
      completed: PropTypes.number,
      total: PropTypes.number,
    }),
    optionalCompletion: PropTypes.bool,
  }).isRequired,
  activeUnitId: PropTypes.string.isRequired,
};

export default SidebarSequence;
