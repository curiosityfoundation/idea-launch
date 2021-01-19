import React from 'react';
import { render } from '@testing-library/react';

import ResourcesUi from './resources-ui';

describe('ResourcesUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResourcesUi />);
    expect(baseElement).toBeTruthy();
  });
});
