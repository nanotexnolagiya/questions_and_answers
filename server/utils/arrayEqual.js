module.exports = (a, b) => {
  if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    
    a.sort();
    b.sort();
  
    return JSON.stringify(a) === JSON.stringify(b);
};
