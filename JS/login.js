/**
 * ========================================
 * D-CiZen 로그인 시스템 (개선된 버전)
 * ========================================
 * 
 * 이 파일은 D-CiZen 로그인 페이지의 모든 기능을 관리합니다.
 * 주요 기능:
 * - 사용자 로그인 처리
 * - 입력값 검증
 * - 로딩 상태 관리
 * - 로그인 상태 저장 및 확인
 * - 자동 로그아웃 기능
 * 
 * 작성자: 대구소프트웨어마이스터고등학교 1학년 1반 오승윤, 조원진
 * 수행평가용 웹사이트 - 실제 서버 없이 클라이언트에서만 동작
 */

// ============= DOM 요소 선택 =============
// HTML에서 로그인 관련 요소들을 찾아서 변수에 저장합니다
const loginForm = document.getElementById('loginForm');     // 로그인 폼
const loginError = document.getElementById('loginError');   // 에러 메시지 표시 영역
const loginSuccess = document.getElementById('loginSuccess'); // 성공 메시지 표시 영역
const submitButton = loginForm?.querySelector('button[type="submit"]'); // 로그인 버튼

// ============= 데모 계정 정보 =============
// 실제 서비스에서는 서버에서 관리하지만, 여기서는 데모용으로 하드코딩
const DEMO_USER = { 
  username: "testuser",    // 데모 아이디
  password: "1234"         // 데모 비밀번호
};

/**
 * ========================================
 * 유틸리티 함수들 (도구 함수들)
 * ========================================
 */

/**
 * 메시지를 사용자에게 표시하는 함수
 * 기존의 alert 대신 예쁜 알림을 사용합니다
 * 
 * @param {HTMLElement} element - 메시지를 표시할 HTML 요소 (현재는 사용하지 않음)
 * @param {string} message - 표시할 메시지 내용
 * @param {boolean} isError - true면 에러 메시지, false면 성공 메시지
 */
function showMessage(element, message, isError = false) {
  // 새로운 알림 시스템을 사용합니다 (메인 페이지와 동일)
  const type = isError ? 'error' : 'success';
  showNotification(message, type);
  
  // 기존 메시지 요소는 숨깁니다 (새 알림 시스템을 사용하므로)
  if (element) {
    element.style.display = "none";
  }
}

/**
 * 기존 에러/성공 메시지를 숨기는 함수
 */
function hideMessages() {
  loginError.style.display = "none";
  loginSuccess.style.display = "none";
}

/**
 * 로그인 버튼의 로딩 상태를 설정하는 함수
 * 로그인 처리 중일 때 버튼을 비활성화하고 "로그인 중..." 표시
 * 
 * @param {boolean} isLoading - true면 로딩 상태, false면 일반 상태
 */
function setLoading(isLoading) {
  if (submitButton) {
    submitButton.disabled = isLoading; // 버튼 비활성화/활성화
    
    if (isLoading) {
      // 로딩 상태일 때
      submitButton.classList.add('loading');
      submitButton.innerHTML = '<i class="ri-loader-2-line"></i> 로그인 중...'; // 로딩 아이콘과 텍스트
    } else {
      // 일반 상태일 때
      submitButton.classList.remove('loading');
      submitButton.innerHTML = '<i class="ri-login-circle-line"></i> 로그인'; // 원래 아이콘과 텍스트
    }
  }
}

function validateInput(username, password) {
  if (!username || !password) {
    showMessage(loginError, "아이디와 비밀번호를 모두 입력하세요.", true);
    return false;
  }
  
  if (username.length < 3) {
    showMessage(loginError, "아이디는 3자 이상이어야 합니다.", true);
    return false;
  }
  
  if (password.length < 4) {
    showMessage(loginError, "비밀번호는 4자 이상이어야 합니다.", true);
    return false;
  }
  
  return true;
}

function authenticate(username, password) {
  // 실제 환경에서는 서버 API 호출
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === DEMO_USER.username && password === DEMO_USER.password) {
        resolve({ success: true, user: { username, name: "테스트 사용자" } });
      } else {
        resolve({ success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." });
      }
    }, 1000); // 네트워크 지연 시뮬레이션
  });
}

function saveLoginState(user) {
  localStorage.setItem('isLogin', 'true');
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('loginTime', new Date().toISOString());
}

function redirectToMain() {
  setTimeout(() => {
    window.location.href = "main.html";
  }, 1500);
}

// 로그인 폼 제출 이벤트
if (loginForm) {
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    hideMessages();
    
    const username = loginForm.username.value.trim();
    const password = loginForm.password.value;
    
    // 입력 검증
    if (!validateInput(username, password)) {
      return;
    }
    
    // 로딩 상태 시작
    setLoading(true);
    
    try {
      // 인증 시도
      const result = await authenticate(username, password);
      
      if (result.success) {
        // 로그인 성공
        saveLoginState(result.user);
        showMessage(loginSuccess, `환영합니다, ${result.user.name}님! 메인 페이지로 이동합니다.`);
        
        // 폼 비활성화
        loginForm.querySelectorAll('input').forEach(input => input.disabled = true);
        
        // 메인 페이지로 리다이렉트
        redirectToMain();
      } else {
        // 로그인 실패
        showMessage(loginError, result.message, true);
      }
    } catch (error) {
      showMessage(loginError, "로그인 중 오류가 발생했습니다. 다시 시도해주세요.", true);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  });
}

// 입력 필드 실시간 검증
if (loginForm) {
  const inputs = loginForm.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      // 에러 메시지가 표시된 상태에서 입력하면 숨김
      if (loginError.style.display === 'block') {
        hideMessages();
      }
      
      // 입력 필드 스타일 개선
      if (this.value.trim()) {
        this.style.borderColor = '#3b82f6';
      } else {
        this.style.borderColor = '#e5e7eb';
      }
    });
    
    // 포커스 아웃 시 검증
    input.addEventListener('blur', function() {
      if (this.value.trim()) {
        this.style.borderColor = '#10b981';
      }
    });
  });
}

// 로그아웃 기능
function logout() {
  localStorage.removeItem('isLogin');
  localStorage.removeItem('user');
  localStorage.removeItem('loginTime');
  window.location.href = "login.html";
}

// 로그인 상태 확인
function checkLoginStatus() {
  const isLogin = localStorage.getItem('isLogin');
  const loginTime = localStorage.getItem('loginTime');
  
  if (isLogin && loginTime) {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const timeDiff = now - loginDate;
    
    // 24시간 후 자동 로그아웃
    if (timeDiff > 24 * 60 * 60 * 1000) {
      logout();
      return false;
    }
    return true;
  }
  return false;
}

// 로그인 필요 페이지 보호
function requireLogin() {
  if (!checkLoginStatus()) {
    alert('로그인이 필요한 서비스입니다.');
    window.location.href = "login.html";
  }
}

// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', function() {
  // 이미 로그인된 상태라면 메인 페이지로 리다이렉트
  if (window.location.pathname.includes('login.html') && checkLoginStatus()) {
    window.location.href = "main.html";
  }
});

// 전역 함수로 내보내기
window.logout = logout;
window.requireLogin = requireLogin;
window.checkLoginStatus = checkLoginStatus;

// 알림 메시지 표시 (메인 페이지와 동일)
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '100px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '0.75rem',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.9rem',
    zIndex: '1000',
    opacity: '0',
    transform: 'translateX(100%)',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
  });
  
  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  } else if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  } else {
    notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  }
  
  document.body.appendChild(notification);
  
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  });
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

window.showNotification = showNotification;