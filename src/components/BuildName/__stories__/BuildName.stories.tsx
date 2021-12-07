import { BuildName } from '../BuildName';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';

export default {
  title: 'BuildName',
  component: BuildName,
} as ComponentMeta<typeof BuildName>;

const Template: ComponentStory<typeof BuildName> = (args) => (
  <MemoryRouter>
    <BuildName {...args} />
  </MemoryRouter>
);

export const Short = Template.bind({});
Short.args = {
  build: {
    id: '0',
    submitTime: '2017-12-01T13:17:18.007Z',
    buildConfigRevision: {
      id: '2',
      name: 'opossum',
    },
  },
};

export const Long = Template.bind({});
Long.args = {
  build: {
    id: '0',
    submitTime: '2017-12-01T13:17:18.007Z',
    buildConfigRevision: {
      id: '2',
      name: 'opossum',
    },
  },
  long: true,
};

export const LongFirstLink = Template.bind({});
LongFirstLink.args = {
  build: {
    id: '0',
    submitTime: '2017-12-01T13:17:18.007Z',
    buildConfigRevision: {
      id: '2',
      name: 'opossum',
    },
  },
  long: true,
  includeBuildLink: true,
};

export const LongBothLinks = Template.bind({});
LongBothLinks.args = {
  build: {
    id: '0',
    submitTime: '2017-12-01T13:17:18.007Z',
    buildConfigRevision: {
      id: '2',
      name: 'opossum',
    },
  },
  long: true,
  includeBuildLink: true,
  includeConfigLink: true,
};
