/**
 * 115 屏東市復興國小運動會 互動腳本
 * 純原生 JavaScript，零外部第三方庫，符合嚴格 CSP (Content-Security-Policy) 規範
 */

(function () {
  "use strict";

  // 1. Live Countdown Timer (Target: 2026-11-21 08:20:00)
  const targetDate = new Date(2026, 10, 21, 8, 20, 0).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    if (diff <= 0) {
      daysEl.innerText = "00";
      hoursEl.innerText = "00";
      minsEl.innerText = "00";
      secsEl.innerText = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % 1000) / 1000);

    daysEl.innerText = String(days).padStart(2, "0");
    hoursEl.innerText = String(hours).padStart(2, "0");
    minsEl.innerText = String(minutes).padStart(2, "0");
    secsEl.innerText = String(seconds).padStart(2, "0");
  }

  // 2. Toast Notification
  function showToast(text, btnElement) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    if (!toast || !toastMsg) return;

    toastMsg.innerText = "已複製：" + text;
    toast.classList.add("show");

    if (btnElement) {
      const origHtml = btnElement.innerHTML;
      btnElement.classList.add("copied");
      btnElement.innerHTML = "<span>✓</span> 已複製";
      setTimeout(function () {
        btnElement.classList.remove("copied");
        btnElement.innerHTML = origHtml;
      }, 2000);
    }

    setTimeout(function () {
      toast.classList.remove("show");
    }, 2500);
  }

  // 3. One-Click Copy Function
  function copyText(text, btnElement) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showToast(text, btnElement);
      }).catch(function () {
        fallbackCopy(text, btnElement);
      });
    } else {
      fallbackCopy(text, btnElement);
    }
  }

  function fallbackCopy(text, btnElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast(text, btnElement);
    } catch (err) {
      alert("請手動複製：" + text);
    }
    document.body.removeChild(textArea);
  }

  // 4. Modal / Lightbox for viewing photos
  function openModal(src) {
    const modal = document.getElementById("image-modal");
    const img = document.getElementById("modal-img");
    if (!modal || !img) return;
    img.src = src;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    const modal = document.getElementById("image-modal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // 5. Security Certification Report Modal
  function openSecModal() {
    const modal = document.getElementById("sec-cert-modal");
    if (!modal) return;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSecModal() {
    const modal = document.getElementById("sec-cert-modal");
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  // 6. Area Info Interactive Selector
  const areaDetails = {
    vip: '<strong style="color: #dc2626;">★ 家長會簽到處 / 運動會捐助處 / 貴賓簽到處：</strong><br>位於<strong>司令臺正右側</strong>，鄰近四年級休息區。所有出席家長、顧問、委員及贊助長官請先在此完成簽到並領取活動資料。',
    stage: '<strong style="color: #2563eb;">司令臺 (大會主席臺)：</strong><br>位於運動場正北側中央，大會主持人、長官貴賓席、開閉幕式主席臺及廣播頒獎核心。',
    g_k: '<strong style="color: #db2777;">幼兒園休息區：</strong><br>位於運動場<strong>正西側（左側跑道外）</strong>，臨近人人賽跑終點線（BA標記）。幼兒小可愛們的專屬集結與休憩基地。',
    g_1: '<strong style="color: #ea580c;">一年級休息區：</strong><br>位於運動場<strong>東南側（右側靠廚房與福星門方向）</strong>，方便小一生進出觀賽與參與趣味活動。',
    g_2: '<strong style="color: #ea580c;">二年級休息區：</strong><br>位於運動場<strong>正東側（右側跑道外中央段）</strong>，緊鄰一年級休息區上方。',
    g_3: '<strong style="color: #ea580c;">三年級休息區：</strong><br>位於運動場<strong>西北側（司令臺左側）</strong>，介於六年級休息區與工作音響區之間。',
    g_4: '<strong style="color: #ea580c;">四年級休息區：</strong><br>位於運動場<strong>東北側（司令臺右側）</strong>，緊鄰家長會簽到處與五年級休息區。',
    g_5: '<strong style="color: #ea580c;">五年級休息區：</strong><br>位於運動場<strong>東北角外側</strong>，緊鄰四年級休息區與排球場方向。',
    g_6: '<strong style="color: #ea580c;">六年級休息區：</strong><br>位於運動場<strong>西北角最外側</strong>，三年級休息區左方，為最高年級大哥哥大姊姊的應援加油特區。',
    fun: '<strong style="color: #16a34a;">趣味競賽場地 (中央大草坪)：</strong><br>位於整個田徑跑道中央大草坪，是各年級學童進行趣味競賽、趣味闖關與歡樂同樂的主場地。',
    gate: '<strong style="color: #059669;">福星門 (來賓主要入口)：</strong><br>位於操場南側（下方入口），家長由福星門進入後，直走穿越跑道旁即直達司令臺旁家長會簽到處。'
  };

  function showAreaInfo(key, btn) {
    document.querySelectorAll(".pill-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    const box = document.getElementById("area-info-display");
    if (box && Object.prototype.hasOwnProperty.call(areaDetails, key)) {
      box.innerHTML = areaDetails[key];
    }
  }

  // 7. Add to Calendar (.ics download)
  function addToCalendar() {
    const icsData = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Fu-Shing Primary School//Sports Day//ZH",
      "BEGIN:VEVENT",
      "UID:fushing-sportsday-115@fsps.ptc.edu.tw",
      "DTSTAMP:20261116T040000Z",
      "DTSTART:20261121T002000Z",
      "DTEND:20261121T073000Z",
      "SUMMARY:屏東市復興國小 115年度校慶運動會",
      "DESCRIPTION:誠摯邀請您共襄盛舉！活動包含大會舞、田徑賽、趣味競賽與大隊接力。家長會簽到處位於司令臺正右側。",
      "LOCATION:屏東縣屏東市復興路376號 (復興國小運動場)",
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", "115復興國小運動會.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("行事曆檔案已下載！");
  }

  // 8. Event Delegation (Pure non-inline events)
  document.addEventListener("DOMContentLoaded", function () {
    updateCountdown();
    setInterval(updateCountdown, 1000);

    document.addEventListener("click", function (e) {
      // Copy Text
      const copyBtn = e.target.closest("[data-copy]");
      if (copyBtn) {
        e.preventDefault();
        copyText(copyBtn.getAttribute("data-copy"), copyBtn);
        return;
      }

      // Area Selector Pill
      const areaBtn = e.target.closest("[data-area]");
      if (areaBtn) {
        e.preventDefault();
        showAreaInfo(areaBtn.getAttribute("data-area"), areaBtn);
        return;
      }

      // Open Image Lightbox
      const imgBtn = e.target.closest("[data-modal-img]");
      if (imgBtn) {
        e.preventDefault();
        openModal(imgBtn.getAttribute("data-modal-img"));
        return;
      }

      // Close Image Lightbox
      if (e.target.closest('[data-action="close-modal"]') || e.target.id === "image-modal") {
        e.preventDefault();
        closeModal();
        return;
      }

      // Open Security Cert Modal
      if (e.target.closest('[data-action="open-sec-modal"]')) {
        e.preventDefault();
        openSecModal();
        return;
      }

      // Close Security Cert Modal
      if (e.target.closest('[data-action="close-sec-modal"]') || e.target.id === "sec-cert-modal") {
        e.preventDefault();
        closeSecModal();
        return;
      }

      // Toggle FAQ
      const faqBtn = e.target.closest('[data-action="toggle-faq"]');
      if (faqBtn) {
        e.preventDefault();
        faqBtn.parentElement.classList.toggle("open");
        return;
      }

      // Add to Calendar
      const calBtn = e.target.closest('[data-action="add-calendar"]');
      if (calBtn) {
        e.preventDefault();
        addToCalendar();
        return;
      }
    });
  });
})();
