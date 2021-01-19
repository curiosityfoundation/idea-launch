import React from 'react';
import { render } from '@testing-library/react';

import CreateProfileForm from './create-profile-form';

describe('CreateProfileForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreateProfileForm />);
    expect(baseElement).toBeTruthy();
  });
});
