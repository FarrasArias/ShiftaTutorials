document.addEventListener("DOMContentLoaded", () => {
  Array.from(document.getElementsByTagName("a")).forEach((a) => {
    const a_href = a.getAttribute("href");
    if (!a_href || !a_href.includes("http")) {
      a.setAttribute("target", "_self");
    }
  });

  const menu = document.getElementById("menu-container");
  const top = document.getElementById("top-container");
  const viewHeight = window.innerHeight;
  const topHeight = top.offsetHeight;
  menu.style.height = `${viewHeight - topHeight}px`;

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
