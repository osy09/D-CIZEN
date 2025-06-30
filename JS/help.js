/**
 * ========================================
 * D-CiZen 도움말 및 고객지원 페이지 JavaScript
 * ========================================
 * 
 * 이 파일은 D-CiZen 도움말 페이지의 모든 기능을 관리합니다.
 * 주요 기능:
 * - FAQ(자주 묻는 질문) 아코디언 기능
 * - 문의하기 폼 처리
 * - 신고하기 기능
 * - 로그인 상태 관리
 * - 페이지 애니메이션 효과
 * 
 * 작성자: 대구소프트웨어마이스터고등학교 1학년 1반 오승윤, 조원진
 * 수행평가용 웹사이트
 */

// ============= 전역 상태 변수 =============
let faqItems = []; // FAQ 아이템들을 저장할 배열

// ============= DOM 요소 선택 =============
const contactForm = document.getElementById('contactForm'); // 문의하기 폼

/**
 * ========================================
 * 메인 초기화 함수
 * ========================================
 * DOM이 로드되면 실행되는 메인 함수
 */
document.addEventListener('DOMContentLoaded', function() {
  // 1. 로그인 상태를 확인하고 헤더의 로그인 버튼 업데이트
  updateLoginButton();
  
  // 2. 네비게이션 메뉴에서 현재 페이지 표시 업데이트
  updateNavigation();
  
  // 3. FAQ 아코디언 기능 초기화 (질문 클릭 시 답변 펼치기/접기)
  initializeFAQ();
  
  // 4. 문의하기 폼의 이벤트 리스너 설정
  setupContactForm();
  
  // 5. 스크롤에 따른 헤더 효과 설정
  setupScrollEffects();
  
  // 6. 페이지 진입 시 애니메이션 효과
  animatePageEntry();
});

/**
 * ========================================
 * 네비게이션 및 로그인 상태 관리 함수들
 * ========================================
 */

/**
 * 로그인 상태에 따라 네비게이션 업데이트
 * 로그인 버튼의 텍스트와 기능을 사용자 상태에 맞게 변경합니다
 */
function updateNavigation() {
  const isLoggedIn = checkLoginStatus(); // 현재 로그인 상태 확인
  const loginBtn = document.querySelector('.login-btn'); // 로그인 버튼 찾기
  
  if (loginBtn) {
    if (isLoggedIn) {
      // ===== 로그인된 상태 =====
      // LocalStorage에서 사용자 정보를 가져와서 버튼에 표시
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      loginBtn.textContent = user.name || '테스트사용자'; // 사용자 이름 표시
      loginBtn.onclick = logout; // 클릭 시 로그아웃 함수 실행
      loginBtn.style.background = 'var(--gradient-accent)'; // 로그인 상태 색상으로 변경
    } else {
      // ===== 로그인되지 않은 상태 =====
      loginBtn.textContent = '로그인'; // "로그인" 텍스트 표시
      loginBtn.onclick = () => window.location.href = 'login.html'; // 클릭 시 로그인 페이지로 이동
    }
  }
}

/**
 * 로그인 상태 확인 함수
 * LocalStorage의 로그인 정보를 확인하고 24시간 세션 유효성을 검사합니다
 * 
 * @returns {boolean} true: 로그인됨, false: 로그인 안됨
 */
function checkLoginStatus() {
  const isLogin = localStorage.getItem('isLogin');     // 로그인 여부
  const loginTime = localStorage.getItem('loginTime'); // 로그인 시간
  
  if (isLogin && loginTime) {
    const loginDate = new Date(loginTime); // 로그인 시간을 Date 객체로 변환
    const now = new Date();                // 현재 시간
    const timeDiff = now - loginDate;      // 시간 차이 계산 (밀리초)
    
    // 24시간(24 * 60 * 60 * 1000ms) 후 자동 로그아웃
    if (timeDiff > 24 * 60 * 60 * 1000) {
      logout(); // 자동 로그아웃 실행
      return false;
    }
    return true; // 유효한 로그인 상태
  }
  return false; // 로그인 정보가 없음
}

/**
 * 로그아웃 처리 함수
 * 사용자 확인 후 로그인 정보를 삭제하고 페이지를 새로고침합니다
 */
function logout() {
  // 사용자에게 로그아웃 확인
  if (confirm('로그아웃 하시겠습니까?')) {
    // LocalStorage에서 로그인 관련 정보 모두 삭제
    localStorage.removeItem('isLogin');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    
    // 로그아웃 완료 알림 표시
    showNotification('로그아웃되었습니다.', 'success');
    
    // 1초 후 페이지 새로고침하여 로그인 상태 반영
    setTimeout(() => {
      location.reload();
    }, 1000);
  }
}

