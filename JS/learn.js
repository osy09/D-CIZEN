/**
 * ========================================
 * D-CiZen 학습 페이지 JavaScript
 * ========================================
 * 
 * 이 파일은 D-CiZen 학습 페이지의 모든 기능을 관리합니다.
 * 주요 기능:
 * - 연령대별 학습 콘텐츠 탭 전환 (초등학생/중고등학생/성인)
 * - 학습 진행 현황 표시
 * - 로그인 상태 관리
 * - 학습 카드 상호작용
 * - 페이지 애니메이션 효과
 * 
 * 작성자: 대구소프트웨어마이스터고등학교 1학년 1반 오승윤, 조원진
 * 수행평가용 웹사이트
 */

// ============= 전역 상태 변수들 =============
let currentLevel = 'child'; // 현재 선택된 학습 레벨 ('child', 'teen', 'adult')

// 각 연령대별 학습 진행 데이터 (실제로는 서버에서 가져올 데이터)
let progressData = {
  child: { completed: 2, total: 3 }, // 초등학생: 3개 중 2개 완료
  teen: { completed: 1, total: 3 },  // 중고등학생: 3개 중 1개 완료
  adult: { completed: 0, total: 3 }  // 성인: 3개 중 0개 완료
};

// ============= DOM 요소들을 저장할 변수들 =============
// 페이지 로드 후 HTML 요소들을 찾아서 저장할 예정
let levelTabs = null;     // 레벨 선택 탭들 (초등학생, 중고등학생, 성인 버튼)
let levelContents = null; // 레벨별 콘텐츠 영역들
let progressBars = null;  // 진행률 표시 바들

/**
 * ========================================
 * 메인 초기화 함수
 * ========================================
 * DOM이 로드되면 실행되는 메인 함수
 */
document.addEventListener('DOMContentLoaded', function() {
  initializeLearnPage(); // 학습 페이지 초기화 함수 호출
});

/**
 * 학습 페이지의 모든 기능을 초기화하는 메인 함수
 * 페이지가 로드될 때 필요한 모든 설정을 순서대로 실행합니다
 */
function initializeLearnPage() {
  // 1. DOM 요소들을 찾아서 변수에 저장
  initializeDOMElements();
  
  // 2. 로그인 상태를 확인하고 헤더의 로그인 버튼 업데이트
  updateLoginButton();
  
  // 3. 네비게이션 메뉴에서 현재 페이지 표시 업데이트
  updateNavigation();
  
  // 4. 레벨 탭 기능 초기화 (초등학생/중고등학생/성인 버튼)
  initializeLevelTabs();
  
  // 5. URL 파라미터 확인하여 특정 레벨로 이동 (예: ?level=teen)
  checkURLParameters();
  
  // 6. 학습 진행 현황 표시 업데이트
  updateProgressDisplay();
  
  // 7. 스크롤에 따른 헤더 효과 설정
  setupScrollEffects();
  
  // 8. 페이지 진입 시 애니메이션 효과
  animatePageEntry();
  
  // 9. 학습 카드들의 클릭/호버 이벤트 설정
  setupLearningCards();
}

/**
 * ========================================
 * DOM 요소 초기화 함수
 * ========================================
 * HTML에서 필요한 요소들을 찾아서 전역 변수에 저장합니다
 */
