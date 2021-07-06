import React, { useMemo } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useAlert } from '../../../../generic/user-messages';
import { useModel } from '../../../../generic/model-store';
import { CERT_STATUS_TYPE } from './CertificateStatusAlert';

const CertificateStatusAlert = React.lazy(() => import('./CertificateStatusAlert'));

function verifyCertStatusType(status) {
  // This method will only return cert statuses when we want to alert on them.
  // It should be modified when we want to alert on a new status type.
  if (status === CERT_STATUS_TYPE.DOWNLOADABLE) {
    return CERT_STATUS_TYPE.DOWNLOADABLE;
  }
  if (status === CERT_STATUS_TYPE.EARNED_NOT_AVAILABLE) {
    return CERT_STATUS_TYPE.EARNED_NOT_AVAILABLE;
  }
  if (status === CERT_STATUS_TYPE.UNVERIFIED) {
    return CERT_STATUS_TYPE.UNVERIFIED;
  }
  return '';
}

function useCertificateStatusAlert(courseId) {
  const {
    isEnrolled,
  } = useModel('courseHomeMeta', courseId);
  const {
    datesWidget: {
      courseDateBlocks,
      userTimezone,
    },
    certData,
  } = useModel('outline', courseId);

  const {
    certStatus,
    certWebViewUrl,
    certificateAvailableDate,
    downloadUrl,
  } = certData || {};
  const endBlock = courseDateBlocks.find(b => b.dateType === 'course-end-date');
  const certStatusType = verifyCertStatusType(certStatus);
  const isWebCert = downloadUrl === null;

  let certURL = '';
  if (certWebViewUrl) {
    certURL = `${getConfig().LMS_BASE_URL}${certWebViewUrl}`;
  } else if (downloadUrl) {
    // PDF Certificate
    certURL = downloadUrl;
  }
  const hasCertStatus = certStatusType !== '';

  // Only show if there is a known cert status that we want provide status on.
  const isVisible = isEnrolled && hasCertStatus;
  const payload = {
    certificateAvailableDate,
    certURL,
    certStatusType,
    courseEndDate: endBlock && endBlock.date,
    userTimezone,
    isWebCert,
  };

  useAlert(isVisible, {
    code: 'clientCertificateStatusAlert',
    payload: useMemo(() => payload, Object.values(payload).sort()),
    topic: 'outline-course-alerts',
  });

  return {
    clientCertificateStatusAlert: CertificateStatusAlert,
  };
}

export default useCertificateStatusAlert;