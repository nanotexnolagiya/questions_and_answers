module.exports = (objs, desired, field) => {
  let arr = objs.map(obj => {
    console.log(obj);
    return obj[field];
  });
  if (arr.length < desired.length) return false;
  arr = arr.map(Number);
  desired = desired.map(Number);
  for (let i = 0; i < desired.length; i++) {
    if (!arr.includes(desired[i])) return false;
  }
  return true;
};
