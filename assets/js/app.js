const PROFILE_KEY = "contractReviewRoom.profile";
const fallbackName = "沈以寧";
const lessonLabels = {
  "b1-1-1": "B1 1-1 數線與絕對值",
  "b1-1-2": "B1 1-2 平面坐標系與線型函數",
  "b1-1-3": "B1 1-3 二次函數",
  "b1-1-4": "B1 1-4 一元二次不等式",
  "b1-2-1": "B1 2-1 斜率",
  "b1-2-2": "B1 2-2 直線方程式",
  "b1-2-3": "B1 2-3 直線的一般式與點到直線的距離",
  "b1-3-1": "B1 3-1 多項式的基本概念與四則運算",
  "b1-3-2": "B1 3-2 除法原理與餘式定理",
  "b1-3-3": "B1 3-3 因式分解與分式",
  "b2-1-1": "B2 1-1 角度的基本性質",
  "b2-1-2": "B2 1-2 銳角三角函數",
  "b2-1-3": "B2 1-3 任意角的三角函數",
  "b2-1-4": "B2 1-4 正弦、餘弦函數的圖形",
  "b2-2-1": "B2 2-1 正弦定理與餘弦定理",
  "b2-2-2": "B2 2-2 三角測量",
  "b2-3-1": "B2 3-1 向量的作圖",
  "b2-3-2": "B2 3-2 向量的坐標表示法",
  "b2-3-3": "B2 3-3 向量的內積",
  "b2-4-1": "B2 4-1 圓方程式",
  "b2-4-2": "B2 4-2 圓與直線的關係",
  "b3-1-1": "B3 1-1 等差數列與等差級數",
  "b3-1-2": "B3 1-2 等比數列與等比級數",
  "b3-2-1": "B3 2-1 一元一次方程式與一元一次不等式",
  "b3-2-2": "B3 2-2 一元二次方程式",
  "b3-3-1": "B3 3-1 二元一次聯立方程組",
  "b3-3-2": "B3 3-2 二元一次不等式",
  "b3-3-3": "B3 3-3 線性規劃",
  "b3-4-1": "B3 4-1 指數",
  "b3-4-2": "B3 4-2 指數函數及其圖形",
  "b3-4-3": "B3 4-3 對數",
  "b3-4-4": "B3 4-4 對數函數及其圖形",
  "b4-1-1": "B4 1-1 加法原理與乘法原理",
  "b4-1-2": "B4 1-2 直線排列",
  "b4-1-3": "B4 1-3 重複排列",
  "b4-1-4": "B4 1-4 組合",
  "b4-1-5": "B4 1-5 二項式定理",
  "b4-2-1": "B4 2-1 樣本空間與事件",
  "b4-2-2": "B4 2-2 機率的運算",
  "b4-2-3": "B4 2-3 數學期望值",
  "b4-3-1": "B4 3-1 統計的基本概念",
  "b4-3-2": "B4 3-2 統計資料整理",
  "b4-3-3": "B4 3-3 統計量分析"
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProfile(name) {
  const profile = {
    userName: name,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

function applyName(name) {
  document.querySelectorAll("[data-user-name]").forEach((node) => {
    node.textContent = name || fallbackName;
  });
}

function showGate() {
  const gate = document.querySelector("[data-name-gate]");
  if (gate) {
    gate.classList.add("is-visible");
  }
}

function hideGate() {
  const gate = document.querySelector("[data-name-gate]");
  if (gate) {
    gate.classList.remove("is-visible");
  }
}

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ");
}

function applyPendingLesson() {
  const labelNode = document.querySelector("[data-lesson-label]");
  if (!labelNode) {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get("lesson");
  labelNode.textContent = lessonLabels[lessonId] || "尚未指定小節";
}

document.addEventListener("DOMContentLoaded", () => {
  const profile = loadProfile();
  const nameForm = document.querySelector("[data-name-form]");
  const nameInput = document.querySelector("#user-name");
  const resetButton = document.querySelector("[data-reset-name]");

  if (profile?.userName) {
    applyName(profile.userName);
    hideGate();
  } else {
    applyName(fallbackName);
    showGate();
  }

  nameForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const nextName = normalizeName(nameInput.value);
    if (!nextName) {
      return;
    }
    const nextProfile = saveProfile(nextName);
    applyName(nextProfile.userName);
    hideGate();
  });

  resetButton?.addEventListener("click", () => {
    const currentProfile = loadProfile();
    if (nameInput) {
      nameInput.value = currentProfile?.userName || "";
      window.setTimeout(() => nameInput.focus(), 0);
    }
    showGate();
  });

  applyPendingLesson();
});
