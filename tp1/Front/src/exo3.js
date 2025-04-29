const map = (arr, fn) => {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i]));
  }
  return result;
}

const mapV2 = (arr, fn) => arr.map(fn);

export { map };
