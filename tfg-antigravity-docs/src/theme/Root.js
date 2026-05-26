import React from 'react';
import ModalButton from '@site/src/components/ENTSOEDashboard/ModalButton';

export default function Root({ children }) {
  return (
    <>
      {children}
      <ModalButton />
    </>
  );
}
