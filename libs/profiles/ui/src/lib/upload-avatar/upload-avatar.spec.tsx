import React from 'react';
import { render } from '@testing-library/react';

import UploadAvatar from './upload-avatar';

describe('UploadAvatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UploadAvatar />);
    expect(baseElement).toBeTruthy();
  });
});
