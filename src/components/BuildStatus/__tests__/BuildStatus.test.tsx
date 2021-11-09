import { render } from '@testing-library/react';
import { BuildStatusType } from '../../../scripts/Build';
import { BuildStatus } from '../BuildStatus';

test('renders BuildStatus', () => {
  render(
    <BuildStatus
      identifier="20180911-1037"
      status={BuildStatusType.CANCELLED}
      user="jvanko"
      date={new Date(2021, 11, 3, 10, 24, 43, 13)}
    />
  );
});
