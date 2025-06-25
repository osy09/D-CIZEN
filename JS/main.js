// D-CiZen 메인 페이지 JavaScript - 최종 버전

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
  // 페이지 로드 시 window.open 팝업 표시
  setTimeout(() => {
    showWindowPopup();
  }, 1500);
  
  // 뉴스레터 폼 이벤트 리스너
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
});

// window.open을 사용한 팝업 창
function showWindowPopup() {
  const popupContent = `
    <html>
    <head>
      <title>D-CiZen 서비스 안내</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
        }
        .popup-container {
          max-width: 400px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 { margin-bottom: 20px; color: #fff; }
        p { margin-bottom: 15px; line-height: 1.6; }
        ul { text-align: left; margin: 20px 0; }
        li { margin-bottom: 8px; }
        .student-info {
          background: rgba(255, 255, 255, 0.15);
          padding: 15px;
          margin: 20px 0;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .buttons {
          margin-top: 30px;
        }
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
        button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
      </style>
    </head>
    <body>
      <div class="popup-container">
        <h1>🎉 D-CiZen 서비스 오픈!</h1>
        <div class="student-info">
          <strong>대구소프트웨어마이스터고등학교 1학년 1반</strong><br>
          <strong>오승윤, 조원진의 웹 기초 수행평가용</strong>
        </div>
        <p><strong>안녕하세요! D-CiZen에 오신 것을 환영합니다.</strong></p>
        <p>스마트한 디지털 시민이 되기 위한 여러분의 여정을 함께하겠습니다.</p>
        <ul>
          <li>✅ 연령별 맞춤 교육 콘텐츠</li>
          <li>✅ 디지털 시민의식 진단 도구</li>
          <li>✅ 실시간 커뮤니티 지원</li>
          <li>✅ 전문가 상담 서비스</li>
        </ul>
        <p>지금 바로 학습을 시작해보세요!</p>
        <div class="buttons">
          <button onclick="window.opener.location.href='learn.html'; window.close();">학습 시작하기</button>
          <button onclick="window.close();">나중에</button>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // 새 창 열기
  const popup = window.open('', 'DCizenPopup', 'width=500,height=650,scrollbars=no,resizable=no,toolbar=no,menubar=no,location=no,status=no');
  
  if (popup) {
    popup.document.write(popupContent);
    popup.document.close();
    
    // 팝업 창을 화면 중앙에 위치
    const left = (screen.width - 500) / 2;
    const top = (screen.height - 650) / 2;
    popup.moveTo(left, top);
  }
}

// 뉴스레터 구독 처리 함수
function handleNewsletterSubmit(event) {
  event.preventDefault();
  
  // 폼 데이터 수집
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;
  const privacy = document.getElementById('privacy').checked;
  
  // 간단한 유효성 검사
  if (!name.trim()) {
    alert('이름을 입력해 주세요.');
    return;
  }
  
  if (!email.trim() || !email.includes('@')) {
    alert('올바른 이메일 주소를 입력해 주세요.');
    return;
  }
  
  if (!age) {
    alert('연령대를 선택해 주세요.');
    return;
  }
  
  if (!privacy) {
    alert('개인정보 처리방침에 동의해 주세요.');
    return;
  }
  
  // 성공 메시지
  alert('뉴스레터 구독이 완료되었습니다! 감사합니다.');
  
  // 폼 리셋
  document.getElementById('newsletterForm').reset();
}

// 부드러운 스크롤 효과
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});