import 'jest';
import { testRequest } from '../user';

test('test testRequest', async () => {
  const data = await testRequest();
  expect(data).toHaveLength(8);
});

