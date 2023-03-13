export function reduceMultipleString(list: any[]) {
  const uniqueNames = {};
  const result = list.reduce((acc, curr) => {
    if (!uniqueNames[curr.name]) {
      uniqueNames[curr.name] = true;
      acc.push(curr);
    } else {
      const existing = acc.find((item) => item.name === curr.name);
      if (existing.priceOffered < curr.priceOffered) {
        existing.priceOffered = curr.priceOffered;
      }
    }
    return acc;
  }, []);
  return result;
}
