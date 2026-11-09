const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const year = document.querySelector("#year");
const contactForm = document.querySelector("#contact-form");
const projectCards = document.querySelectorAll(".project-card__trigger[data-project]");
const projectModal = document.querySelector("#project-modal");
const modalCloseButton = projectModal.querySelector(".project-modal__close");
const previousFocus = { element: null, bodyOverflow: "" };
const contactFields = [
  {
    input: document.querySelector("#contact-name"),
    error: document.querySelector("#contact-name-error"),
    message: "이름을 입력해 주세요.",
    isValid: (input) => input.value.trim().length > 0
  },
  {
    input: document.querySelector("#contact-email"),
    error: document.querySelector("#contact-email-error"),
    message: (input) => input.value.length === 0
      ? "이메일을 입력해 주세요."
      : "올바른 이메일 주소를 입력해 주세요.",
    isValid: (input) => input.value.length > 0 && input.validity.valid
  },
  {
    input: document.querySelector("#contact-message"),
    error: document.querySelector("#contact-message-error"),
    message: "메시지를 입력해 주세요.",
    isValid: (input) => input.value.trim().length > 0
  }
];
const contactFormStatus = document.querySelector("#contact-form-status");

const projectDetails = {
  morrow: {
    name: "Morrow",
    description: "예시: 팀의 업무와 일정을 한곳에서 확인할 수 있는 협업 도구입니다.",
    role: "예시: 사용자 흐름 설계, 화면 UI 디자인, 인터랙션 프로토타입 제작",
    tools: "예시: Figma, FigJam, HTML, CSS",
    result: "예시: 업무 현황을 쉽게 확인하고 팀 내 정보 공유를 돕는 화면을 구성했습니다."
  },
  ongi: {
    name: "On:gi",
    description: "예시: 일상 속 휴식과 따뜻한 분위기를 제안하는 라이프스타일 브랜드입니다.",
    role: "예시: 브랜드 콘셉트 정리, 시각 아이덴티티와 온라인 스토어 화면 디자인",
    tools: "예시: Figma, Illustrator, Photoshop",
    result: "예시: 온라인과 오프라인에서 일관된 브랜드 경험을 전달하도록 구성했습니다."
  },
  wander: {
    name: "Wander",
    description: "예시: 여행 중 발견한 장소와 순간을 기록하고 다시 찾아보는 모바일 앱입니다.",
    role: "예시: 사용자 여정 설계, 모바일 UI 디자인, 클릭형 프로토타입 제작",
    tools: "예시: Figma, FigJam, 프로토타이핑 도구",
    result: "예시: 사진과 메모를 함께 정리해 여행 기록을 쉽게 돌아볼 수 있도록 했습니다."
  }
};

// 프로젝트 정보를 모달에 채우고, 닫은 뒤 돌아갈 카드 포커스를 기억합니다.
function openProjectModal(projectId, trigger) {
  const project = projectDetails[projectId];

  if (!project) {
    console.error(`프로젝트 상세 정보를 찾을 수 없습니다: ${projectId}`);
    return;
  }

  previousFocus.element = trigger;
  previousFocus.bodyOverflow = document.body.style.overflow;
  document.querySelector("#project-modal-title").textContent = project.name;
  document.querySelector("#project-modal-description").textContent = project.description;
  document.querySelector("#project-modal-role").textContent = project.role;
  document.querySelector("#project-modal-tools").textContent = project.tools;
  document.querySelector("#project-modal-result").textContent = project.result;

  projectModal.hidden = false;
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleModalKeydown);
  modalCloseButton.focus();
}

// 모달을 닫고 페이지 스크롤과 키보드 포커스를 원래 상태로 되돌립니다.
function closeProjectModal() {
  if (projectModal.hidden) {
    return;
  }

  projectModal.hidden = true;
  document.body.style.overflow = previousFocus.bodyOverflow;
  document.removeEventListener("keydown", handleModalKeydown);

  if (previousFocus.element?.isConnected) {
    previousFocus.element.focus();
  }
}

// ESC로 닫고, Tab 키 포커스가 모달 밖으로 빠져나가지 않게 합니다.
function handleModalKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    closeProjectModal();
    return;
  }

  if (event.key === "Tab") {
    event.preventDefault();
    modalCloseButton.focus();
  }
}

if (year) {
  year.textContent = new Date().getFullYear();
}

function clearContactFieldError(field) {
  field.input.removeAttribute("aria-invalid");
  field.error.textContent = "";
  field.error.hidden = true;
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactFormStatus.textContent = "";

  contactFields.forEach(({ input }) => {
    input.value = input.value.trim();
  });

  let firstInvalidField = null;

  contactFields.forEach((field) => {
    if (!field.isValid(field.input)) {
      field.input.setAttribute("aria-invalid", "true");
      field.error.textContent = typeof field.message === "function"
        ? field.message(field.input)
        : field.message;
      field.error.hidden = false;
      firstInvalidField ??= field.input;
      return;
    }

    clearContactFieldError(field);
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
    return;
  }

  contactFormStatus.textContent = "입력 내용이 확인되었습니다. 이메일은 전송되지 않았습니다.";
});

contactFields.forEach((field) => {
  field.input.addEventListener("input", () => {
    clearContactFieldError(field);
    contactFormStatus.textContent = "";
  });
});

projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    openProjectModal(card.dataset.project, card);
  });
});

modalCloseButton.addEventListener("click", closeProjectModal);

projectModal.addEventListener("click", (event) => {
  if (event.target === projectModal) {
    closeProjectModal();
  }
});

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "메뉴 열기");
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});
