import 'jest';
import { isRepeatArray } from '../utils';

describe('test testObject', () => {
  beforeAll(() => {
    // 预处理操作
  });

  test('test sum:', () => {
    expect(isRepeatArray([1, 2])).toBe(false);
    expect(isRepeatArray([2, 2])).toBe(true);
    expect(isRepeatArray([2, 2])).not.toBe(false);
    expect(isRepeatArray([])).toBe(false);
  });
  afterAll(() => {
    // 后处理操作
  });
});
