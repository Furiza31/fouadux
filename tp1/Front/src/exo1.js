const sumV1 = (...arr) => {
  if (arr.length === 0) throw new Error('At least one number is expected');
  return arr.reduce((acc, val) => acc + val, 0);
}

const sumV2 = (...arr) => {
  if (arr.length === 0) throw new Error('At least one number is expected');
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}

export { sumV1 };
