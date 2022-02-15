import { toDegree, toRadian, calcAngles } from '../math';

test('Deg -> Rad', () => {
  expect(toRadian(0)).toEqual(0);
  expect(toRadian(90)).toEqual(Math.PI / 2);
  expect(toRadian(180)).toEqual(Math.PI);
  expect(toRadian(270)).toEqual(Math.PI * 1.5);
  expect(toRadian(360)).toEqual(Math.PI * 2);
});

test('Rad --> Deg', () => {
  expect(toDegree(0)).toEqual(0);
  expect(toDegree(Math.PI / 2)).toEqual(90);
  expect(toDegree(Math.PI)).toEqual(180);
  expect(toDegree(Math.PI * 1.5)).toEqual(270);
  expect(toDegree(Math.PI * 2)).toEqual(360);
});

test('calcAngles', () => {
  expect(calcAngles(0)).toEqual([]);
  expect(calcAngles(1)).toEqual([0, 2 * Math.PI]);
  expect(calcAngles(2)).toEqual([0, Math.PI, 2 * Math.PI]);
  expect(calcAngles(4)).toEqual([0, Math.PI / 2, Math.PI, 1.5 * Math.PI, 2 * Math.PI]);
});
