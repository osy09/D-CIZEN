/**
 * ========================================
 * D-CiZen 디지털 시민의식 자가진단 시스템
 * ========================================
 * 
 * 이 파일은 사용자의 디지털 시민의식 수준을 측정하는 설문조사 시스템입니다.
 * 주요 기능:
 * - 5개 문항의 디지털 시민의식 평가 설문
 * - 응답에 따른 자동 점수 계산
 * - 점수별 맞춤 결과 및 개선 방안 제시
 * - 인터랙티브한 설문 진행 인터페이스
 * - 결과 분석 및 추천사항 제공
 * 
 * 작성자: 대구소프트웨어마이스터고등학교 1학년 1반 오승윤, 조원진
 * 수행평가용 웹사이트
 */

// ============= 설문 문항 데이터 =============
// 디지털 시민의식을 평가하기 위한 5개 핵심 문항
// 각 문항은 5점 척도로 평가됩니다 (1점: 매우 부족 ~ 5점: 매우 우수)
const questions = [
  {
    id: 1, // 문항 고유 번호
    text: "소셜 미디어에 게시물을 올리기 전에 사실 확인을 얼마나 자주 하시나요?", // 질문 내용
    options: [ // 선택 옵션들 (점수가 높을수록 좋은 답변)
      { value: 5, text: "항상 사실 확인을 한다" },
      { value: 4, text: "대부분 사실 확인을 한다" },
      { value: 3, text: "가끔 사실 확인을 한다" },
      { value: 2, text: "거의 사실 확인을 하지 않는다" },
      { value: 1, text: "전혀 사실 확인을 하지 않는다" }
    ]
  },
  {
    id: 2,
    text: "온라인에서 개인정보를 보호하는 방법에 대해 얼마나 알고 계시나요?",
    options: [
      { value: 5, text: "매우 잘 알고 있다" },
      { value: 4, text: "잘 알고 있다" },
      { value: 3, text: "보통이다" },
      { value: 2, text: "잘 모른다" },
      { value: 1, text: "전혀 모른다" }
    ]
  },
  {
    id: 3,
    text: "타인의 온라인 콘텐츠(사진, 글 등)를 사용할 때 저작권을 고려하시나요?",
    options: [
      { value: 5, text: "항상 고려한다" },
      { value: 4, text: "대부분 고려한다" },
      { value: 3, text: "가끔 고려한다" },
      { value: 2, text: "거의 고려하지 않는다" },
      { value: 1, text: "전혀 고려하지 않는다" }
    ]
  },
  {
    id: 4,
    text: "온라인에서 타인과 의견이 다를 때 어떻게 대응하시나요?",
    options: [
      { value: 5, text: "존중하며 건설적으로 토론한다" },
      { value: 4, text: "대부분 존중하며 대화한다" },
      { value: 3, text: "보통 적당히 대응한다" },
      { value: 2, text: "가끔 감정적으로 반응한다" },
      { value: 1, text: "자주 감정적으로 반응한다" }
    ]
  },
  {
    id: 5,
    text: "디지털 기기 사용 시간을 스스로 조절할 수 있나요?",
    options: [
      { value: 5, text: "매우 잘 조절한다" },
      { value: 4, text: "잘 조절한다" },
      { value: 3, text: "보통이다" },
      { value: 2, text: "조절이 어렵다" },
      { value: 1, text: "전혀 조절하지 못한다" }
    ]
  }
];

