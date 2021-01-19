import React from 'react';
import { CommentList, CommentListProps } from './comment-list';

export default {
  component: CommentList,
  title: 'CommentList',
};

export const primary = () => {
  /* eslint-disable-next-line */
  const props: CommentListProps = {
    comments: [
      {
        id: '0',
        username: 'Joseph A.',
        avatar: 'https://www.gravatar.com/avatar/20511111479e2e5b48aec07710c08d50?s=200',
        content: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
        created: 'a few minutes ago'
      },
      {
        id: '1',
        username: 'Kassim D.',
        avatar: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200',
        content: 'Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
        created: 'just now'
      }
    ]
  };

  return <CommentList {...props} />;
};
