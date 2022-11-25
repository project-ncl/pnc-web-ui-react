import * as projectApi from 'services/projectApi';

jest.mock('services/pncClient');

describe('test all functions of the project service', () => {
  test('get projects', async () => {
    let res = await projectApi.getProjects();
    expect(res.status).toBe(200);
    expect(res.data.content.length).toBe(7);
  });

  test('get project', async () => {
    let res = await projectApi.getProject({ id: '106' });
    expect(res.status).toBe(200);
    expect(res.data.id).toBe('106');
  });

  test('get project builds', async () => {
    let res = await projectApi.getProjectBuilds({ id: '106' });
    expect(res.status).toBe(200);
    expect(res.data.content.length).toBe(3);
  });
});
