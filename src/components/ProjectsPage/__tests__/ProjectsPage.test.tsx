import { ProjectsPage } from '../ProjectsPage';
import ShallowRenderer from 'react-test-renderer/shallow';

jest.mock('../../../services/projectService');

test('render ProjectsPage', () => {
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<ProjectsPage />);
});

test('compare snapshot with previous record', () => {
  const renderer = ShallowRenderer.createRenderer();
  let tree: any;
  tree = renderer.render(<ProjectsPage />);
  expect(tree).toMatchSnapshot();
});
