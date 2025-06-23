 document.getElementById("nextBtn").addEventListener("click", function () {
  const selected = document.querySelector('input[name="q1"]:checked');
  if (!selected) {
    alert("답변을 선택해주세요.");
    return;
  }

  // 여기서 다음 질문으로 넘어가는 로직 작성 예정
  alert("다음 질문으로 넘어갑니다. (예시)");
});