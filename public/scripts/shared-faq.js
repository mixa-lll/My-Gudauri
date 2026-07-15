(() => {
  const hosts = Array.from(document.querySelectorAll('[data-faq-component]'));
  if (!hosts.length) return;

  const faqItems = [
    {
      q: "How do I choose the right instructor?",
      a: "Compare experience, languages, teaching style and verified guest reviews. Each profile gives you the details needed to choose with confidence."
    },
    {
      q: "Is the price different for each instructor?",
      a: "Pricing follows a unified official policy. The best way to choose an instructor is by language, style, and guest reviews rather than rate differences."
    },
    {
      q: "How are lesson hours distributed across days?",
      a: "After booking, the schedule is coordinated with your instructor and can be split across days based on weather, slope conditions, and your preferred pace."
    },
    {
      q: "How does the booking process work?",
      a: "Select an instructor, submit your request, and confirm the details. Once approved, you receive booking confirmation and next-step instructions."
    },
    {
      q: "When do I receive the instructor’s contact details?",
      a: "Contact details are shared after your booking is confirmed, so you can coordinate the exact meeting point and start time in advance."
    }
  ];

  const buildTemplate = () => {
    const items = faqItems
      .map(
        (item, index) => `
          <article class="faq-item${index === 0 ? " open" : ""}" data-faq-item>
            <button class="faq-icon" type="button" aria-label="Toggle question" aria-expanded="${index === 0 ? "true" : "false"}"></button>
            <div class="faq-content">
              <h3>${item.q}</h3>
              <p>${item.a}</p>
            </div>
          </article>
        `
      )
      .join("");

    return `
      <div class="faq-head section-heading">
        <p class="section-heading__kicker">Frequently Asked Questions</p>
        <h2 class="section-heading__title">FAQ</h2>
      </div>
      <div class="faq-list">${items}</div>
    `;
  };

  const syncFixedListHeight = (faqList, items) => {
    const styles = window.getComputedStyle(faqList);
    const closedHeight = parseFloat(styles.getPropertyValue("--faq-item-closed-h")) || 60;
    const openHeight = parseFloat(styles.getPropertyValue("--faq-item-open-h")) || 129;
    const rowGap = parseFloat(styles.rowGap) || 10;
    const fixedHeight = openHeight + (items.length - 1) * closedHeight + (items.length - 1) * rowGap;
    faqList.style.setProperty("--faq-list-fixed-h", `${fixedHeight}px`);
  };

  const setupHost = (host, hostIndex) => {
    host.innerHTML = buildTemplate();

    const faqList = host.querySelector(".faq-list");
    const items = Array.from(host.querySelectorAll(".faq-item"));
    if (!faqList || !items.length) return;

    const setExpanded = (item, expanded) => {
      item.classList.toggle("open", expanded);
      const iconButton = item.querySelector(".faq-icon");
      if (iconButton) iconButton.setAttribute("aria-expanded", String(expanded));
    };

    const openExclusive = (nextItem) => {
      items.forEach((item) => setExpanded(item, item === nextItem));
    };

    const animateExclusiveSwitch = (nextItem) => {
      const firstRects = items.map((item) => item.getBoundingClientRect());
      openExclusive(nextItem);
      const lastRects = items.map((item) => item.getBoundingClientRect());

      items.forEach((item, index) => {
        const deltaY = firstRects[index].top - lastRects[index].top;
        if (Math.abs(deltaY) < 0.5) return;
        item.style.transform = `translateY(${deltaY}px)`;
        item.getBoundingClientRect();
        item.style.transform = "translateY(0)";
      });
    };

    items.forEach((item, index) => {
      const iconButton = item.querySelector(".faq-icon");
      const content = item.querySelector(".faq-content");
      if (!iconButton || !content) return;
      if (!iconButton.id) iconButton.id = `faq-trigger-${hostIndex + 1}-${index + 1}`;
      if (!content.id) content.id = `faq-content-${hostIndex + 1}-${index + 1}`;
      iconButton.setAttribute("aria-controls", content.id);
    });

    syncFixedListHeight(faqList, items);

    items.forEach((item) => {
      const onActivate = () => {
        if (item.classList.contains("open")) return;
        animateExclusiveSwitch(item);
      };

      item.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.closest("a, button, input, textarea, select")) return;
        onActivate();
      });

      const iconButton = item.querySelector(".faq-icon");
      iconButton?.addEventListener("click", (event) => {
        event.preventDefault();
        onActivate();
      });
    });

    window.addEventListener("resize", () => syncFixedListHeight(faqList, items));
  };

  hosts.forEach((host, index) => setupHost(host, index));
})();
