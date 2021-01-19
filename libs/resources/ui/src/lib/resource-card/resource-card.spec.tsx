import React from 'react';
import { render } from '@testing-library/react';

import ResourceCard from './resource-card';

describe('ResourceCard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResourceCard />);
    expect(baseElement).toBeTruthy();
  });
});
