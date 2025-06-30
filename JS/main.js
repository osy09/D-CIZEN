/**
 * ========================================
 * D-CiZen 메인 페이지 JavaScript - 최종 버전
 * ========================================
 * 
 * 이 파일은 D-CiZen 메인 페이지의 모든 기능을 관리합니다.
 * 주요 기능:
 * - 로그인/로그아웃 상태 관리
 * - 서비스 소개 팝업창 표시
 * - 뉴스레터 구독 기능
 * - 부드러운 스크롤 효과
 * 
 * 작성자: 대구소프트웨어마이스터고등학교 1학년 1반 오승윤, 조원진
 * 수행평가용 웹사이트
 */

/**
 * DOM(Document Object Model)이 완전히 로드된 후 실행되는 메인 함수
 * HTML의 모든 요소가 준비되면 필요한 기능들을 초기화합니다.
 */
document.addEventListener('DOMContentLoaded', function() {
  // 1. 사용자의 로그인 상태를 확인하고 헤더의 로그인 버튼을 업데이트
  updateLoginButton();
  
  // 2. 페이지 로드 1.5초 후에 서비스 소개 팝업창을 표시
  // setTimeout: 지정된 시간(밀리초) 후에 함수를 실행
  setTimeout(() => {
    showWindowPopup(); // 팝업창 표시 함수 호출
  }, 1500); // 1500ms = 1.5초
  
  // 3. 뉴스레터 구독 폼이 있는지 확인하고 이벤트 리스너 추가
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    // 폼이 제출될 때 실행될 함수를 등록
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
});

/**
 * ========================================
 * 로그인 상태에 따른 헤더 버튼 업데이트 함수
 * ========================================
 * 
 * 사용자가 로그인했는지 확인하고, 그에 따라 헤더의 버튼을 변경합니다.
 * - 로그인 안함: "로그인" 버튼 (파란색) → 클릭시 로그인 페이지로 이동
 * - 로그인 완료: 사용자 이름 표시 (빨간색) → 클릭시 로그아웃 확인
 */
function updateLoginButton() {
  // HTML에서 .login-btn 클래스를 가진 버튼을 찾습니다
  const loginBtn = document.querySelector('.login-btn');
  
  // 현재 사용자가 로그인했는지 확인합니다
  const isLoggedIn = checkLoginStatus();
  
  // 로그인 버튼이 존재하는지 확인
  if (loginBtn) {
    
    // ============= 로그인된 상태일 때 =============
    if (isLoggedIn) {
      // LocalStorage에서 사용자 정보를 가져옵니다
      // JSON.parse: 문자열로 저장된 JSON을 객체로 변환
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // 버튼 텍스트를 사용자 이름으로 변경 (없으면 기본값 사용)
      loginBtn.textContent = user.name || '테스트사용자';
      
      // 버튼을 활성화하고 스타일을 빨간색 계열로 변경
      loginBtn.disabled = false;
      loginBtn.style.opacity = '1';
      loginBtn.style.cursor = 'pointer';
      loginBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'; // 빨간 그라데이션
      loginBtn.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)'; // 빨간 그림자
      
      // 버튼 클릭시 로그아웃 확인창을 띄우는 이벤트 추가
      loginBtn.onclick = function() {
        // confirm: 사용자에게 확인/취소를 묻는 대화상자
        if (confirm('로그아웃 하시겠습니까?')) {
          logout(); // 확인시 로그아웃 함수 실행
        }
      };
      
      // 마우스를 버튼 위에 올렸을 때의 호버 효과
      loginBtn.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'; // 더 진한 빨간색
        this.style.transform = 'translateY(-2px)'; // 버튼을 위로 2px 이동
        this.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)'; // 더 진한 그림자
      });
      
      // 마우스가 버튼에서 벗어났을 때 원래 스타일로 복원
      loginBtn.addEventListener('mouseleave', function() {
        this.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        this.style.transform = 'translateY(0)'; // 원래 위치로
        this.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
      });
      
    // ============= 로그인되지 않은 상태일 때 =============
    } else {
      // 버튼 텍스트를 "로그인"으로 설정
      loginBtn.textContent = '로그인';
      
      // 버튼을 활성화하고 스타일을 파란색 계열로 변경
      loginBtn.disabled = false;
      loginBtn.style.opacity = '1';
      loginBtn.style.cursor = 'pointer';
      loginBtn.style.background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)'; // 파란 그라데이션
      loginBtn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)'; // 파란 그림자
      
      // 버튼 클릭시 로그인 페이지로 이동하는 이벤트 추가
      loginBtn.onclick = function() {
        window.location.href = 'login.html'; // 로그인 페이지로 이동
      };
      
      // 마우스를 버튼 위에 올렸을 때의 호버 효과
      loginBtn.addEventListener('mouseenter', function() {
        this.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)'; // 더 진한 파란색
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.4)';
      });
      
      // 마우스가 버튼에서 벗어났을 때 원래 스타일로 복원
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
 * 로그인 상태 확인 함수
 * ========================================
 * 
 * 브라우저의 LocalStorage에 저장된 로그인 정보를 확인합니다.
 * 로그인 시간을 체크하여 24시간이 지나면 자동으로 로그아웃시킵니다.
 * 
 * @returns {boolean} true: 로그인됨, false: 로그인 안됨
 */
