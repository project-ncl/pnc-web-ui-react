import { useState } from 'react';
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
  Text,
  TextContent,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

export const AdministrationPage = () => {
  const [isMaintenanceModeOn, setIsMaintenanceModeOn] = useState(false);
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Administration</Text>
        </TextContent>
        <br />
        <Form isHorizontal>
          <FormGroup label="Pnc System Version" fieldId="horizontal-form-pnc-system-version">
            <TextInput
              type="text"
              id="horizontal-form-pnc-system-version"
              aria-describedby="horizontal-form-pnc-system-version-helper"
              name="horizontal-form-pnc-system-version"
            />
            <br />
            <Flex>
              <FlexItem align={{ default: 'alignRight' }}>
                <Button variant="primary">Update</Button>
              </FlexItem>
            </Flex>
          </FormGroup>
          <FormGroup label="Maintenance Mode" fieldId="horizontal-form-maintenance">
            <Switch
              id="maintenance-switch"
              label="Maintenance Mode On"
              labelOff="Maintenance Mode Off"
              isChecked={isMaintenanceModeOn}
              onChange={() => {
                setIsMaintenanceModeOn(!isMaintenanceModeOn);
              }}
            />
          </FormGroup>
          <FormGroup label="Announcement" fieldId="horizontal-form-announcement">
            <TextArea
              name="horizontal-form-announcement"
              id="horizontal-form-announcement"
              aria-describedby="horizontal-form-announcement-helper"
            />
            <br />
            <Flex>
              <FlexItem align={{ default: 'alignRight' }}>
                <Button variant="primary">Update</Button>
              </FlexItem>
            </Flex>
          </FormGroup>
        </Form>
      </PageSection>

      <Divider component="div" />
    </>
  );
};
