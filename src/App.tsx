/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SecurityProvider } from './context/SecurityContext';
import { AppShell } from './components/layout/AppShell';

export default function App() {
  return (
    <SecurityProvider>
      <AppShell />
    </SecurityProvider>
  );
}