function checkLoginStatus() {
  // LocalStorage에서 로그인 상태와 로그인 시간을 가져옵니다
  const isLogin = localStorage.getItem('isLogin'); // 로그인 여부 ("true" 또는 null)
  const loginTime = localStorage.getItem('loginTime'); // 로그인한 시간 (ISO 문자열)
  
  // 로그인 상태와 로그인 시간이 모두 존재하는지 확인
  if (isLogin && loginTime) {
    // 문자열로 저장된 로그인 시간을 Date 객체로 변환
    const loginDate = new Date(loginTime);
    const now = new Date(); // 현재 시간
    
    // 현재 시간과 로그인 시간의 차이를 밀리초로 계산
    const timeDiff = now - loginDate;
    
    // 24시간(24 * 60 * 60 * 1000 밀리초) 후 자동 로그아웃
    if (timeDiff > 24 * 60 * 60 * 1000) {
      logout(); // 자동 로그아웃 실행
      return false; // 로그인 상태 아님
    }
    return true; // 로그인 상태임
  }
  return false; // 로그인 정보가 없으므로 로그인 상태 아님
}

/**
 * ========================================
 * 로그아웃 처리 함수
 * ========================================
 * 
 * 사용자를 로그아웃시키고 관련된 모든 데이터를 삭제합니다.
 * 로그아웃 완료 메시지를 표시한 후 페이지를 새로고침합니다.
 */
function logout() {
  // LocalStorage에서 로그인 관련 정보를 모두 삭제
  localStorage.removeItem('isLogin');     // 로그인 상태 삭제
  localStorage.removeItem('user');        // 사용자 정보 삭제
  localStorage.removeItem('loginTime');   // 로그인 시간 삭제
  
  // 사용자에게 로그아웃 완료 메시지를 표시 (초록색 성공 알림)
  showNotification('로그아웃되었습니다.', 'success');
  
  // 1초 후에 페이지를 새로고침하여 로그인 버튼 상태를 업데이트
  setTimeout(() => {
    location.reload(); // 페이지 새로고침
  }, 1000); // 1000ms = 1초
}

/**
 * ========================================
 * 알림 메시지 표시 함수
 * ========================================
 * 
 * 화면 우측 상단에 예쁜 알림 메시지를 표시합니다.
 * 3초 후 자동으로 사라지며, 슬라이드 애니메이션 효과가 있습니다.
 * 
 * @param {string} message - 표시할 메시지 내용
 * @param {string} type - 알림 타입 ('info', 'success', 'error')
 */
function showNotification(message, type = 'info') {
  // 기존에 표시된 알림이 있다면 제거합니다
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // 새로운 알림 요소를 생성합니다
  const notification = document.createElement('div');
  notification.className = `notification ${type}`; // CSS 클래스 설정
  notification.textContent = message; // 메시지 내용 설정
  
  // 알림의 기본 스타일을 설정합니다
  Object.assign(notification.style, {
    position: 'fixed',           // 화면에 고정
    top: '100px',               // 상단에서 100px 떨어진 위치
    right: '20px',              // 우측에서 20px 떨어진 위치
    padding: '1rem 1.5rem',     // 내부 여백
    borderRadius: '0.75rem',    // 둥근 모서리
    color: 'white',             // 글자색 흰색
    fontWeight: '600',          // 글자 굵게
    fontSize: '0.9rem',         // 글자 크기
    zIndex: '1000',             // 다른 요소보다 위에 표시
    opacity: '0',               // 처음에는 투명 (애니메이션용)
    transform: 'translateX(100%)', // 처음에는 오른쪽에 숨김
    transition: 'all 0.3s ease',  // 부드러운 전환 효과
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' // 그림자
  });
  
  // 알림 타입에 따라 배경색을 다르게 설정합니다
  if (type === 'success') {
    // 성공 메시지: 초록색 그라데이션
    notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
  } else if (type === 'error') {
    // 오류 메시지: 빨간색 그라데이션
    notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
  } else {
    // 일반 정보 메시지: 파란색 그라데이션
    notification.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
  }
  
  // 생성한 알림을 페이지에 추가합니다
  document.body.appendChild(notification);
  
  // 다음 프레임에서 알림을 나타나게 합니다 (부드러운 애니메이션을 위해)
  requestAnimationFrame(() => {
    notification.style.opacity = '1';         // 불투명하게
    notification.style.transform = 'translateX(0)'; // 원래 위치로
  });
  
  // 3초 후에 알림을 사라지게 합니다
  setTimeout(() => {
    notification.style.opacity = '0';              // 투명하게
    notification.style.transform = 'translateX(100%)'; // 오른쪽으로 슬라이드
    
    // 애니메이션이 끝난 후 DOM에서 완전히 제거
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300); // 애니메이션 시간(0.3초)과 동일
  }, 3000); // 3000ms = 3초
}

