import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

# 코랩: 이미 설치했다면 아래 !로 시작하는 두 줄은 주석 처리해도 됩니다.
!apt-get update -qq
!apt-get install fonts-nanum -qq

fe = fm.FontEntry(
    fname='/usr/share/fonts/truetype/nanum/NanumBarunGothic.ttf', 
    name='NanumBarunGothic')
fm.fontManager.ttflist.insert(0, fe)
plt.rc('font', family='NanumBarunGothic')
plt.rcParams['axes.unicode_minus'] = False
# --- 코랩 한글 폰트 설정 끝 ---

# -----------------------------
# 설정
# -----------------------------
MAX_CONTEXT = 80

# 간단한 문서 데이터베이스
DOCUMENTS = {
    "rag": """RAG(Retrieval-Augmented Generation)는 대규모 언어 모델이 학습하지 못한 최신 정보나 기업 내부 데이터를 활용하기 위해 고안된 프레임워크입니다. 
이 프로세스는 크게 세 단계로 나뉩니다. 첫째, 사용자의 질문과 관련된 문서를 외부 지식 저장소에서 '검색(Retrieval)'합니다. 
둘째, 검색된 정보를 질문과 결합하여 프롬프트를 '보강(Augmentation)'합니다. 
마지막으로, 보강된 정보를 바탕으로 모델이 최종 답변을 '생성(Generation)'합니다. 
이를 통해 모델은 최신성을 유지하고 답변의 근거를 명확히 제시할 수 있습니다.""",

    "hallucination": """할루시네이션(Hallucination, 환각 현상)은 AI 모델이 사실과 다르거나 논리적으로 맞지 않는 정보를 매우 그럴듯하게 답변하는 현상을 말합니다. 
이는 주로 모델이 학습 데이터에 없는 내용을 '추론'하려고 하거나, 확률적으로 가장 높은 단어를 선택하는 과정에서 발생합니다. 
RAG는 이러한 환각 현상을 억제하는 강력한 도구입니다. 모델에게 답변의 재료가 되는 실제 문서를 제공함으로써, 
모델이 자신의 기억이 아닌 '주어진 근거'에만 집중하게 유도하기 때문입니다.""",

    "context": """컨텍스트 윈도우(Context Window)는 모델이 한 번에 처리할 수 있는 최대 토큰(단어 조각)의 양을 의미합니다. 
마치 사람이 한눈에 읽을 수 있는 책의 페이지 수와 같습니다. 
모델은 이 제한된 범위 안의 정보만을 사용하여 다음 단어를 예측합니다. 
만약 문서가 너무 길어서 컨텍스트 윈도우를 초과하면, 가장 중요한 정보가 유실되어 모델이 엉뚱한 답을 내놓을 수 있습니다. 
따라서 RAG 시스템에서는 긴 문서를 적절한 크기(Chunk)로 잘라서 효율적으로 전달하는 기술이 매우 중요합니다."""
}

# -----------------------------
# 간단 검색 함수 (키워드 기반)
# -----------------------------
def simple_retrieval(query):
    for key in DOCUMENTS:
        if key in query.lower():
            return DOCUMENTS[key]
    return None

# -----------------------------
# 토큰 단순 분리
# -----------------------------
def tokenize(text):
    return text.split()

