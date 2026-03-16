document.addEventListener("DOMContentLoaded", () => {
  Array.from(document.getElementsByTagName("a")).forEach((a) => {
    const a_href = a.getAttribute("href");
    if (!a_href || !a_href.includes("http")) {
      a.setAttribute("target", "_self");
    }
  });

  const menu = document.getElementById("menu-container");
  const top = document.getElementById("top-container");
  if (!menu || !top) return;

  const viewHeight = window.innerHeight;
  const topHeight = top.offsetHeight;
  menu.style.height = `${viewHeight - topHeight}px`;
  menu.style.top = `${topHeight}px`;

  // figure out root path from the CSS link
  const cssLink = document.querySelector('link[href$="main.css"]');
  const rootPath = cssLink
    ? cssLink.getAttribute("href").replace("css/main.css", "")
    : "";

  // inject "Tutorials" label if not present
  if (!menu.querySelector(".menu-section-label")) {
    const label = document.createElement("div");
    label.className = "menu-section-label";
    label.textContent = "Tutorials";
    menu.insertBefore(label, menu.firstChild);
  }

  // inject slides section if not present
  if (!menu.querySelector(".slides-list")) {
    const divider = document.createElement("hr");
    divider.className = "menu-divider";
    menu.appendChild(divider);

    const label = document.createElement("div");
    label.className = "menu-section-label";
    label.textContent = "Weekly Slides";
    menu.appendChild(label);

    const slides = [
      { week: "01", title: "Hello, World.", file: "session1-slides.html" },
      { week: "02", title: "Time & Motion", file: "session2-slides.html" },
      { week: "03", title: "Conditionals, Loops, Functions & Randomness", file: "session3-slides.html" },
      { week: "04", title: "Arrays, Objects, Classes & Data", file: "session4-slides.html" },
      { week: "05", title: "Trigonometry, Recursion, Modulo & Map", file: "session5-slides.html" },
      { week: "06", title: "Sound as Material", file: "session6-slides.html" },
    ];

    const ul = document.createElement("ul");
    ul.className = "slides-list";
    slides.forEach((s) => {
      const li = document.createElement("li");
      const tag = document.createElement("span");
      tag.className = "session-tag";
      tag.textContent = `Week ${s.week}`;
      const a = document.createElement("a");
      a.href = `${rootPath}WeeklySlides/${s.file}`;
      a.textContent = s.title;
      li.appendChild(tag);
      li.appendChild(a);
      ul.appendChild(li);
    });
    menu.appendChild(ul);
  }

  // which menu to keep open
  const url = window.location.href;
  let menuWeek = 7;
  const weekPos = url.indexOf("week");
  const dataPos = url.indexOf("datasets");
  const hashNums = window.location.hash.match(/\d+/g);

  if (dataPos > -1) {
    menuWeek = 5;
  } else if (weekPos > -1) {
    menuWeek = parseInt(url.slice(weekPos + 4, weekPos + 6));
    menuWeek = (menuWeek > 4) ? menuWeek + 1 : menuWeek;
  } else if (hashNums) {
    menuWeek = parseInt(hashNums[0]);
    menuWeek = (menuWeek > 4) ? menuWeek + 1 : menuWeek;
  }

  const menuDetailEls = document.getElementsByClassName("menu-details");

  for (let idx = 0; idx < menuDetailEls.length; idx++) {
    if (idx == menuWeek - 1) {
      menuDetailEls[idx].setAttribute("open", "");
    } else {
      menuDetailEls[idx].removeAttribute("open");
    }
  }
});
