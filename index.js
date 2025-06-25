// D-CiZen 메인 페이지 JavaScript

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
  initializeMainPage();
});

// 메인 페이지 초기화
function initializeMainPage() {
  // window.open() 팝업 표시 (0.1초 후)
  setTimeout(() => {
    showWindowPopup();
  }, 100);
  
  updateLoginButton();
  initializeAnimations();
  initializeScrollEffects();
}

// 로그인 상태에 따라 버튼 업데이트
function updateLoginButton() {
  const loginBtn = document.querySelector('.login-btn');
  const isLoggedIn = checkLoginStatus();
  
  if (loginBtn) {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      loginBtn.textContent = user.name || '로그아웃';
      loginBtn.disabled = false;
      loginBtn.style.opacity = '1';
      loginBtn.style.cursor = 'pointer';
      loginBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      loginBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
      
      // 로그아웃 이벤트 추가
      loginBtn.onclick = function() {
        if (confirm('로그아웃 하시겠습니까?')) {
          logout();
        }
      };
      
      // 호버 효과
      loginBtn.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
      });
      
      loginBtn.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100())';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
      });
    } else {
      loginBtn.textContent = '로그인';
      loginBtn.disabled = false;
      loginBtn.style.opacity = '1';
      loginBtn.style.cursor = 'pointer';
      loginBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
      loginBtn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
      
      // 로그인 페이지로 이동
      loginBtn.onclick = function() {
        window.location.href = 'login.html';
      };
      
      // 호버 효과
      loginBtn.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
      });
      
      loginBtn.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
      });
    }
  }
}

// 로그인 상태 확인 (login.js와 동일한 로직)
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

// 로그아웃 함수
function logout() {
  localStorage.removeItem('isLogin');
  localStorage.removeItem('user');
  localStorage.removeItem('loginTime');
  
  // 성공 메시지 표시
  showNotification('로그아웃되었습니다.', 'success');
  
  // 페이지 새로고침으로 버튼 상태 업데이트
  setTimeout(() => {
    location.reload();
  }, 1000);
}

// 알림 메시지 표시
function showNotification(message, type = 'info') {
  // 기존 알림 제거
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // 새 알림 생성
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // 스타일 적용
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
  
  // 타입별 색상
  if (type === 'success') {
    notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  } else if (type === 'error') {
    notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  } else {
    notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  }
  
  // DOM에 추가
  document.body.appendChild(notification);
  
  // 애니메이션 시작
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  });
  
  // 3초 후 제거
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

// 애니메이션 초기화
function initializeAnimations() {
  // 스크롤 시 요소들이 나타나는 효과
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // 관찰할 요소들 설정
  const animatedElements = document.querySelectorAll('.card, .cardg, .quiz-container');
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
  });
}