# -----------------------------
# 대시보드 실행
# -----------------------------
def run_rag_dashboard():
    print("\n=== RAG vs No-RAG 실습 ===")
    query = input("질문을 입력하세요: ") # 예: RAG가 뭐야?

    query_tokens = tokenize(query)

    # 1️⃣ No-RAG Context
    context_no_rag = query_tokens.copy()

    # 2️⃣ RAG Context
    retrieved_doc = simple_retrieval(query)

    if retrieved_doc:
        doc_tokens = tokenize(retrieved_doc)
        context_rag = doc_tokens + query_tokens
    else:
        doc_tokens = []
        context_rag = query_tokens.copy()

    # Context Window 제한 적용 (앞부분을 자름)
    context_no_rag = context_no_rag[-MAX_CONTEXT:]
    context_rag = context_rag[-MAX_CONTEXT:]

    # 시각화용 배열 생성
    arr_no_rag = np.zeros(MAX_CONTEXT)
    arr_rag = np.zeros(MAX_CONTEXT)

    # 시각화를 위해 앞에서부터 채우기
    arr_no_rag[:len(context_no_rag)] = 1
    arr_rag[:len(context_rag)] = 1
    if retrieved_doc:
        arr_rag[:len(doc_tokens)] = 2  # 문서 영역(초록색 계열) 표시

    # Attention 시뮬레이션
    def get_attn_full_array(length):
        if length == 0: return np.zeros(MAX_CONTEXT)
        dist = np.arange(length)[::-1] + 1
        w = 1 / dist
        w_norm = w / w.max()
        full_w = np.zeros(MAX_CONTEXT)
        full_w[:length] = w_norm
        return full_w

    attn_no_rag_full = get_attn_full_array(len(context_no_rag))
    attn_rag_full = get_attn_full_array(len(context_rag))

    # -----------------------------
    # 시각화
    # -----------------------------
    fig, axes = plt.subplots(4, 1, figsize=(14, 10))

    axes[0].imshow(arr_no_rag.reshape(1, -1), aspect='auto', cmap='Blues', vmin=0, vmax=2)
    axes[0].set_title("No-RAG Context (질문만 존재)")
    axes[0].set_yticks([])

    axes[1].imshow(arr_rag.reshape(1, -1), aspect='auto', cmap='viridis', vmin=0, vmax=2)
    axes[1].set_title("RAG Context (검색 문서 + 질문)")
    axes[1].set_yticks([])

    axes[2].imshow(attn_no_rag_full.reshape(1, -1), aspect='auto', cmap='Reds', vmin=0, vmax=1)
    axes[2].set_title("No-RAG Attention (질문 안에서의 중요도)")
    axes[2].set_yticks([])

    axes[3].imshow(attn_rag_full.reshape(1, -1), aspect='auto', cmap='Reds', vmin=0, vmax=1)
    axes[3].set_title("RAG Attention (문서와 질문 간의 중요도)")
    axes[3].set_yticks([])

    plt.tight_layout()
    plt.show()

    # -----------------------------
    # 출력 비교
    # -----------------------------
    print("\n--- 비교 ---")
    print("검색된 문서:", retrieved_doc if retrieved_doc else "없음")
    print("No-RAG 입력 토큰 수:", len(context_no_rag))
    print("RAG 입력 토큰 수:", len(context_rag))

    print("\n" + "="*50)

    print("🤖 AI의 최종 답변 비교")
    print("="*50)

    # 1. No-RAG 답변 (학습 데이터에 없다고 가정)
    print(f"[No-RAG 답변]:")
    if "rag" in query.lower() or "hallucination" in query.lower() or "context" in query.lower():
        print("👉 죄송합니다. 해당 용어에 대한 최신 정보가 제 학습 데이터에 없습니다.")
    else:
        print("👉 일상적인 대화는 가능하지만, 전문적인 근거를 제시할 수 없습니다.")

    print("-" * 30)

    # 2. RAG 답변 (검색된 문서를 기반으로 답변)
    print(f"[RAG 답변]:")
    if retrieved_doc:
        # 실제 LLM은 이 문서를 읽고 자연스럽게 요약하지만, 여기서는 검색된 내용을 기반으로 출력합니다.
        print(f"👉 검색된 문서를 참고하여 답변드립니다: \n   '{retrieved_doc}'")
    else:
        print("👉 관련 문서를 찾지 못했습니다. 일반적인 지식으로 답변드립니다.")
    print("="*50)

# 실행
run_rag_dashboard()