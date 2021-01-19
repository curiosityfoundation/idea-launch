import React from 'react';
import { render } from '@testing-library/react';

import CommentInput from './comment-input';

describe('CommentInput', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CommentInput />);
    expect(baseElement).toBeTruthy();
  });
});