/**
 * ========================================
 * FAQ 아코디언 기능 초기화
 * ========================================
 * 자주 묻는 질문(FAQ) 섹션에서 질문을 클릭하면 답변이 펼쳐지거나 접히는 기능
 */
function initializeFAQ() {
  // HTML에서 모든 FAQ 아이템(.faq-item 클래스)을 찾습니다
  const faqItems = document.querySelectorAll('.faq-item');
  
  // 각 FAQ 아이템에 대해 클릭 이벤트를 설정합니다
  faqItems.forEach(item => {
    // 질문 부분(.faq-question)과 답변 부분(.faq-answer)을 찾습니다
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    // 질문 부분을 클릭했을 때 실행될 이벤트 리스너 추가
    question.addEventListener('click', function() {
      // 현재 아이템이 활성화(펼쳐진) 상태인지 확인
      const isActive = item.classList.contains('active');
      
      // ===== 다른 모든 FAQ 아이템 닫기 =====
      // 한 번에 하나의 FAQ만 열리도록 다른 모든 아이템을 닫습니다
      faqItems.forEach(otherItem => {
        if (otherItem !== item) { // 현재 클릭한 아이템이 아닌 경우
          otherItem.classList.remove('active'); // 닫힌 상태로 변경
        }
      });
      
      // ===== 현재 아이템 토글(열기/닫기) =====
      if (isActive) {
        // 이미 열려있다면 닫기
        item.classList.remove('active');
      } else {
        // 닫혀있다면 열기
        item.classList.add('active');
      }
      
      // ===== 클릭 피드백 애니메이션 =====
      // 버튼을 클릭했을 때 살짝 축소했다가 다시 확대하는 효과
      question.style.transform = 'scale(0.98)';
      setTimeout(() => {
        question.style.transform = 'scale(1)';
      }, 150); // 0.15초 후 원래 크기로
    });
  });
}

/**
 * ========================================
 * 문의하기 폼 설정 함수
 * ========================================
 * 사용자가 문의사항을 작성하고 제출할 때의 처리를 담당합니다
 */
function setupContactForm() {
  // 문의하기 폼이 존재하는지 확인
  if (contactForm) {
    // 폼 제출 이벤트 리스너 추가
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // 기본 제출 동작 방지 (페이지 새로고침 방지)
      
      // ===== 폼 데이터 수집 =====
      const formData = new FormData(contactForm); // 폼의 모든 데이터를 수집
      const data = {
        name: formData.get('name'),       // 이름
        email: formData.get('email'),     // 이메일
        subject: formData.get('subject'), // 제목
        message: formData.get('message')  // 문의 내용
      };
      
      // ===== 폼 유효성 검사 =====
      // 입력된 데이터가 올바른지 검증
      if (!validateContactForm(data)) {
        return; // 검증 실패 시 함수 종료
      }
      
      // 제출 처리
      submitContactForm(data);
    });
  }
}

// 문의 폼 유효성 검사
function validateContactForm(data) {
  const errors = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('이름은 2글자 이상 입력해주세요.');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('올바른 이메일 주소를 입력해주세요.');
  }
  
  if (!data.subject) {
    errors.push('문의 유형을 선택해주세요.');
  }
  
  if (!data.message || data.message.trim().length < 10) {
    errors.push('문의 내용은 10글자 이상 입력해주세요.');
  }
  
  if (errors.length > 0) {
    showNotification(errors[0], 'error');
    return false;
  }
  
  return true;
}

// 이메일 유효성 검사
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 문의 폼 제출
function submitContactForm(data) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // 제출 중 상태
  submitBtn.innerHTML = '<i class="ri-loader-4-line"></i> 전송 중...';
  submitBtn.disabled = true;
  
  // 실제 서버 전송 시뮬레이션 (2초 후 성공)
  setTimeout(() => {
    // 성공 처리
    showNotification('문의가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.', 'success');
    
    // 폼 초기화
    contactForm.reset();
    
    // 버튼 상태 복원
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // 로컬 스토리지에 문의 기록 저장 (선택사항)
    saveInquiryToLocal(data);
    
  }, 2000);
}

// 문의 기록을 로컬 스토리지에 저장
function saveInquiryToLocal(data) {
  try {
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    const newInquiry = {
      ...data,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };
    
    inquiries.unshift(newInquiry);
    
    // 최대 10개만 보관
    if (inquiries.length > 10) {
      inquiries.splice(10);
    }
    
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
  } catch (error) {
    console.error('Failed to save inquiry:', error);
  }
}

