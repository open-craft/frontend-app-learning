import { UnitNavigation } from '@src/courseware/course/sequence/sequence-navigation';
import React from 'react';
import { PluginSlot } from '@openedx/frontend-plugin-framework';
import { useParams } from 'react-router-dom';

export interface SequenceBottomNavigationSlotProps {
  sequenceId: string;
  unitId: string;
  nextHandler: () => void;
  onNavigate: (unitId: string) => void;
  previousHandler: () => void;
}

const SequenceBottomNavigationSlot = ({
  sequenceId,
  unitId,
  nextHandler,
  onNavigate,
  previousHandler,
}: SequenceBottomNavigationSlotProps) => {
  const { courseId } = useParams<{ courseId: string }>();
  return (
    <PluginSlot
      id="org.openedx.frontend.learning.sequence_bottom_navigation.v1"
      slotOptions={{
        mergeProps: true,
      }}
      pluginProps={{
        sequenceId,
        unitId,
        nextHandler,
        onNavigate,
        previousHandler,
      }}
    >
      <UnitNavigation
        courseId={courseId!}
        sequenceId={sequenceId}
        unitId={unitId}
        isAtTop={false}
        onClickPrevious={previousHandler}
        onClickNext={nextHandler}
      />
    </PluginSlot>
  );
};

export default SequenceBottomNavigationSlot;
