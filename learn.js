// 로그인/로그아웃 버튼 상태 관리
function updateAuthButtons() {
  const isLogin = localStorage.getItem('isLogin');
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  if (isLogin) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

document.getElementById('loginBtn').addEventListener('click', function() {
  window.location.href = "login.html";
});

document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('isLogin');
  updateAuthButtons();
  // 필요시 메인에서 로그아웃 후 로그인 페이지로 이동하려면 아래 주석 해제
  // window.location.href = "login.html";
});

// 연령별 토글 기능
const toggleBtns = document.querySelectorAll('.age-toggle-btn');
const ageContents = document.querySelectorAll('.age-content');

toggleBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    // 버튼 활성화 표시
    toggleBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // 콘텐츠 표시
    const age = btn.getAttribute('data-age');
    ageContents.forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById('content-' + age).classList.add('active');
  });
});

updateAuthButtons();