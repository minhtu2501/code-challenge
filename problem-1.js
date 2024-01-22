var sum_to_n_a = function (n) {
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    sum += i;
  }
  return sum;
};

var sum_to_n_b = function (n) {
  const sum = Array.from({ length: n }, (_, i) => i + 1).reduce(
    (accumulator, i) => accumulator + i,
    0
  );
  return sum;
};

var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};

console.log('sum_to_n_a', sum_to_n_a(20)); // 210
console.log('sum_to_n_b', sum_to_n_b(20)); // 210
console.log('sum_to_n_b', sum_to_n_c(20)); // 210
