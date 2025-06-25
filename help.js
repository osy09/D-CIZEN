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
});

// QNA 폼 토글 기능
const qnaFormToggleBtn = document.getElementById('qnaFormToggleBtn');
const qnaForm = document.getElementById('qnaForm');
qnaFormToggleBtn.addEventListener('click', function() {
  qnaForm.classList.toggle('qna-form-collapsed');
  if (!qnaForm.classList.contains('qna-form-collapsed')) {
    qnaFormToggleBtn.textContent = '질문 등록 닫기';
  } else {
    qnaFormToggleBtn.textContent = '질문 등록하기';
  }
});

// QNA 답변 토글 기능 (예시 QNA 포함)
function setQnaAnswerToggle() {
  document.querySelectorAll('.qna-answer-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const answer = btn.nextElementSibling;
      if (answer.style.display === 'block') {
        answer.style.display = 'none';
        btn.textContent = '답변 보기';
      } else {
        answer.style.display = 'block';
        btn.textContent = '답변 닫기';
      }
    });
  });
}
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