// 스크롤 효과 초기화
function initializeScrollEffects() {
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 헤더 숨김/표시 효과
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // 아래로 스크롤 - 헤더 숨김
      header.style.transform = 'translateY(-100%)';
    } else {
      // 위로 스크롤 - 헤더 표시
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// window.open()을 사용한 새 창 팝업
function showWindowPopup() {
  // 팝업 차단 확인
  let popup;
  
  try {
    // 새 창 열기
    popup = window.open('', 'D-CiZen_Info', 'width=500,height=600,left=100,top=100,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no');
    
    if (!popup) {
      // 팝업이 차단된 경우 알림
      showNotification('팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요.', 'error');
      return;
    }

    // 팝업 창에 HTML 내용 작성
    popup.document.write(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>D-CiZen 사이트 정보</title>
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
          }
          
          .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px;
            text-align: center;
            border-bottom: 2px solid rgba(37, 99, 235, 0.3);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }
          
          .logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 10px;
          }
          
          .logo svg {
            filter: drop-shadow(0 2px 4px rgba(37, 99, 235, 0.3));
          }
          
          .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: #2563eb;
            text-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
          }
          
          .subtitle {
            color: #6b7280;
            font-size: 14px;
            margin-top: 5px;
          }
          
          .content {
            flex: 1;
            padding: 30px 25px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            margin: 20px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }
          
          .welcome {
            text-align: center;
            margin-bottom: 25px;
          }
          
          .welcome h2 {
            color: #1f2937;
            font-size: 22px;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .info-section {
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 12px;
            border-left: 4px solid #2563eb;
          }
          
          .info-section h3 {
            color: #374151;
            font-size: 16px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .info-grid {
            display: grid;
            gap: 12px;
          }
          
          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(156, 163, 175, 0.3);
          }
          
          .info-item:last-child {
            border-bottom: none;
          }
          
          .info-label {
            font-weight: 600;
            color: #4b5563;
            font-size: 14px;
          }
          
          .info-value {
            color: #2563eb;
            font-weight: 500;
            font-size: 14px;
          }
          
          .features {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-left-color: #10b981;
          }
          
          .feature-list {
            list-style: none;
            padding: 0;
          }
          
          .feature-list li {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px 0;
            color: #065f46;
            font-size: 14px;
          }
          
          .feature-list li::before {
            content: "✓";
            background: #10b981;
            color: white;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          }
          
          .footer {
            text-align: center;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(156, 163, 175, 0.3);
          }
          
          .btn {
            background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            margin: 0 5px;
          }
          
          .btn:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          }
          
          .btn-secondary {
            background: #f3f4f6;
            color: #374151;
            border: 1px solid #d1d5db;
          }
          
          .btn-secondary:hover {
            background: #e5e7eb;
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          
          .animated {
            animation: fadeInUp 0.6s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .pulse {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        </style>
      </head>
      <body>
        <div class="header animated">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3 L33 8 V18 C33 27 19 35 19 35 C19 35 5 27 5 18 V8 Z" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
              <circle cx="19" cy="14" r="3" fill="#fff"/>
              <rect x="16" y="17" width="6" height="7" rx="3" fill="#fff"/>
              <circle cx="11" cy="23" r="2" fill="#60a5fa"/>
              <circle cx="27" cy="23" r="2" fill="#60a5fa"/>
              <line x1="14" y1="23" x2="24" y2="23" stroke="#60a5fa" stroke-width="1.5"/>
            </svg>
            <span class="logo-text">D-CiZen</span>
          </div>
          <div class="subtitle">디지털 시민의식 교육 플랫폼</div>
        </div>
        
        <div class="content animated">
          <div class="welcome">
            <h2>🎓 수행평가 프로젝트 안내</h2>
            <p>디지털 시민의식 향상을 위한 교육 웹사이트입니다.</p>
          </div>
          
          <div class="info-section">
            <h3><i class="ri-information-line"></i> 프로젝트 정보</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">학교</span>
                <span class="info-value">대구소프트웨어 마이스터고등학교</span>
              </div>
              <div class="info-item">
                <span class="info-label">과목</span>
                <span class="info-value">웹 기초</span>
              </div>
              <div class="info-item">
                <span class="info-label">유형</span>
                <span class="info-value">수행평가</span>
              </div>
              <div class="info-item">
                <span class="info-label">주제</span>
                <span class="info-value">디지털 시민의식 교육</span>
              </div>
              <div class="info-item">
                <span class="info-label">제작일</span>
                <span class="info-value">2025년 6월</span>
              </div>
            </div>
          </div>
          
          <div class="info-section features">
            <h3><i class="ri-star-line"></i> 주요 기능</h3>
            <ul class="feature-list">
              <li>연령별 맞춤 디지털 시민의식 교육</li>
              <li>자가진단 테스트 및 결과 분석</li>
              <li>실제 사례 기반 학습 콘텐츠</li>
              <li>커뮤니티 토론 및 경험 공유</li>
              <li>신고 시스템 및 도움말 센터</li>
            </ul>
          </div>
        </div>
        
        <div class="footer animated">
          <button class="btn" onclick="window.opener.focus(); window.close();">
            <i class="ri-home-line"></i>
            메인 사이트로 돌아가기
          </button>
          <button class="btn btn-secondary" onclick="window.close();">
            <i class="ri-close-line"></i>
            창 닫기
          </button>
        </div>
        
        <script>
          // 창이 로드된 후 애니메이션 실행
          window.onload = function() {
            setTimeout(() => {
              document.querySelectorAll('.animated').forEach((el, index) => {
                el.style.animationDelay = (index * 0.2) + 's';
              });
            }, 100);
          };
          
          // 키보드 단축키
          document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
              window.close();
            }
            if (e.ctrlKey && e.key === 'w') {
              e.preventDefault();
              window.close();
            }
          });
        </script>
      </body>
      </html>
    `);
    
    popup.document.close();
    
    // 팝업 창에 포커스
    popup.focus();
    
    // 성공 알림
    showNotification('새 창에서 상세 정보를 확인하세요!', 'info');
    
  } catch (error) {
    console.error('팝업 창 생성 중 오류 발생:', error);
    showNotification('팝업 창을 열 수 없습니다.', 'error');
  }
}

// 전역 함수로 내보내기
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.showNotification = showNotification;
window.showWindowPopup = showWindowPopup;
