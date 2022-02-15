//
// convert an angle and egrees into radians
//
export const toRadian = (angleDeg: number): number => (Math.PI * angleDeg) / 180;

//
// convert an angle in rad to degree
//
export const toDegree = (angleRad: number): number => (angleRad * 180) / Math.PI;

//
// calculate the RADIAN angles for the radar segments using the given values
//
export const calcAngles = (numSegments: number): number[] => {
  const angle = toRadian(360 / numSegments);
  if (numSegments < 1) return [];

  const result = [0];
  for (let i = 0; i < numSegments; i++) {
    result.push(result[result.length - 1] + angle);
  }

  return result;
};
