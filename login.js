// 간단한 프론트엔드 로그인/로그아웃 예시 (서버 없이 동작)

// 로그인 폼 요소
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginSuccess = document.getElementById('loginSuccess');

// 데모 계정 (아이디: testuser, 비밀번호: 1234)
const DEMO_USER = { username: "testuser", password: "1234" };

// 로그인 폼 제출 이벤트
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    loginError.style.display = "none";
    loginSuccess.style.display = "none";

    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;

    if (!username || !password) {
      loginError.textContent = "아이디와 비밀번호를 모두 입력하세요.";
      loginError.style.display = "block";
      return;
    }

    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      // 로그인 성공 시 localStorage에 상태 저장
      localStorage.setItem('isLogin', 'true');
      loginSuccess.textContent = "로그인 성공! 환영합니다.";
      loginSuccess.style.display = "block";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    } else {
      loginError.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
      loginError.style.display = "block";
    }
  });
}

// 로그아웃 버튼이 있을 경우 로그아웃 기능 연결
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('isLogin');
    window.location.href = "login.html";
  });
}

// 페이지 진입 시 로그인 상태 체크(예시: 로그인 필요 페이지에서 사용)
function requireLogin() {
  if (!localStorage.getItem('isLogin')) {
    window.location.href = "login.html";
  }
}
// 필요시 requireLogin()을 호출해서 로그인 상태가 아니면 로그인 페이지로 이동하게 할