function initializeDOMElements() {
  // 레벨 선택 탭들을 모두 찾아서 저장 (.level-tab 클래스를 가진 모든 요소)
  levelTabs = document.querySelectorAll('.level-tab');
  
  // 레벨별 콘텐츠 영역들을 모두 찾아서 저장 (.level-content 클래스를 가진 모든 요소)
  levelContents = document.querySelectorAll('.level-content');
  
  // 진행률 표시 바들을 모두 찾아서 저장 (.progress-fill 클래스를 가진 모든 요소)
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

/**
 * ========================================
 * 레벨 탭 기능 초기화 함수
 * ========================================
 * 초등학생, 중고등학생, 성인 버튼들에 클릭 이벤트를 추가합니다
 */
function initializeLevelTabs() {
  // DOM 요소들을 다시 확인 (페이지 로드 후 확실히 존재하는지 재확인)
  levelTabs = document.querySelectorAll('.level-tab');
  levelContents = document.querySelectorAll('.level-content');
  
  // 레벨 탭이 존재하지 않으면 에러를 출력하고 함수 종료
  if (!levelTabs || levelTabs.length === 0) {
    console.error('레벨 탭을 찾을 수 없습니다.');
    return;
  }
  
  // 각 레벨 탭에 클릭 이벤트 리스너를 추가합니다
  levelTabs.forEach((tab, index) => {
    // 각 탭의 data-level 속성에서 레벨 정보를 가져옵니다
    // 예: data-level="child", data-level="teen", data-level="adult"
    const level = tab.getAttribute('data-level');
    
    // 탭 클릭 이벤트 추가
    tab.addEventListener('click', function(e) {
      e.preventDefault(); // 링크의 기본 동작 방지
      
      // 클릭한 레벨이 현재 레벨과 다르면 레벨을 전환합니다
      if (level && level !== currentLevel) {
        switchLevel(level); // 레벨 전환 함수 호출
      }
    });
  });
  
  // 페이지 로드 시 첫 번째 탭을 기본으로 활성화
  if (levelTabs.length > 0) {
    const firstTab = levelTabs[0];
    const firstLevel = firstTab.getAttribute('data-level');
    if (firstLevel) {
      switchLevel(firstLevel); // 첫 번째 레벨로 전환
    }
  }
}

/**
 * ========================================
 * 레벨 전환 함수
 * ========================================
 * 사용자가 다른 연령대 탭을 클릭했을 때 해당 콘텐츠로 전환합니다
 * 
 * @param {string} level - 전환할 레벨 ('child', 'teen', 'adult')
 */
function switchLevel(level) {
  currentLevel = level; // 전역 변수 업데이트
  
  // ============= 탭 활성화 상태 업데이트 =============
  levelTabs.forEach(tab => {
    // 모든 탭에서 active 클래스 제거
    tab.classList.remove('active');
    
    // 현재 선택된 레벨의 탭에만 active 클래스 추가
    const tabLevel = tab.getAttribute('data-level');
    if (tabLevel === level) {
      tab.classList.add('active');
    }
  });
  
  // ============= 콘텐츠 표시/숨김 처리 =============
  levelContents.forEach(content => {
    // 모든 콘텐츠에서 active 클래스 제거 (숨김)
    content.classList.remove('active');
    
    // 현재 선택된 레벨의 콘텐츠만 active 클래스 추가 (표시)
    const contentId = `content-${level}`; // 예: "content-child"
    if (content.id === contentId) {
      content.classList.add('active');
      
      // ============= 콘텐츠 나타나는 애니메이션 =============
      // 처음에는 투명하고 아래로 20px 이동된 상태
      content.style.opacity = '0';
      content.style.transform = 'translateY(20px)';
      
      // 다음 프레임에서 원래 위치로 부드럽게 이동
      requestAnimationFrame(() => {
        content.style.transition = 'all 0.5s ease'; // 0.5초 동안 부드럽게
        content.style.opacity = '1';                 // 완전 불투명
        content.style.transform = 'translateY(0)';   // 원래 위치
      });
    }
  });
  
  // ============= 진행률 표시 업데이트 =============
  updateProgressDisplay();
  
  // ============= 탭 클릭 애니메이션 효과 =============
  const activeTab = document.querySelector(`[data-level="${level}"]`);
  if (activeTab) {
    // 탭을 살짝 축소했다가 다시 원래 크기로 (클릭 피드백)
    activeTab.style.transform = 'scale(0.95)';
    setTimeout(() => {
      activeTab.style.transform = 'scale(1)';
    }, 150); // 0.15초 후 원래 크기로
  }
}

// 진행 현황 업데이트
function updateProgressDisplay() {
  if (!progressData[currentLevel]) return;
  
  const data = progressData[currentLevel];
  const percentage = Math.round((data.completed / data.total) * 100);
  
  // 완료한 강의 수 업데이트
  const completedNumberEl = document.querySelector('.progress-card:first-child .progress-number');
  if (completedNumberEl) {
    completedNumberEl.innerHTML = `${data.completed}<span>/${data.total}</span>`;
  }
  
  // 진행률 바 업데이트
  const progressBar = document.querySelector('.progress-fill');
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
    progressBar.style.transition = 'width 0.8s ease';
  }
  
  // 학습 시간 업데이트 (예시 데이터)
  const studyTimeEl = document.querySelector('.progress-card:nth-child(2) .progress-number');
  if (studyTimeEl) {
    const studyTime = data.completed * 15; // 각 강의당 15분 가정
    studyTimeEl.innerHTML = `${studyTime}<span>분</span>`;
  }
  
  // 획득한 배지 수 업데이트
  const badgeCountEl = document.querySelector('.progress-card:nth-child(3) .progress-number');
  if (badgeCountEl) {
    const badges = Math.floor(data.completed / 3); // 3개 강의마다 배지 1개
    badgeCountEl.innerHTML = `${badges}<span>개</span>`;
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

/**
 * ========================================
 * 네비게이션 업데이트 함수
 * ========================================
 * 현재 페이지에 해당하는 네비게이션 메뉴에 'active' 클래스를 추가합니다
 */
function updateNavigation() {
  // 네비게이션의 모든 링크를 찾습니다
  const navLinks = document.querySelectorAll('nav a');
  
  // 현재 페이지의 파일명을 가져옵니다 (예: "learn.html")
  const currentPage = window.location.pathname.split('/').pop();
  
  // 각 네비게이션 링크를 확인합니다
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // 링크의 href가 현재 페이지와 일치하면 active 클래스 추가
    if (href && href.includes(currentPage)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
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