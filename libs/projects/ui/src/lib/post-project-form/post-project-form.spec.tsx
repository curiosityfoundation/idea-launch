import React from 'react';
import { render } from '@testing-library/react';

import PostProjectForm from './post-project-form';

describe('PostProjectForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PostProjectForm />);
    expect(baseElement).toBeTruthy();
  });
});