// ============= 점수별 결과 분석 데이터 =============
// 총점(5~25점)에 따라 4단계로 결과를 분류하고 맞춤 피드백을 제공합니다
const results = {
  // 우수 등급 (21~25점): 매우 높은 디지털 시민의식
  excellent: {
    grade: "우수",
    minScore: 21,
    maxScore: 25,
    description: "훌륭한 디지털 시민의식을 갖고 계시네요! 온라인에서 책임감 있게 행동하고 계십니다.",
    recommendations: [
      "현재의 좋은 습관을 계속 유지하세요",
      "다른 사람들에게 디지털 시민의식을 알려주세요",
      "새로운 디지털 기술과 트렌드에 관심을 가져보세요",
      "온라인 커뮤니티에서 긍정적인 영향력을 발휘하세요"
    ]
  },
  // 양호 등급 (16~20점): 좋은 수준이지만 일부 개선 필요
  good: {
    grade: "양호",
    minScore: 16,
    maxScore: 20,
    description: "좋은 디지털 시민의식을 갖고 있습니다. 몇 가지 영역에서 더 개선할 수 있어요.",
    recommendations: [
      "정보 공유 전 사실 확인을 더 철저히 하세요",
      "개인정보 보호 설정을 정기적으로 점검하세요",
      "저작권에 대한 인식을 높여보세요",
      "온라인 토론에서 더욱 존중하는 태도를 연습하세요"
    ]
  },
  // 보통 등급 (11~15점): 기본적인 수준이지만 많은 개선 필요
  average: {
    grade: "보통",
    minScore: 11,
    maxScore: 15,
    description: "기본적인 디지털 시민의식은 갖고 있지만, 개선이 필요한 영역이 있습니다.",
    recommendations: [
      "가짜뉴스와 허위정보 식별법을 학습하세요",
      "개인정보 보호의 중요성을 인식하고 실천하세요",
      "타인의 지적재산권을 존중하는 습관을 기르세요",
      "온라인 예절과 네티켓을 학습하세요",
      "디지털 기기 사용 시간을 관리하는 방법을 찾아보세요"
    ]
  },
  // 개선 필요 등급 (5~10점): 상당한 개선이 필요한 수준
  needsImprovement: {
    grade: "개선 필요",
    minScore: 5,
    maxScore: 10,
    description: "디지털 시민의식 향상이 필요합니다. 온라인에서 더욱 책임감 있는 행동을 실천해보세요.",
    recommendations: [
      "디지털 리터러시 교육을 받아보세요",
      "정보의 출처를 항상 확인하는 습관을 기르세요",
      "개인정보 보호에 대해 더 많이 학습하세요",
      "온라인에서 타인을 존중하는 방법을 배워보세요",
      "디지털 웰빙에 대해 관심을 가져보세요",
      "관련 온라인 강의나 교육 프로그램에 참여하세요"
    ]
  }
};

// ============= 전역 변수들 =============
let currentQuestionIndex = 0; // 현재 표시 중인 문항 번호 (0부터 시작)
let userAnswers = [];         // 사용자의 답변들을 저장하는 배열
let isTransitioning = false;  // 화면 전환 중인지 확인하는 플래그 (중복 클릭 방지)

// ============= DOM 요소들 =============
// HTML에서 설문 관련 요소들을 찾아서 변수에 저장
const questionForm = document.getElementById('questionForm');     // 설문 폼
const questionNumber = document.getElementById('questionNumber'); // 문항 번호 표시
const questionText = document.getElementById('questionText');     // 질문 내용 표시
const progressBar = document.getElementById('progressBar');       // 진행률 바
const progressText = document.getElementById('progressText');     // 진행률 텍스트
const prevBtn = document.getElementById('prevBtn');               // 이전 버튼
const nextBtn = document.getElementById('nextBtn');               // 다음 버튼
const resultSection = document.getElementById('resultSection');   // 결과 표시 섹션
const questionnaire = document.querySelector('.questionnaire');   // 설문지 전체 영역

// ============= 스테퍼(진행 단계 표시) 요소들 =============
const stepElements = document.querySelectorAll('.step');  // 단계 표시 원들
const lineElements = document.querySelectorAll('.line');  // 단계 연결 선들

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
  
  // 3. 설문조사 시스템 초기화 (첫 번째 문항 표시)
  initializeQuiz();
  
  // 4. 버튼 클릭 등 이벤트 리스너들 등록
  setupEventListeners();
  
  // 5. 페이지 진입 시 애니메이션 효과
  animatePageEntry();
});

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

// 로그인 상태 확인 및 네비게이션 업데이트
function updateNavigation() {
  const isLoggedIn = checkLoginStatus();
  const loginBtn = document.querySelector('.login-btn');
  
  if (isLoggedIn) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    loginBtn.textContent = user.name || '테스트사용자';
    loginBtn.onclick = logout;
    loginBtn.style.background = 'var(--gradient-accent)';
  } else {
    loginBtn.textContent = '로그인';
    loginBtn.onclick = () => window.location.href = 'login.html';
  }
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

