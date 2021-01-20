import React from 'react';
import { render } from '@testing-library/react';

import EditProfileForm from './edit-profile-form';

describe('EditProfileForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EditProfileForm />);
    expect(baseElement).toBeTruthy();
  });
});