// 스크롤 효과 설정
function setupScrollEffects() {
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    
    // 헤더 스크롤 효과
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // 스크롤 방향에 따른 애니메이션
    const scrollDirection = window.scrollY > lastScrollY ? 'down' : 'up';
    
    // 카드 요소들에 스크롤 애니메이션 적용
    const cards = document.querySelectorAll('.help-card, .guide-card, .faq-item');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible && !card.classList.contains('animated')) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.classList.add('animated');
        }, 100);
      }
    });
    
    lastScrollY = window.scrollY;
  });
}

// 페이지 진입 애니메이션
function animatePageEntry() {
  const elements = document.querySelectorAll('.hero-content, .help-grid, .faq-container, .guide-grid, .contact-content');
  
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// 알림 시스템
function showNotification(message, type = 'info') {
  // 기존 알림 제거
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="ri-${type === 'success' ? 'check-line' : type === 'error' ? 'error-warning-line' : 'information-line'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // 스타일 추가
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? 'var(--gradient-success)' : 
                 type === 'error' ? 'var(--gradient-secondary)' : 
                 'var(--gradient-primary)'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    z-index: 10000;
    transform: translateX(100%);
    transition: var(--transition);
    max-width: 300px;
  `;
  
  const content = notification.querySelector('.notification-content');
  content.style.cssText = `
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
  `;
  
  document.body.appendChild(notification);
  
  // 애니메이션
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // 자동 제거
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 4000);
}

// 부드러운 스크롤 네비게이션
function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = target.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }
}

// 키보드 접근성
document.addEventListener('keydown', function(e) {
  // ESC 키로 열린 FAQ 닫기
  if (e.key === 'Escape') {
    const activeFaq = document.querySelector('.faq-item.active');
    if (activeFaq) {
      activeFaq.classList.remove('active');
    }
  }
});

// 외부 링크 처리
document.addEventListener('click', function(e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    smoothScrollTo(targetId);
  }
});

/**
 * ========================================
 * 반응형 및 추가 기능들
 * ========================================
 */

/**
 * 반응형 화면 크기에 따른 레이아웃 조정
 * 모바일 화면에서 네비게이션이 제대로 표시되도록 조정합니다
 */
function handleResize() {
  const isMobile = window.innerWidth <= 768;
  
  // 모바일에서 네비게이션 조정
  if (isMobile) {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.style.flexWrap = 'wrap';
    }
  }
}

// 창 크기 변경 이벤트 리스너 등록
window.addEventListener('resize', handleResize);
handleResize(); // 페이지 로드 시 초기 실행

/**
 * ========================================
 * QNA(질문과 답변) 시스템
 * ========================================
 * 사용자들이 직접 질문을 등록하고 답변을 확인할 수 있는 기능
 */

// QNA 관련 DOM 요소들
const qnaList = document.getElementById('qnaList'); // QNA 목록 표시 영역
const qnaForm = document.getElementById('qnaForm'); // QNA 등록 폼 (HTML에 있는 경우)
const qnaFormToggleBtn = document.getElementById('qnaFormToggleBtn'); // QNA 폼 토글 버튼

/**
 * QNA 답변 토글 버튼 기능 설정
 * 각 QNA 항목의 "답변 보기" 버튼을 클릭하면 답변 내용이 펼쳐지거나 접힙니다
 */
function setQnaAnswerToggle() {
  // 모든 QNA 답변 토글 버튼에 이벤트 리스너 추가
  document.querySelectorAll('.qna-answer-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      // 클릭된 버튼의 부모 요소(QNA 아이템)와 답변 영역 찾기
      const qnaItem = btn.closest('.qna-item');
      const qnaAnswer = qnaItem.querySelector('.qna-answer');
      
      // 답변 영역이 현재 보이는지 확인
      const isVisible = qnaAnswer.style.display !== 'none';
      
      if (isVisible) {
        // 답변 숨기기
        qnaAnswer.style.display = 'none';
        btn.textContent = '답변 보기';
      } else {
        // 답변 보이기
        qnaAnswer.style.display = 'block';
        btn.textContent = '답변 닫기';
      }
    });
  });
}

/**
 * 저장된 QNA 목록을 불러와서 화면에 표시
 * LocalStorage에서 QNA 데이터를 가져와 동적으로 HTML을 생성합니다
 */
function loadQna() {
  // QNA 목록 영역이 존재하지 않으면 함수 종료
  if (!qnaList) return;
  
  // 기존 내용 초기화
  qnaList.innerHTML = '';
  
  // LocalStorage에서 QNA 데이터 가져오기
  const qnas = JSON.parse(localStorage.getItem('qnaList') || '[]');
  
  // QNA가 없는 경우 안내 메시지 표시
  if (qnas.length === 0) {
    qnaList.innerHTML = '<div style="color:#888; text-align:center; margin:30px 0;">아직 등록된 QNA가 없습니다.</div>';
    return;
  }
  
  // QNA 목록을 최신순으로 정렬하여 표시
  qnas.slice().reverse().forEach((qna, idx) => {
    const item = document.createElement('div');
    item.className = 'qna-item';
    item.innerHTML = `
      <div class="qna-title">${qna.title}</div>
      <div class="qna-meta">${qna.name} · ${qna.date}</div>
      <button class="qna-answer-toggle">답변 보기</button>
      <div class="qna-answer" style="display:none;">
        <div class="qna-content">${qna.content}</div>
      </div>
    `;
    qnaList.appendChild(item);
  });
  
  // 새로 생성된 토글 버튼들에 이벤트 리스너 추가
  setQnaAnswerToggle();
}

/**
 * 새로운 QNA 등록 처리
 * 사용자가 입력한 질문을 LocalStorage에 저장하고 목록을 업데이트합니다
 */
function setupQnaForm() {
  // QNA 폼이 존재하는 경우에만 이벤트 리스너 추가
  if (qnaForm) {
    qnaForm.addEventListener('submit', function(e) {
      e.preventDefault(); // 기본 제출 동작 방지
      
      // 폼에서 입력값 가져오기
      const name = document.getElementById('qnaName')?.value.trim() || '익명';
      const title = document.getElementById('qnaTitle')?.value.trim();
      const content = document.getElementById('qnaContent')?.value.trim();
      
      // 필수 입력값 검증
      if (!title || !content) {
        showNotification('제목과 내용을 모두 입력해주세요.', 'error');
        return;
      }

      // 기존 QNA 목록 가져오기
      const qnas = JSON.parse(localStorage.getItem('qnaList') || '[]');
      
      // 새 QNA 추가
      qnas.push({
        name,
        title,
        content,
        date: new Date().toLocaleString('ko-KR') // 한국 시간 형식으로 저장
      });
      
      // LocalStorage에 저장
      localStorage.setItem('qnaList', JSON.stringify(qnas));
      
      // 폼 초기화 및 성공 메시지
      qnaForm.reset();
      showNotification('질문이 성공적으로 등록되었습니다.', 'success');
      
      // QNA 목록 새로고침
      loadQna();
      
      // 폼 자동 닫기 (토글 버튼이 있는 경우)
      if (qnaFormToggleBtn && qnaForm.classList.contains('qna-form-expanded')) {
        qnaForm.classList.remove('qna-form-expanded');
        qnaForm.classList.add('qna-form-collapsed');
        qnaFormToggleBtn.textContent = '질문 등록하기';
      }
    });
  }
}

// QNA 시스템 초기화
setupQnaForm();
loadQna();

/**
 * ========================================
 * 통합 로그인 버튼 업데이트 함수
 * ========================================
 * 헤더의 로그인 버튼 상태를 현재 로그인 상태에 맞게 업데이트합니다
 * 스타일링과 이벤트 핸들러를 모두 처리합니다
 */
function updateLoginButton() {
  const loginBtn = document.querySelector('.login-btn');
  const isLoggedIn = checkLoginStatus();
  
  if (loginBtn) {
    if (isLoggedIn) {
      // ===== 로그인된 상태 스타일링 =====
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      loginBtn.textContent = user.name || '테스트사용자';
      loginBtn.disabled = false;
      loginBtn.style.opacity = '1';
      loginBtn.style.cursor = 'pointer';
      loginBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      loginBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
      
      // 로그아웃 이벤트 추가
      loginBtn.onclick = function() {
        logout();
      };
      
      // 로그인 상태 호버 효과
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
      // ===== 비로그인 상태 스타일링 =====
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
      
      // 비로그인 상태 호버 효과
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

/**
 * ========================================
 * 전역 함수 내보내기
 * ========================================
 * 다른 스크립트에서 사용할 수 있도록 함수들을 전역 스코프에 등록
 */
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.showNotification = showNotification;
window.updateLoginButton = updateLoginButton;
window.smoothScrollTo = smoothScrollTo;