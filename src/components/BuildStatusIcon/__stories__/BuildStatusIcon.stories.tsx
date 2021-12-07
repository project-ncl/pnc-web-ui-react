import { BuildStatusIcon } from '../BuildStatusIcon';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'BuildStatusIcon',
  component: BuildStatusIcon,
} as ComponentMeta<typeof BuildStatusIcon>;

const Template: ComponentStory<typeof BuildStatusIcon> = (args) => <BuildStatusIcon {...args} />;

export const Short = Template.bind({});
Short.args = {
  build: {
    id: '5',
    status: 'BUILDING',
  },
};

export const Long = Template.bind({});
Long.args = {
  build: {
    id: '5',
    status: 'BUILDING',
  },
  long: true,
};

export const LongCorrupted = Template.bind({});
LongCorrupted.args = {
  build: {
    id: '5',
    status: 'BUILDING',
    attributes: {
      POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
    },
    buildConfigRevision: { id: '0' },
  },
  long: true,
};

export const LongTemporary = Template.bind({});
LongTemporary.args = {
  build: {
    id: '5',
    status: 'BUILDING',
    temporaryBuild: true,
  },
  long: true,
};

export const LongTemporaryCorrupted = Template.bind({});
LongTemporaryCorrupted.args = {
  build: {
    id: '5',
    status: 'BUILDING',
    attributes: {
      POST_BUILD_REPO_VALIDATION: 'REPO_SYSTEM_ERROR',
    },
    buildConfigRevision: { id: '0' },
    temporaryBuild: true,
  },
  long: true,
};
