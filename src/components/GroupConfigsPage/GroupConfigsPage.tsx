import { PageTitles } from 'common/constants';

import { useQueryParamsEffect } from 'hooks/useQueryParamsEffect';
import { useServiceContainer } from 'hooks/useServiceContainer';
import { useTitle } from 'hooks/useTitle';

import { ActionButton } from 'components/ActionButton/ActionButton';
import { GroupConfigsList } from 'components/GroupConfigsList/GroupConfigsList';
import { PageLayout } from 'components/PageLayout/PageLayout';
import { ProtectedComponent } from 'components/ProtectedContent/ProtectedComponent';

import * as groupConfigApi from 'services/groupConfigApi';

interface IGroupConfigsPage {
  componentId?: string;
}

export const GroupConfigsPage = ({ componentId = 'g1' }: IGroupConfigsPage) => {
  const serviceContainerGroupConfigs = useServiceContainer(groupConfigApi.getGroupConfigs);

  useQueryParamsEffect(serviceContainerGroupConfigs.run, { componentId });
  useTitle(PageTitles.groupConfigs);
  return (
    <PageLayout
      title={PageTitles.groupConfigs}
      description={
        <>
          This page contains all Group Configs. Usually one Group Config may contain multiple Build Configs and it produces a
          Group Build during the build process.
        </>
      }
      actions={
        <ProtectedComponent>
          <ActionButton variant="primary" link="create">
            Create Group Config
          </ActionButton>
        </ProtectedComponent>
      }
    >
      <GroupConfigsList {...{ serviceContainerGroupConfigs, componentId }} />
    </PageLayout>
  );
};
