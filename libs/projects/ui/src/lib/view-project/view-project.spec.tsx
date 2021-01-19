import React from 'react';
import { render } from '@testing-library/react';

import ViewProject from './view-project';

describe('ViewProject', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ViewProject />);
    expect(baseElement).toBeTruthy();
  });
});