// 설문 초기화
function initializeQuiz() {
  currentQuestionIndex = 0;
  userAnswers = [];
  displayQuestion();
  updateProgress();
  updateButtons();
  updateStepper();
}

// 질문 표시
function displayQuestion() {
  if (isTransitioning) return;
  
  const question = questions[currentQuestionIndex];
  
  // 애니메이션 시작
  isTransitioning = true;
  
  // 페이드 아웃
  questionForm.style.opacity = '0';
  questionForm.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    // 질문 번호와 텍스트 업데이트
    questionNumber.textContent = `질문 ${question.id}`;
    questionText.textContent = question.text;
    
    // 답변 옵션 생성
    questionForm.innerHTML = '';
    question.options.forEach((option, index) => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'answer-option';
      
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${question.id}`;
      input.value = option.value;
      input.id = `option${index}`;
      
      // 이전 답변이 있으면 선택 상태 복원
      if (userAnswers[currentQuestionIndex] && 
          userAnswers[currentQuestionIndex].value === option.value) {
        input.checked = true;
      }
      
      const label = document.createElement('label');
      label.htmlFor = `option${index}`;
      label.innerHTML = `
        <div class="radio-custom"></div>
        <span class="option-text">${option.text}</span>
      `;
      
      optionDiv.appendChild(input);
      optionDiv.appendChild(label);
      questionForm.appendChild(optionDiv);
      
      // 답변 선택 이벤트
      input.addEventListener('change', function() {
        if (this.checked) {
          saveAnswer(question.id, parseInt(this.value), option.text);
          updateButtons();
          
          // 선택 애니메이션
          this.parentElement.style.transform = 'scale(1.02)';
          setTimeout(() => {
            this.parentElement.style.transform = 'scale(1)';
          }, 200);
        }
      });
    });
    
    // 페이드 인
    questionForm.style.opacity = '1';
    questionForm.style.transform = 'translateY(0)';
    
    isTransitioning = false;
  }, 300);
}

// 답변 저장
function saveAnswer(questionId, value, text) {
  userAnswers[currentQuestionIndex] = {
    questionId: questionId,
    value: value,
    text: text
  };
}

// 진행률 업데이트
function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;
}

// 버튼 상태 업데이트
function updateButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;
  
  const hasAnswer = userAnswers[currentQuestionIndex];
  nextBtn.disabled = !hasAnswer;
  
  // 마지막 질문에서는 '결과 보기'로 변경
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.innerHTML = `
      결과 보기
      <i class="ri-arrow-right-line"></i>
    `;
  } else {
    nextBtn.innerHTML = `
      다음 질문
      <i class="ri-arrow-right-line"></i>
    `;
  }
}

// 스테퍼 업데이트
function updateStepper() {
  // 1단계: 질문 (항상 활성화)
  stepElements[0].classList.add('active');
  
  // 2단계: 분석 (모든 질문 완료 시)
  if (currentQuestionIndex === questions.length - 1 && userAnswers[currentQuestionIndex]) {
    stepElements[1].classList.add('active');
    lineElements[0].classList.add('active');
  } else {
    stepElements[1].classList.remove('active');
    lineElements[0].classList.remove('active');
  }
  
  // 3단계: 결과 (결과 화면에서만)
  stepElements[2].classList.remove('active');
  lineElements[1].classList.remove('active');
}

// 이벤트 리스너 설정
function setupEventListeners() {
  // 이전 버튼
  prevBtn.addEventListener('click', function() {
    if (currentQuestionIndex > 0 && !isTransitioning) {
      currentQuestionIndex--;
      displayQuestion();
      updateProgress();
      updateButtons();
      updateStepper();
    }
  });
  
  // 다음 버튼
  nextBtn.addEventListener('click', function() {
    if (!userAnswers[currentQuestionIndex] || isTransitioning) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      // 다음 질문으로
      currentQuestionIndex++;
      displayQuestion();
      updateProgress();
      updateButtons();
      updateStepper();
    } else {
      // 결과 표시
      showResults();
    }
  });
  
  // 스크롤 헤더 효과
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
  });
}

// 결과 계산 및 표시
function showResults() {
  // 총점 계산
  const totalScore = userAnswers.reduce((sum, answer) => sum + answer.value, 0);
  
  // 결과 등급 결정
  let resultData;
  if (totalScore >= results.excellent.minScore) {
    resultData = results.excellent;
  } else if (totalScore >= results.good.minScore) {
    resultData = results.good;
  } else if (totalScore >= results.average.minScore) {
    resultData = results.average;
  } else {
    resultData = results.needsImprovement;
  }
  
  // 스테퍼 업데이트
  stepElements[1].classList.add('active');
  lineElements[0].classList.add('active');
  stepElements[2].classList.add('active');
  lineElements[1].classList.add('active');
  
  // 설문 섹션 숨기기
  questionnaire.style.opacity = '0';
  questionnaire.style.transform = 'translateY(-50px)';
  
  setTimeout(() => {
    questionnaire.style.display = 'none';
    
    // 결과 섹션 표시
    resultSection.style.display = 'block';
    
    // 결과 데이터 업데이트
    document.getElementById('finalScore').textContent = totalScore;
    document.getElementById('scoreGrade').textContent = resultData.grade;
    document.getElementById('resultDescription').textContent = resultData.description;
    
    // 추천 사항 표시
    const recommendationList = document.getElementById('recommendationList');
    recommendationList.innerHTML = '';
    resultData.recommendations.forEach(recommendation => {
      const li = document.createElement('li');
      li.textContent = recommendation;
      recommendationList.appendChild(li);
    });
    
    // 결과 섹션 애니메이션
    resultSection.style.opacity = '0';
    resultSection.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
      resultSection.style.opacity = '1';
      resultSection.style.transform = 'translateY(0)';
      
      // 점수 애니메이션
      animateScore(totalScore);
      
      // 성공 알림
      setTimeout(() => {
        showNotification('진단이 완료되었습니다!', 'success');
      }, 1000);
    }, 100);
  }, 500);
}

// 점수 애니메이션
function animateScore(finalScore) {
  const scoreElement = document.getElementById('finalScore');
  let currentScore = 0;
  const increment = finalScore / 30;
  
  const timer = setInterval(() => {
    currentScore += increment;
    if (currentScore >= finalScore) {
      currentScore = finalScore;
      clearInterval(timer);
    }
    scoreElement.textContent = Math.floor(currentScore);
  }, 50);
}

// 설문 다시 시작
function restartQuiz() {
  // 결과 섹션 숨기기
  resultSection.style.opacity = '0';
  resultSection.style.transform = 'translateY(50px)';
  
  setTimeout(() => {
    resultSection.style.display = 'none';
    
    // 설문 섹션 다시 표시
    questionnaire.style.display = 'block';
    questionnaire.style.opacity = '0';
    questionnaire.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
      questionnaire.style.opacity = '1';
      questionnaire.style.transform = 'translateY(0)';
      
      // 설문 초기화
      initializeQuiz();
      
      showNotification('새로운 진단을 시작합니다.', 'info');
    }, 100);
  }, 500);
}

// 페이지 진입 애니메이션
function animatePageEntry() {
  const elements = document.querySelectorAll('.questionnaire, .result-section');
  elements.forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
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
    background: ${type === 'success' ? 'var(--gradient-accent)' : 
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
  }, 3000);
}

// 키보드 네비게이션
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
    prevBtn.click();
  } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
    nextBtn.click();
  } else if (e.key >= '1' && e.key <= '5') {
    const optionIndex = parseInt(e.key) - 1;
    const options = document.querySelectorAll('input[type="radio"]');
    if (options[optionIndex]) {
      options[optionIndex].checked = true;
      options[optionIndex].dispatchEvent(new Event('change'));
    }
  }
});

// 전역 함수로 내보내기 (HTML에서 호출)
window.restartQuiz = restartQuiz;
window.logout = logout;
window.checkLoginStatus = checkLoginStatus;
window.showNotification = showNotification;
window.updateLoginButton = updateLoginButton;