/**
 * ========================================
 * 서비스 소개 팝업창 표시 함수
 * ========================================
 * 
 * 페이지 로드 후 새 창으로 D-CiZen 서비스를 소개하는 팝업을 띄웁니다.
 * 팝업창에는 학교 정보, 서비스 특징, 학습 시작 버튼이 포함됩니다.
 * window.open()을 사용하여 별도의 창에서 표시됩니다.
 */
function showWindowPopup() {
  // 팝업창에 표시될 HTML 내용을 문자열로 작성
  // 백틱(`)을 사용한 템플릿 리터럴로 여러 줄 문자열 작성
  const popupContent = `
    <html>
    <head>
      <title>D-CiZen 서비스 안내</title>
      <style>
        /* 팝업창 전체 스타일 */
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 보라색 그라데이션 배경 */
          color: white;
          text-align: center;
        }
        
        /* 팝업 내용을 담는 컨테이너 */
        .popup-container {
          max-width: 400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1); /* 반투명 흰색 배경 */
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px); /* 배경 블러 효과 */
          border: 1px solid rgba(255, 255, 255, 0.2); /* 흰색 테두리 */
        }
        
        /* 제목 스타일 */
        h1 { margin-bottom: 20px; color: #fff; }
        
        /* 본문 텍스트 스타일 */
        p { margin-bottom: 15px; line-height: 1.6; }
        
        /* 리스트 스타일 */
        ul { text-align: left; margin: 20px 0; }
        li { margin-bottom: 8px; }
        
        /* 학생 정보 박스 스타일 */
        .student-info {
          background: rgba(255, 255, 255, 0.15);
          padding: 15px;
          margin: 20px 0;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* 버튼 컨테이너 */
        .buttons {
          margin-top: 30px;
        }
        
        /* 버튼 스타일 */
        button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 12px 24px;
          margin: 5px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        /* 버튼 호버 효과 */
        button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px); /* 위로 살짝 이동 */
        }
      </style>
    </head>
    <body>
      <div class="popup-container">
        <h1>🎉 D-CiZen 서비스 오픈!</h1>
        
        <!-- 학생 정보 표시 -->
        <div class="student-info">
          <strong>대구소프트웨어마이스터고등학교 1학년 1반</strong><br>
          <strong>오승윤, 조원진의 웹 기초 수행평가용</strong>
        </div>
        
        <!-- 서비스 소개 내용 -->
        <p><strong>안녕하세요! D-CiZen에 오신 것을 환영합니다.</strong></p>
        <p>스마트한 디지털 시민이 되기 위한 여러분의 여정을 함께하겠습니다.</p>
        
        <!-- 서비스 특징 리스트 -->
        <ul>
          <li>✅ 연령별 맞춤 교육 콘텐츠</li>
          <li>✅ 디지털 시민의식 진단 도구</li>
          <li>✅ 실시간 커뮤니티 지원</li>
          <li>✅ 전문가 상담 서비스</li>
        </ul>
        
        <p>지금 바로 학습을 시작해보세요!</p>
        
        <!-- 버튼들 -->
        <div class="buttons">
          <!-- 학습 시작 버튼: 부모 창을 학습 페이지로 이동시키고 팝업 닫기 -->
          <button onclick="window.opener.location.href='learn.html'; window.close();">학습 시작하기</button>
          <!-- 나중에 버튼: 팝업만 닫기 -->
          <button onclick="window.close();">나중에</button>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // window.open()으로 새 창을 열고 위의 HTML 내용을 표시
  // 매개변수: (URL, 창이름, 창옵션)
  const popup = window.open('', 'DCizenPopup', 'width=500,height=650,scrollbars=no,resizable=no,toolbar=no,menubar=no,location=no,status=no');
  
  // 팝업 차단기에 의해 차단되지 않았다면
  if (popup) {
    // 팝업창에 HTML 내용을 작성
    popup.document.write(popupContent);
    popup.document.close(); // 문서 작성 완료
    
    // 팝업창을 화면 중앙에 위치시키기
    const left = (screen.width - 500) / 2;   // 화면 가로 중앙 계산
    const top = (screen.height - 650) / 2;   // 화면 세로 중앙 계산
    popup.moveTo(left, top); // 팝업창을 계산된 위치로 이동
  }
}

/**
 * ========================================
 * 뉴스레터 구독 폼 처리 함수
 * ========================================
 * 
 * 사용자가 뉴스레터 구독 폼을 제출했을 때 실행되는 함수입니다.
 * 입력값들을 검증하고 성공 메시지를 표시한 후 폼을 초기화합니다.
 * 
 * @param {Event} event - 폼 제출 이벤트 객체
 */
function handleNewsletterSubmit(event) {
  // 폼의 기본 제출 동작(페이지 새로고침)을 방지합니다
  event.preventDefault();
  
  // ============= 폼 데이터 수집 =============
  // HTML의 각 input 요소에서 사용자가 입력한 값들을 가져옵니다
  const name = document.getElementById('name').value;       // 이름 입력값
  const email = document.getElementById('email').value;     // 이메일 입력값
  const age = document.getElementById('age').value;         // 연령대 선택값
  const privacy = document.getElementById('privacy').checked; // 개인정보동의 체크여부
  
  // ============= 입력값 유효성 검사 =============
  
  // 1. 이름이 비어있는지 확인 (공백 제거 후 확인)
  if (!name.trim()) {
    alert('이름을 입력해 주세요.');
    return; // 함수 종료 (더 이상 진행하지 않음)
  }
  
  // 2. 이메일이 비어있거나 @가 포함되지 않았는지 확인
  if (!email.trim() || !email.includes('@')) {
    alert('올바른 이메일 주소를 입력해 주세요.');
    return;
  }
  
  // 3. 연령대가 선택되지 않았는지 확인
  if (!age) {
    alert('연령대를 선택해 주세요.');
    return;
  }
  
  // 4. 개인정보 처리방침 동의가 체크되지 않았는지 확인
  if (!privacy) {
    alert('개인정보 처리방침에 동의해 주세요.');
    return;
  }
  
  // ============= 성공 처리 =============
  // 모든 검증을 통과했다면 성공 메시지 표시
  alert('뉴스레터 구독이 완료되었습니다! 감사합니다.');
  
  // 폼의 모든 입력값을 초기화 (빈 상태로 되돌림)
  document.getElementById('newsletterForm').reset();
}

/**
 * ========================================
 * 부드러운 스크롤 효과 설정
 * ========================================
 * 
 * 페이지 내의 앵커 링크(#으로 시작하는 링크)를 클릭했을 때
 * 갑자기 이동하는 대신 부드럽게 스크롤되도록 설정합니다.
 * 예: "커뮤니티로 이동" 버튼 클릭 시 부드럽게 스크롤됩니다.
 */
document.addEventListener('DOMContentLoaded', function() {
  // 페이지 내의 모든 앵커 링크(href가 #으로 시작하는 링크)를 찾습니다
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    
    // 각 앵커 링크에 클릭 이벤트 리스너를 추가합니다
    anchor.addEventListener('click', function(e) {
      // 링크의 기본 동작(즉시 이동)을 방지합니다
      e.preventDefault();
      
      // 링크의 href 속성에서 대상 요소를 찾습니다
      // 예: href="#community-section" → id가 "community-section"인 요소를 찾음
      const target = document.querySelector(this.getAttribute('href'));
      
      // 대상 요소가 존재한다면
      if (target) {
        // 부드러운 스크롤로 해당 요소로 이동합니다
        target.scrollIntoView({
          behavior: 'smooth',  // 부드러운 스크롤 애니메이션
          block: 'start'       // 요소의 상단이 화면 상단에 오도록 정렬
        });
      }
    });
  });
});

/**
 * ========================================
 * 전역 함수 내보내기
 * ========================================
 * 
 * 다른 JavaScript 파일이나 HTML에서 사용할 수 있도록
 * 주요 함수들을 전역 객체(window)에 등록합니다.
 * 이렇게 하면 다른 페이지에서도 이 함수들을 호출할 수 있습니다.
 */

// 로그아웃 함수를 전역에서 사용할 수 있도록 등록
window.logout = logout;

// 로그인 상태 확인 함수를 전역에서 사용할 수 있도록 등록
window.checkLoginStatus = checkLoginStatus;

// 알림 메시지 표시 함수를 전역에서 사용할 수 있도록 등록
window.showNotification = showNotification;

// 로그인 버튼 업데이트 함수를 전역에서 사용할 수 있도록 등록
window.updateLoginButton = updateLoginButton;