// 도움말 페이지 스크립트

// 전역 상태
let faqItems = [];

// DOM 요소
const contactForm = document.getElementById('contactForm');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 로그인 상태 확인 및 네비게이션 업데이트
  updateNavigation();
  
  // FAQ 아코디언 기능 초기화
  initializeFAQ();
  
  // 문의 폼 이벤트 리스너 설정
  setupContactForm();
  
  // 스크롤 헤더 효과
  setupScrollEffects();
  
  // 페이지 애니메이션
  animatePageEntry();
});

// 로그인 상태 확인 및 네비게이션 업데이트
function updateNavigation() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
  const loginBtn = document.querySelector('.login-btn');
  
  if (isLoggedIn) {
    const username = sessionStorage.getItem('username') || '사용자';
    loginBtn.textContent = `${username}님`;
    loginBtn.onclick = logout;
    loginBtn.style.background = 'var(--gradient-accent)';
  } else {
    loginBtn.textContent = '로그인';
    loginBtn.onclick = () => window.location.href = 'login.html';
  }
}

// 로그아웃 함수
function logout() {
  if (confirm('로그아웃 하시겠습니까?')) {
    sessionStorage.clear();
    showNotification('로그아웃되었습니다.', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// FAQ 아코디언 기능 초기화
function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // 다른 모든 FAQ 아이템 닫기
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // 현재 아이템 토글
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
      
      // 애니메이션 효과
      question.style.transform = 'scale(0.98)';
      setTimeout(() => {
        question.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

// 문의 폼 설정
function setupContactForm() {
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };
      
      // 폼 유효성 검사
      if (!validateContactForm(data)) {
        return;
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

// 반응형 처리
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

window.addEventListener('resize', handleResize);
handleResize(); // 초기 실행
setQnaAnswerToggle();

// QNA 저장 및 출력 (localStorage 사용)
const qnaList = document.getElementById('qnaList');

// QNA 목록 불러오기
function loadQna() {
  qnaList.innerHTML = '';
  const qnas = JSON.parse(localStorage.getItem('qnaList') || '[]');
  if (qnas.length === 0) {
    qnaList.innerHTML = '<div style="color:#888; text-align:center; margin:30px 0;">아직 등록된 QNA가 없습니다.</div>';
    return;
  }
  // 최신순 정렬
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
  setQnaAnswerToggle();
}

// QNA 등록 이벤트
qnaForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('qnaName').value.trim() || '익명';
  const title = document.getElementById('qnaTitle').value.trim();
  const content = document.getElementById('qnaContent').value.trim();
  if (!title || !content) return;

  const qnas = JSON.parse(localStorage.getItem('qnaList') || '[]');
  qnas.push({
    name,
    title,
    content,
    date: new Date().toLocaleString('ko-KR')
  });
  localStorage.setItem('qnaList', JSON.stringify(qnas));
  qnaForm.reset();
  loadQna();
  // 폼 자동 닫기
  qnaForm.classList.add('qna-form-collapsed');
  qnaFormToggleBtn.textContent = '질문 등록하기';
});

// 페이지 로드 시 QNA 목록 및 버튼 상태 갱신
loadQna();
updateAuthButtons();