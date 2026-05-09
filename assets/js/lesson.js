const lessonId = document.body.dataset.lessonId;
let currentQuestion = null;
let missCount = 0;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function factorial(n) {
  let value = 1;
  for (let i = 2; i <= n; i += 1) value *= i;
  return value;
}

function permutation(n, r) {
  let value = 1;
  for (let i = 0; i < r; i += 1) value *= n - i;
  return value;
}

function combination(n, r) {
  return permutation(n, r) / factorial(r);
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function mean(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mode(values) {
  const counts = new Map();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  let bestValue = values[0];
  let bestCount = 0;
  counts.forEach((count, value) => {
    if (count > bestCount) {
      bestCount = count;
      bestValue = value;
    }
  });
  return bestValue;
}

function roundToThree(value) {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

function formatNumber(value) {
  const rounded = roundToThree(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

const generators = {
  "b1-1-1": () => {
    const center = randInt(-5, 5);
    const distance = randInt(2, 9);
    return {
      text: `|x - (${center})| = ${distance}。請輸入較大的解。`,
      answer: center + distance,
      solution: `這表示 x 到 ${center} 的距離是 ${distance}，兩解為 ${center - distance} 與 ${center + distance}，較大的解是 ${center + distance}。`
    };
  },
  "b1-1-2": () => {
    const a = randInt(-4, 5) || 2;
    const b = randInt(-8, 8);
    const x = randInt(-5, 5);
    const y = a * x + b;
    return {
      text: `線型函數 y = ${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)}。當 x = ${x} 時，y = ?`,
      answer: y,
      solution: `代入 x = ${x}，y = ${a} x ${x} ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${y}。`
    };
  },
  "b1-1-3": () => {
    const h = randInt(-5, 5);
    const k = randInt(-8, 8);
    return {
      text: `二次函數 y = (x ${h >= 0 ? "-" : "+"} ${Math.abs(h)})² ${k >= 0 ? "+" : "-"} ${Math.abs(k)} 的頂點 x 坐標是多少？`,
      answer: h,
      solution: `頂點式 y = (x - h)² + k 的頂點是 (h, k)，所以頂點 x 坐標為 ${h}。`
    };
  },
  "b1-1-4": () => {
    const r1 = randInt(-6, 1);
    const r2 = randInt(2, 9);
    return {
      text: `(x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)})(x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)}) < 0 的解區間長度是多少？`,
      answer: r2 - r1,
      solution: `開口向上，小於 0 在兩根之間，解為 ${r1} < x < ${r2}，區間長度 ${r2 - r1}。`
    };
  },
  "b1-2-1": () => {
    const x1 = randInt(-4, 2);
    const y1 = randInt(-5, 5);
    const dx = randInt(2, 6);
    const m = randInt(-4, 5) || 2;
    const x2 = x1 + dx;
    const y2 = y1 + m * dx;
    return {
      text: `通過 A(${x1}, ${y1})、B(${x2}, ${y2}) 的直線斜率是多少？`,
      answer: m,
      solution: `m = (${y2} - ${y1}) / (${x2} - ${x1}) = ${m * dx} / ${dx} = ${m}。`
    };
  },
  "b1-2-2": () => {
    const m = randInt(-4, 5) || 2;
    const x = randInt(-3, 4);
    const y = randInt(-6, 8);
    const b = y - m * x;
    return {
      text: `直線斜率為 ${m}，通過 (${x}, ${y})。若寫成 y = ${m}x + b，b 是多少？`,
      answer: b,
      solution: `代入 (${x}, ${y})：${y} = ${m} x ${x} + b，所以 b = ${b}。`
    };
  },
  "b1-2-3": () => {
    const a = 3;
    const b = 4;
    const c = randInt(-20, 20);
    const x = randInt(-3, 5);
    const y = randInt(-3, 5);
    const rawAnswer = Math.abs(a * x + b * y + c) / 5;
    const answer = roundToThree(rawAnswer);
    return {
      text: `點 (${x}, ${y}) 到直線 3x + 4y ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0 的距離是多少？若有小數，請四捨五入到小數點後三位。`,
      answer,
      solution: `距離 = |3 x ${x} + 4 x ${y} ${c >= 0 ? "+" : "-"} ${Math.abs(c)}| / 5 = ${formatNumber(answer)}。`
    };
  },
  "b1-3-1": () => {
    const a = randInt(1, 6);
    const b = randInt(-6, 6);
    const c = randInt(-6, 6);
    const d = randInt(-6, 6);
    return {
      text: `化簡 (${a}x² ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x) + (${c}x² ${d >= 0 ? "+" : "-"} ${Math.abs(d)}x) 後，x 的係數是多少？`,
      answer: b + d,
      solution: `同類項才可合併，x 的係數為 ${b} + ${d} = ${b + d}。`
    };
  },
  "b1-3-2": () => {
    const a = randInt(-4, 5);
    const p = randInt(1, 4);
    const q = randInt(-6, 6);
    const r = randInt(-8, 8);
    const answer = p * a * a + q * a + r;
    return {
      text: `f(x) = ${p}x² ${q >= 0 ? "+" : "-"} ${Math.abs(q)}x ${r >= 0 ? "+" : "-"} ${Math.abs(r)}。除以 x - (${a}) 的餘式是多少？`,
      answer,
      solution: `餘式定理：餘式 = f(${a}) = ${p} x ${a}² ${q >= 0 ? "+" : "-"} ${Math.abs(q)} x ${a} ${r >= 0 ? "+" : "-"} ${Math.abs(r)} = ${answer}。`
    };
  },
  "b1-3-3": () => {
    const a = randInt(-5, 5);
    const b = randInt(-5, 5);
    const answer = a + b;
    return {
      text: `(x² ${-(a + b) >= 0 ? "+" : "-"} ${Math.abs(-(a + b))}x ${a * b >= 0 ? "+" : "-"} ${Math.abs(a * b)}) / (x ${a >= 0 ? "-" : "+"} ${Math.abs(a)}) 化簡後為 x + c，c 是多少？`,
      answer: -b,
      solution: `分子可分解為 (x ${a >= 0 ? "-" : "+"} ${Math.abs(a)})(x ${b >= 0 ? "-" : "+"} ${Math.abs(b)})，約掉第一個因式後為 x ${b >= 0 ? "-" : "+"} ${Math.abs(b)}，所以 c = ${-b}。`
    };
  },
  "b2-1-1": () => {
    const angle = [30, 45, 60, 90, 120, 150][randInt(0, 5)];
    const turns = randInt(1, 3);
    const answer = angle + 360 * turns;
    return {
      text: `${angle}° 的一個正向同界角是多少？請加上 ${turns} 圈後作答。`,
      answer,
      solution: `同界角相差 360° 的整數倍，所以 ${angle} + 360 x ${turns} = ${answer}°。`
    };
  },
  "b2-1-2": () => {
    const triples = [
      { opposite: 3, adjacent: 4, hypotenuse: 5 },
      { opposite: 5, adjacent: 12, hypotenuse: 13 },
      { opposite: 8, adjacent: 15, hypotenuse: 17 }
    ];
    const t = triples[randInt(0, triples.length - 1)];
    const answer = roundToThree(t.opposite / t.hypotenuse);
    return {
      text: `直角三角形中，某銳角的對邊為 ${t.opposite}、鄰邊為 ${t.adjacent}、斜邊為 ${t.hypotenuse}。sin 值是多少？若有小數，請四捨五入到小數點後三位。`,
      answer,
      solution: `sin = 對邊 / 斜邊 = ${t.opposite}/${t.hypotenuse} = ${formatNumber(answer)}。`
    };
  },
  "b2-1-3": () => {
    const items = [
      { fn: "sin", angle: 150, answer: 0.5, note: "第二象限 sin 為正，參考角 30°" },
      { fn: "sin", angle: 210, answer: -0.5, note: "第三象限 sin 為負，參考角 30°" },
      { fn: "cos", angle: 180, answer: -1, note: "180° 在 x 軸負向" },
      { fn: "cos", angle: 330, answer: 0.866, note: "第四象限 cos 為正，參考角 30°" }
    ];
    const item = items[randInt(0, items.length - 1)];
    return {
      text: `${item.fn} ${item.angle}° 約是多少？若有小數，請四捨五入到小數點後三位。`,
      answer: item.answer,
      solution: `${item.note}，所以 ${item.fn} ${item.angle}° = ${formatNumber(item.answer)}。`
    };
  },
  "b2-1-4": () => {
    const values = [
      { fn: "sin", angle: 0, answer: 0 },
      { fn: "sin", angle: 90, answer: 1 },
      { fn: "sin", angle: 180, answer: 0 },
      { fn: "sin", angle: 270, answer: -1 },
      { fn: "cos", angle: 0, answer: 1 },
      { fn: "cos", angle: 90, answer: 0 },
      { fn: "cos", angle: 180, answer: -1 },
      { fn: "cos", angle: 360, answer: 1 }
    ];
    const item = values[randInt(0, values.length - 1)];
    return {
      text: `${item.fn} ${item.angle}° = ?`,
      answer: item.answer,
      solution: `依照 ${item.fn} 的關鍵角圖形，${item.fn} ${item.angle}° = ${item.answer}。`
    };
  },
  "b2-2-1": () => {
    const a = randInt(3, 8);
    const b = randInt(3, 8);
    const answer = a * a + b * b - a * b;
    return {
      text: `三角形兩邊為 ${a}、${b}，夾角為 60°。用餘弦定理求第三邊 c 的平方 c²。`,
      answer,
      solution: `c² = ${a}² + ${b}² - 2 x ${a} x ${b} x cos 60° = ${a * a} + ${b * b} - ${a * b} = ${answer}。`
    };
  },
  "b2-2-2": () => {
    const distance = randInt(8, 24);
    const eye = randInt(12, 18) / 10;
    const answer = distance + eye;
    return {
      text: `水平距離 ${distance} 公尺，仰角 45°，眼高 ${eye} 公尺。物體離地高度是多少？`,
      answer,
      solution: `tan 45° = 1，高度差為 ${distance} 公尺，再加眼高 ${eye}，共 ${answer} 公尺。`
    };
  },
  "b2-3-1": () => {
    const ax = randInt(-5, 8);
    const bx = randInt(-5, 8);
    const ay = randInt(-4, 6);
    const by = randInt(-4, 6);
    return {
      text: `向量 a = (${ax}, ${ay})，b = (${bx}, ${by})。a + b 的 x 分量是多少？`,
      answer: ax + bx,
      solution: `向量加法分量相加，x 分量為 ${ax} + ${bx} = ${ax + bx}。`
    };
  },
  "b2-3-2": () => {
    const steps = [
      { x: 3, y: 4, length: 5 },
      { x: 5, y: 12, length: 13 },
      { x: 8, y: 15, length: 17 }
    ];
    const step = steps[randInt(0, steps.length - 1)];
    const x = step.x;
    const y = step.y;
    const ax = randInt(-3, 3);
    const ay = randInt(-3, 3);
    const bx = ax + x;
    const by = ay + y;
    return {
      text: `A(${ax}, ${ay})，B(${bx}, ${by})。向量 AB 的長度約是多少？`,
      answer: step.length,
      solution: `AB = (${bx} - ${ax}, ${by} - ${ay}) = (${x}, ${y})，長度 = √(${x}² + ${y}²) = ${step.length}。`
    };
  },
  "b2-3-3": () => {
    const ax = randInt(-4, 5);
    const ay = randInt(-4, 5);
    const bx = randInt(-4, 5);
    const by = randInt(-4, 5);
    const answer = ax * bx + ay * by;
    return {
      text: `向量 a = (${ax}, ${ay})，b = (${bx}, ${by})。a · b = ?`,
      answer,
      solution: `a · b = ${ax} x ${bx} + ${ay} x ${by} = ${answer}。`
    };
  },
  "b2-4-1": () => {
    const r = randInt(2, 9);
    const h = randInt(-5, 5);
    const k = randInt(-5, 5);
    return {
      text: `圓心為 (${h}, ${k})，半徑為 ${r}。標準式右邊的 r² 是多少？`,
      answer: r * r,
      solution: `標準式為 (x - h)² + (y - k)² = r²，所以 r² = ${r}² = ${r * r}。`
    };
  },
  "b2-4-2": () => {
    const r = randInt(3, 8);
    const d = randInt(1, 10);
    const answer = d < r ? 2 : d === r ? 1 : 0;
    return {
      text: `圓心到直線距離 d = ${d}，半徑 r = ${r}。相離輸入 0，相切輸入 1，相交輸入 2。`,
      answer,
      solution: d < r
        ? `d < r，所以直線穿過圓，有兩個交點，答案是 2。`
        : d === r
          ? `d = r，所以直線與圓相切，答案是 1。`
          : `d > r，所以直線與圓相離，答案是 0。`
    };
  },
  "b3-1-1": () => {
    const a1 = randInt(2, 12);
    const d = randInt(2, 8);
    const n = randInt(5, 12);
    const an = a1 + (n - 1) * d;
    return {
      text: `等差數列第一項為 ${a1}，公差為 ${d}。第 ${n} 項是多少？`,
      answer: an,
      solution: `a_n = a_1 + (n - 1)d = ${a1} + (${n} - 1) x ${d} = ${an}。`
    };
  },
  "b3-1-2": () => {
    const a1 = randInt(2, 5);
    const r = randInt(2, 4);
    const n = randInt(4, 7);
    const an = a1 * r ** (n - 1);
    return {
      text: `等比數列第一項為 ${a1}，公比為 ${r}。第 ${n} 項是多少？`,
      answer: an,
      solution: `a_n = a_1 r^(n - 1) = ${a1} x ${r}^${n - 1} = ${an}。`
    };
  },
  "b3-2-1": () => {
    const x = randInt(-6, 8);
    const a = randInt(2, 6);
    const b = randInt(-8, 8);
    const c = a * x + b;
    return {
      text: `解一元一次方程式：${a}x ${b >= 0 ? "+" : "-"} ${Math.abs(b)} = ${c}。x = ?`,
      answer: x,
      solution: `先移項得到 ${a}x = ${c - b}，再除以 ${a}，所以 x = ${x}。`
    };
  },
  "b3-2-2": () => {
    const r1 = randInt(-6, 2);
    const r2 = randInt(3, 9);
    const b = -(r1 + r2);
    const c = r1 * r2;
    return {
      text: `解 x^2 ${b >= 0 ? "+" : "-"} ${Math.abs(b)}x ${c >= 0 ? "+" : "-"} ${Math.abs(c)} = 0。請輸入較小的根。`,
      answer: Math.min(r1, r2),
      solution: `可分解為 (x ${r1 >= 0 ? "-" : "+"} ${Math.abs(r1)})(x ${r2 >= 0 ? "-" : "+"} ${Math.abs(r2)}) = 0，所以兩根為 ${r1}、${r2}，較小的是 ${Math.min(r1, r2)}。`
    };
  },
  "b3-3-1": () => {
    const x = randInt(1, 9);
    const y = randInt(1, 9);
    return {
      text: `聯立方程組 x + y = ${x + y}，x - y = ${x - y}。請輸入 x 的值。`,
      answer: x,
      solution: `兩式相加得 2x = ${(x + y) + (x - y)}，所以 x = ${x}。`
    };
  },
  "b3-3-2": () => {
    const x = randInt(-2, 6);
    const y = randInt(-2, 6);
    const limit = randInt(4, 10);
    const ok = x + y <= limit ? 1 : 0;
    return {
      text: `點 (${x}, ${y}) 是否滿足不等式 x + y <= ${limit}？成立輸入 1，不成立輸入 0。`,
      answer: ok,
      solution: `代入得 ${x} + ${y} = ${x + y}，${x + y <= limit ? "小於等於" : "大於"} ${limit}，所以答案是 ${ok}。`
    };
  },
  "b3-3-3": () => {
    const maxX = randInt(4, 9);
    const maxY = randInt(4, 9);
    const px = randInt(2, 6);
    const py = randInt(2, 6);
    const answer = Math.max(px * maxX, py * maxY);
    return {
      text: `限制為 x >= 0、y >= 0、x/${maxX} + y/${maxY} <= 1，目標 P = ${px}x + ${py}y。最大值是多少？`,
      answer,
      solution: `可行區頂點為 (0,0)、(${maxX},0)、(0,${maxY})。代入 P 得 0、${px * maxX}、${py * maxY}，最大值是 ${answer}。`
    };
  },
  "b3-4-1": () => {
    const base = randInt(2, 5);
    const m = randInt(2, 4);
    const n = randInt(2, 4);
    const answer = base ** (m + n);
    return {
      text: `${base}^${m} x ${base}^${n} 的值是多少？`,
      answer,
      solution: `同底數相乘，指數相加：${base}^${m + n} = ${answer}。`
    };
  },
  "b3-4-2": () => {
    const base = randInt(2, 4);
    const x = randInt(2, 5);
    const answer = base ** x;
    return {
      text: `指數函數 y = ${base}^x，當 x = ${x} 時，y = ?`,
      answer,
      solution: `直接代入：y = ${base}^${x} = ${answer}。`
    };
  },
  "b3-4-3": () => {
    const base = [2, 3, 5][randInt(0, 2)];
    const exponent = randInt(2, 5);
    const value = base ** exponent;
    return {
      text: `log_${base} ${value} = ?`,
      answer: exponent,
      solution: `log_${base} ${value} = x 等價於 ${base}^x = ${value}，所以 x = ${exponent}。`
    };
  },
  "b3-4-4": () => {
    const base = [2, 3, 5][randInt(0, 2)];
    const exponent = randInt(1, 4);
    const x = base ** exponent;
    return {
      text: `對數函數 y = log_${base} x，當 x = ${x} 時，y = ?`,
      answer: exponent,
      solution: `log_${base} ${x} = ${exponent}，因為 ${base}^${exponent} = ${x}。`
    };
  },
  "b4-1-1": () => {
    const a = randInt(3, 8);
    const b = randInt(2, 7);
    if (Math.random() > 0.5) {
      return { text: `有 ${a} 種封面、${b} 種書籤，只能選其中一樣，有幾種選法？`, answer: a + b, solution: `用加法原理：${a} + ${b} = ${a + b}。` };
    }
    return { text: `有 ${a} 種封面、${b} 種書籤，各選一種搭配，有幾種搭配？`, answer: a * b, solution: `用乘法原理：${a} x ${b} = ${a * b}。` };
  },
  "b4-1-2": () => {
    const n = randInt(5, 8);
    const r = randInt(2, Math.min(4, n - 1));
    const answer = permutation(n, r);
    return { text: `從 ${n} 張不同卡片中抽出 ${r} 張排成一列，有幾種排法？`, answer, solution: `P(${n}, ${r}) = ${Array.from({ length: r }, (_, i) => n - i).join(" x ")} = ${answer}。` };
  },
  "b4-1-3": () => {
    const n = randInt(3, 8);
    const r = randInt(3, 5);
    const answer = n ** r;
    return { text: `密碼有 ${r} 位，每位可從 ${n} 個符號選且可重複，有幾組？`, answer, solution: `${n}^${r} = ${answer}。` };
  },
  "b4-1-4": () => {
    const n = randInt(6, 10);
    const r = randInt(2, Math.min(4, n - 1));
    const answer = combination(n, r);
    return { text: `從 ${n} 張便條挑出 ${r} 張，不計順序，有幾種？`, answer, solution: `C(${n}, ${r}) = ${answer}。` };
  },
  "b4-1-5": () => {
    const n = randInt(4, 7);
    const c = randInt(2, 5);
    const k = randInt(1, n - 1);
    const answer = combination(n, k) * c ** (n - k);
    return { text: `在 (x + ${c})^${n} 中，x^${k} 的係數是多少？`, answer, solution: `C(${n}, ${k}) x ${c}^${n - k} = ${answer}。` };
  },
  "b4-2-1": () => {
    const m = randInt(4, 9);
    return { text: `擲硬幣並轉 1 到 ${m} 的轉盤，樣本空間有幾個結果？`, answer: 2 * m, solution: `2 x ${m} = ${2 * m}。` };
  },
  "b4-2-2": () => {
    const n = randInt(12, 24);
    const a = randInt(2, 4);
    const b = a === 2 ? randInt(3, 5) : randInt(2, 5);
    const overlap = lcm(a, b);
    const answer = Math.floor(n / a) + Math.floor(n / b) - Math.floor(n / overlap);
    return { text: `1 到 ${n} 中，是 ${a} 的倍數或 ${b} 的倍數共有幾個？`, answer, solution: `${Math.floor(n / a)} + ${Math.floor(n / b)} - ${Math.floor(n / overlap)} = ${answer}。` };
  },
  "b4-2-3": () => {
    const denominator = [4, 5, 8, 10][randInt(0, 3)];
    const unit = randInt(4, 12) * 10;
    const prize = unit * denominator;
    const cost = randInt(1, Math.max(1, unit / 10 - 1)) * 10;
    const expectedNet = unit - cost;
    return { text: `抽獎券 ${cost} 元，1/${denominator} 機會得 ${prize} 元，否則 0 元。期望淨收益是多少？`, answer: expectedNet, solution: `${prize} x 1/${denominator} - ${cost} = ${expectedNet}。` };
  },
  "b4-3-1": () => {
    const population = randInt(30, 48);
    const sample = randInt(6, 14);
    return { text: `研究全班 ${population} 人，抽問 ${sample} 人。樣本大小是多少？`, answer: sample, solution: `被抽問的 ${sample} 人是樣本。` };
  },
  "b4-3-2": () => {
    const total = [20, 25, 40, 50][randInt(0, 3)];
    const percent = [10, 20, 25, 30, 40, 50][randInt(0, 5)];
    const count = (total * percent) / 100;
    return { text: `${total} 份問卷中有 ${count} 人選機率，相對次數是百分之幾？`, answer: percent, solution: `${count} / ${total} = ${percent / 100} = ${percent}%。` };
  },
  "b4-3-3": () => {
    const base = randInt(2, 5);
    const values = [base, base, base + 1, base + 2, base + 2, base + 3, base + 6];
    const options = ["平均數", "中位數", "眾數", "全距"];
    const option = options[randInt(0, options.length - 1)];
    const answerMap = { "平均數": mean(values), "中位數": median(values), "眾數": mode(values), "全距": Math.max(...values) - Math.min(...values) };
    const answer = roundToThree(answerMap[option]);
    return {
      text: `資料為 ${values.join("、")}。請問${option}是多少？若有小數，請四捨五入到小數點後三位。`,
      answer,
      solution: `平均數 ${formatNumber(mean(values))}，中位數 ${formatNumber(median(values))}，眾數 ${formatNumber(mode(values))}，全距 ${formatNumber(answerMap["全距"])}。本題答案是 ${formatNumber(answer)}。`
    };
  }
};

function setQuestion(options = {}) {
  const generator = generators[lessonId];
  if (!generator) return;
  currentQuestion = generator();
  missCount = 0;
  document.querySelector("[data-question-text]").textContent = currentQuestion.text;
  document.querySelector("[data-feedback]").textContent = "";
  const solution = document.querySelector("[data-solution]");
  solution.textContent = currentQuestion.solution;
  solution.hidden = true;
  const input = document.querySelector("[data-answer-input]");
  input.value = "";
  if (options.focusInput) input.focus();
}

function buildBottomNavigation() {
  const main = document.querySelector(".lesson-main");
  const topLinks = document.querySelector(".lesson-header .nav-links");
  if (!main || !topLinks || document.querySelector("[data-bottom-navigation]")) return;

  const bottomNav = document.createElement("nav");
  bottomNav.className = "lesson-bottom-nav lesson-card";
  bottomNav.setAttribute("aria-label", "課後導覽");
  bottomNav.dataset.bottomNavigation = "true";

  const title = document.createElement("p");
  title.className = "kicker";
  title.textContent = "Navigation";

  const heading = document.createElement("h2");
  heading.textContent = "接下來";

  const links = document.createElement("div");
  links.className = "nav-links";
  [...topLinks.querySelectorAll("a")].forEach((link) => {
    links.appendChild(link.cloneNode(true));
  });

  bottomNav.append(title, heading, links);
  main.appendChild(bottomNav);
}

function checkAnswer(event) {
  event.preventDefault();
  const input = document.querySelector("[data-answer-input]");
  const feedback = document.querySelector("[data-feedback]");
  const value = Number(input.value.trim());
  if (!Number.isFinite(value)) {
    feedback.textContent = "紅敲了敲桌面：先輸入一個數字。";
    feedback.className = "feedback is-wrong";
    return;
  }
  if (Math.abs(value - currentQuestion.answer) < 0.001) {
    feedback.textContent = "正確。紅點頭：這一步你有照規則走。";
    feedback.className = "feedback is-correct";
    return;
  }
  missCount += 1;
  feedback.textContent = missCount >= 2
    ? "紅把提示移近一點：先把規則、限制或資料位置寫出來。"
    : "還不對。紅提醒你：先判斷題目在問數列、方程、函數、計數、機率，還是統計量。";
  feedback.className = "feedback is-wrong";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!lessonId || !generators[lessonId]) return;
  buildBottomNavigation();
  document.querySelector("[data-answer-form]")?.addEventListener("submit", checkAnswer);
  document.querySelector("[data-new-question]")?.addEventListener("click", () => setQuestion({ focusInput: true }));
  document.querySelector("[data-show-solution]")?.addEventListener("click", () => {
    document.querySelector("[data-solution]").hidden = false;
  });
  setQuestion();
});
