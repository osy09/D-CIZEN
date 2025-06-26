// D-CiZen 학습 페이지 JavaScript

// 전역 상태
let currentLevel = 'child';
let progressData = {
  child: { completed: 3, total: 8 },
  teen: { completed: 5, total: 10 },
  adult: { completed: 2, total: 6 }
};

// DOM 요소들
let levelTabs = null;
let levelContents = null;
let progressBars = null;

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
  initializeLearnPage();
});

// 학습 페이지 초기화
function initializeLearnPage() {
  // DOM 요소 초기화
  initializeDOMElements();
  
  // 로그인 상태 확인 및 버튼 업데이트
  updateLoginButton();
  
  // 로그인 상태 확인 및 네비게이션 업데이트
  updateNavigation();
  
  // 레벨 탭 기능 초기화
  initializeLevelTabs();
  
  // URL 파라미터 확인하여 특정 레벨로 이동
  checkURLParameters();
  
  // 진행 현황 업데이트
  updateProgressDisplay();
  
  // 스크롤 헤더 효과
  setupScrollEffects();
  
  // 페이지 애니메이션
  animatePageEntry();
  
  // 학습 카드 이벤트 설정
  setupLearningCards();
}

// DOM 요소 초기화
function initializeDOMElements() {
  levelTabs = document.querySelectorAll('.level-tab');
  levelContents = document.querySelectorAll('.level-content');
  progressBars = document.querySelectorAll('.progress-fill');
}

// 로그인 상태에 따라 버튼 업데이트
function updateLoginButton() {
  const loginBtn = document.querySelector('.login-btn');
  const isLoggedIn = checkLoginStatus();
  
  if (loginBtn) {
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      loginBtn.textContent = user.name || '테스트사용자';
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
        this.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
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

// 로그인 상태 확인 (메인 페이지와 동일한 로직)
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

// 레벨 탭 기능 초기화
function initializeLevelTabs() {
  if (!levelTabs) return;
  
  levelTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const level = this.getAttribute('data-level');
      if (level && level !== currentLevel) {
        switchLevel(level);
      }
    });
  });
  
  // 첫 번째 탭 활성화
  if (levelTabs.length > 0) {
    const firstTab = levelTabs[0];
    const firstLevel = firstTab.getAttribute('data-level');
    if (firstLevel) {
      switchLevel(firstLevel);
    }
  }
}

// 레벨 전환
function switchLevel(level) {
  currentLevel = level;
  
  // 탭 활성화 상태 업데이트
  levelTabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.getAttribute('data-level') === level) {
      tab.classList.add('active');
    }
  });
  
  // 콘텐츠 표시/숨김
  levelContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === `content-${level}`) {
      content.classList.add('active');
      
      // 콘텐츠 나타나는 애니메이션
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px)';
      
      requestAnimationFrame(() => {
        content.style.transition = 'all 0.5s ease';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      });
    }
  });
  
  // 진행률 업데이트
  updateProgressDisplay();
  
  // 탭 클릭 애니메이션
  const activeTab = document.querySelector(`[data-level="${level}"]`);
  if (activeTab) {
    activeTab.style.transform = 'scale(0.95)';
    setTimeout(() => {
      activeTab.style.transform = 'scale(1)';
    }, 150);
  }
}

// 진행 현황 업데이트
function updateProgressDisplay() {
  const progressContainer = document.querySelector('.progress-overview');
  if (!progressContainer || !progressData[currentLevel]) return;
  
  const data = progressData[currentLevel];
  const percentage = Math.round((data.completed / data.total) * 100);
  
  // 진행률 바 업데이트
  const progressBar = progressContainer.querySelector('.progress-fill');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
    progressBar.style.transition = 'width 0.8s ease';
  }
  
  // 텍스트 업데이트
  const progressText = progressContainer.querySelector('.progress-text');
  if (progressText) {
    progressText.textContent = `${data.completed}/${data.total} 완료 (${percentage}%)`;
  }
  
  // 레벨별 제목 업데이트
  const levelTitle = progressContainer.querySelector('h3');
  if (levelTitle) {
    const levelNames = {
      child: '아동 (7-12세)',
      teen: '청소년 (13-18세)',
      adult: '성인 (19세 이상)'
    };
    levelTitle.textContent = `${levelNames[currentLevel]} 학습 진행률`;
  }
}

// URL 파라미터 확인하여 특정 레벨로 이동
function checkURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const level = urlParams.get('level');
  
  if (level && ['child', 'teen', 'adult'].includes(level)) {
    // URL에서 지정된 레벨로 전환
    switchLevel(level);
    
    // 해당 섹션으로 스크롤
    const levelSection = document.querySelector('.level-selection');
    if (levelSection) {
      levelSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// 학습 카드 이벤트 설정
function setupLearningCards() {
  // 모든 학습 시작하기 버튼에 이벤트 추가
  const courseButtons = document.querySelectorAll('.course-btn');
  const ctaButtons = document.querySelectorAll('.cta-buttons .btn-primary');
  
  // 강의 카드의 학습 시작하기 버튼들
  courseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const courseTitle = this.closest('.course-card').querySelector('h3')?.textContent || '학습 콘텐츠';
      
      // 클릭 애니메이션
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // 로그인 확인
      if (!checkLoginStatus()) {
        showNotification('로그인이 필요한 서비스입니다.', 'error');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        return;
      }
      
      // 학습 시작 확인
      if (confirm(`"${courseTitle}" 학습을 시작하시겠습니까?`)) {
        showNotification('학습을 시작합니다!', 'success');
        
        // YouTube 링크로 이동
        setTimeout(() => {
          window.open('https://youtu.be/SdP-Fy4mqAE?feature=shared', '_blank');
        }, 1000);
      }
    });
  });
  
  // CTA 섹션의 학습 시작하기 버튼
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 클릭 애니메이션
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // 로그인 확인
      if (!checkLoginStatus()) {
        showNotification('로그인이 필요한 서비스입니다.', 'error');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        return;
      }
      
      // 학습 시작 확인
      if (confirm('디지털 시민의식 학습을 시작하시겠습니까?')) {
        showNotification('학습을 시작합니다!', 'success');
        
        // YouTube 링크로 이동
        setTimeout(() => {
          window.open('https://youtu.be/SdP-Fy4mqAE?feature=shared', '_blank');
        }, 1000);
      }
    });
  });
  
  // 학습 카드 호버 효과
  const learningCards = document.querySelectorAll('.course-card');
  learningCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
    });
  });
}

// 스크롤 헤더 효과
function setupScrollEffects() {
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop;
    });
  }
}

// 페이지 진입 애니메이션
function animatePageEntry() {
  const animatedElements = document.querySelectorAll('.card, .learning-card, .level-tab');
  
  animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      el.style.transition = 'all 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

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

// 전역 함수로 내보내기
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.showNotification = showNotification;
window.updateLoginButton = updateLoginButton;
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.showNotification = showNotification;