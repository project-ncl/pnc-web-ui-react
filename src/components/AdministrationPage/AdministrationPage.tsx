import { CSSProperties, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Switch,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { PageLayout } from './../PageLayout/PageLayout';
import { useTitle } from '../../containers/useTitle';

export const AdministrationPage = () => {
  const [isMaintenanceModeOn, setIsMaintenanceModeOn] = useState(false);
  const maintenanceSwitchStyle: CSSProperties = {
    paddingTop: '5px',
    paddingLeft: '8px',
    paddingRight: '8px',
    paddingBottom: '5px',
  };

  useTitle('Administration');

  return (
    <PageLayout title="Administration" description="Administration tools for admin users">
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Form isHorizontal>
            <Card>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={12}>
                    <FormGroup label="PNC System Version" fieldId="form-pnc-system-version">
                      <TextInput type="text" id="form-pnc-system-version" name="form-pnc-system-version" />
                    </FormGroup>
                  </GridItem>
                  <GridItem span={4}>
                    <Button variant="primary" id="form-pnc-system-version-update" name="form-pnc-system-version-update">
                      Update
                    </Button>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </Form>
        </FlexItem>
        <FlexItem>
          <Form isHorizontal>
            <Card>
              <CardBody>
                <Grid hasGutter>
                  <GridItem span={12}>
                    <FormGroup label="Maintenance Mode" fieldId="form-maintenance-mode">
                      <div style={maintenanceSwitchStyle}>
                        <Switch
                          id="form-maintenance-mode-switch"
                          name="form-maintenance-mode-switch"
                          label="Maintenance Mode On"
                          labelOff="Maintenance Mode Off"
                          isChecked={isMaintenanceModeOn}
                          onChange={() => {
                            setIsMaintenanceModeOn(!isMaintenanceModeOn);
                          }}
                        />
                      </div>
                    </FormGroup>
                  </GridItem>
                  <GridItem span={12}>
                    <FormGroup label="Announcement" fieldId="form-announcement">
                      <TextArea name="form-announcement" id="form-announcement" />
                    </FormGroup>
                  </GridItem>
                  <GridItem span={4}>
                    <Button variant="primary" id="form-announcement-update" name="form-announcement-update">
                      Update
                    </Button>
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </Form>
        </FlexItem>
      </Flex>
    </PageLayout>
  );
};
