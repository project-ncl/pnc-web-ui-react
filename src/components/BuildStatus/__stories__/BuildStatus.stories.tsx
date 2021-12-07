import { BuildStatus } from '../BuildStatus';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';

export default {
  title: 'BuildStatus',
  component: BuildStatus,
} as ComponentMeta<typeof BuildStatus>;

const Template: ComponentStory<typeof BuildStatus> = (args) => (
  <MemoryRouter>
    <BuildStatus {...args} />
  </MemoryRouter>
);

export const Short = Template.bind({});
Short.args = {
  build: {
    id: '0',
    submitTime: '2017-12-01T13:17:18.007Z',
    status: 'SUCCESS',
    buildConfigRevision: {
      id: '2',
      name: 'opossum',
    },
    user: {
      id: '3',
      username: 'robotuser',
    },
  },
};

export const Long = Template.bind({});
Long.args = {
  build: {
    id: '0',
    submitTime: '2017-12-01T13:17:18.007Z',
    status: 'FAILED',
    buildConfigRevision: {
      id: '2',
      name: 'opossum',
    },
    user: {
      id: '3',
      username: 'robotuser',
    },
  },
  long: true,
};

export const LongTemporaryCorrupted = Template.bind({});
LongTemporaryCorrupted.args = {
  build: {
    id: '0',
    submitTime: '2017-12-01T13:17:18.007Z',
    status: 'CANCELLED',
    buildConfigRevision: {
      id: '2',
      name: 'opossum',
    },
    user: {
      id: '3',
      username: 'robotuser',
    },
    temporaryBuild: true,
    attributes: {
      POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
    },
  },
  long: true,
};
