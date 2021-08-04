import { CSSProperties, useState } from 'react';
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  PageSection,
  PageSectionVariants,
  Switch,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';

export const AdministrationPage = () => {
  const [isMaintenanceModeOn, setIsMaintenanceModeOn] = useState(false);
  const versionButtonStyle: CSSProperties = {
    marginTop: '5px',
  };

  return (
    <PageLayout title="Administration" description="Administration tools for admin users">
      <PageSection variant={PageSectionVariants.light}>
        <Form isHorizontal>
          <FormGroup label="PNC System Version" fieldId="form-pnc-system-version">
            <TextInput type="text" id="form-pnc-system-version" name="form-pnc-system-version" />
            <Flex>
              <FlexItem align={{ default: 'alignRight' }}>
                <Button
                  variant="primary"
                  id="form-pnc-system-version-update"
                  name="form-pnc-system-version-update"
                  style={versionButtonStyle}
                >
                  Update
                </Button>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </PageSection>
      <Divider component="div" />
      <br />
      <PageSection variant={PageSectionVariants.light}>
        <Form isHorizontal>
          <FormGroup label="Maintenance Mode" fieldId="form-maintenance">
            <Switch
              id="form-maintenance"
              name="form-maintenance"
              label="Maintenance Mode On"
              labelOff="Maintenance Mode Off"
              isChecked={isMaintenanceModeOn}
              onChange={() => {
                setIsMaintenanceModeOn(!isMaintenanceModeOn);
              }}
            />
          </FormGroup>
          <FormGroup label="Announcement" fieldId="form-announcement">
            <TextArea name="form-announcement" id="form-announcement" aria-describedby="form-announcement-helper" />
            <Flex>
              <FlexItem align={{ default: 'alignRight' }}>
                <Button variant="primary" id="form-announcement-update" name="form-announcement-update">
                  Update
                </Button>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </PageSection>
      <Divider component="div" />
    </PageLayout>
  );
};
