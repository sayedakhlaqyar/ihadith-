// DOM Elements
const API_KEY = "AIzaSyAn0ISR2aDdbeoUoM2bsKOGKm0U9zAaNGE";

const logoText = document.querySelector("[data-logo-text]");
const hadithText = document.querySelector("[data-hadith-text]");
const hadithMain = document.querySelector("[data-hadith-main]");
const hadithContainer = document.querySelector("[data-hadith-container]");
const captureImageBtn = document.querySelectorAll("[data-capture-img-btn]");
const bottomBtns = document.querySelector("[data-bottom-btns]");
const captureOverlay = document.querySelector("[data-capture-overlay]");
const captureImageContainer = document.querySelector(
  "[data-capture-img-container]"
);
const overlay = document.querySelector("[data-overlay]");

const overlay2 = document.querySelector(".overlay-2");
const mask = document.querySelector("[data-mask]");
const closeOverlayBtn = document.querySelector("[data-close-overlay-btn]");

// Edit image DOM Elements
const editImagePopup = document.querySelector("[data-edit-img-popup]");
const closeEditImagePopupBtn = document.querySelector(
  "[data-close-img-edit-popup-btn]"
);
const editImageMenuItems = document.querySelectorAll(
  "[data-edit-img-menut-item]"
);
const editImageMain = document.querySelector("[data-edit-img-main]");
const editLogoText = document.querySelector("[data-edit-logo-text]");
const editHadithText = document.querySelector("[data-edit-hadith-text]");
const editImage = document.querySelector("[data-edit-img]");
const editDownloadBtn = document.querySelector("[data-edit-download-btn]");
const tabHeaderItems = document.querySelectorAll("[data-tab-header-item]");

const msgContainer = document.querySelector("[data-msg-container]");

// share link btn
const shareLinkBtns = document.querySelectorAll("[data-share-link-btn]");
// random btn
const randomBtn = document.querySelectorAll("[data-random-btn]");
// copy hadith btn
const copyBtns = document.querySelectorAll("[data-copy-btn]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const mobileNavBtns = document.querySelectorAll("[data-mobile-nav] button");

// modals
const modalOpenBtns = document.querySelectorAll("[data-modal-open]");
const modalCloseBtns = document.querySelectorAll("[data-modal-close]");

// popups
const popupOpenBtns = document.querySelectorAll("[data-popup-open]");
const popupCloseBtns = document.querySelectorAll("[data-popup-close]");

const openFileBgBtn = document.querySelector("[data-open-file-bg-btn]");
const fileInputBg = document.querySelector("[data-input-file-bg]");

const colorInputBg = document.querySelector("[data-input-color-bg]");
const colorInputTitle = document.querySelector("[data-input-color-title]");

const root = window.getComputedStyle(document.body);
const inputShareLink = document.querySelector("[data-input-share-link]");
const copyShareLinkBtn = document.querySelector("[data-copy-link-btn]");

const inputLetterSpacing = document.querySelector(
  "[data-input-letter-spacing]"
);
const inputLineSpacing = document.querySelector("[data-input-line-spacing]");
const rangeLetterSpacing = document.querySelector(
  "[data-range-letter-spacing]"
);
const rangeLineSpacing = document.querySelector("[data-range-line-spacing]");

const hadithBooksArr = [
  "bukhari",
  "muslim",
  "nasai",
  "abudawud",
  "tirmidhi",
  "ibnmajah",
  "malik",
];

let HADITH_BOOK = "";
let HADITH_NUMBER = "";
let ONLINE_STATUS = "";

// Function to arrange colors and backgrounds accordingly
const arrangeColors = () => {
  document.body.classList.remove("text-black", "text-white");

  const randomBg = getRandomColor();
  document.body.style.background = randomBg + "ba";
  document.body.setAttribute("data-bg-clr", randomBg + "ba");
  // colorInputBg.value = randomBg;

  const textColor = getContrastTextColor(randomBg);

  document.documentElement.style.setProperty("--bottom-btns-clr", randomBg);
  let textClass;
  if (textColor == "#000000") {
    textClass = "text-black";
    bottomBtns.style.border = "1.5px solid #4b4a4a";
  } else {
    textClass = "text-white";
    bottomBtns.style.border = "1.5px solid #eee";
  }
  document.body.classList.add(textClass);
  document.body.setAttribute("data-text-clr", textClass);
};

// Function to generate a random number between min and max (inclusive)
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const langId = localStorage.getItem("defaultLang");
let randomBook;

// Function to fetch a random Hadith book
const fetchRandomHadithBook = async () => {
  // Get the user's selected language from localStorage
  const langId = localStorage.getItem("defaultLang");

  // Generate a random Hadith book ID
  const randomHadithBookId =
    hadithBooksArr[getRandomNumber(0, hadithBooksArr.length - 1)];
  randomBook = randomHadithBookId;

  // Construct the path to the random Hadith book JSON file
  const randomHadithBookPath = `/data/${langId}-${randomHadithBookId}.json`;
  const bookURL = `${langId}-${randomHadithBookId}`;
  // For the arabic language we add the arabic class to set up the text align
  if (langId === "ara") {
    hadithText.classList.add("arabic");
    document.body.classList.add("arabic");
  } else {
    hadithText.classList.remove("arabic");
    document.body.classList.remove("arabic");
  }

  // create loader
  createLoader();
  disableButtons();
  document.body.classList.remove("error");
  document.body.classList.add("loading");

  try {
    // const response = await fetch(randomHadithBookPath);
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${bookURL}.json`
    );
    const data = await response.json();
    // Call the appendRandomHadith function with the retrieved Hadith data
    appendRandomHadith(data.hadiths, data.metadata.name);
    document.body.classList.remove("loading");
  } catch (error) {
    createMsg("Something went wrong! Please try again.", 1000, true);
    document.querySelector(".loader__container").remove();
    document.body.classList.add("error");
    disableButtons();
  }
};

// Function to append a random Hadith to the DOM
const gradesList = document.querySelector("[data-grades-list]");
const gradeHadithNum = document.querySelector(
  ".grades__popup .grade__hadtih-num"
);

const appendRandomHadith = (hadiths, bookFullName) => {
  gradesList.innerHTML = "";

  // arrangeColors();
  enableButtons();
  // Select a random Hadith from the provided array
  const nonEmptyHadiths = hadiths.filter((hadith) => hadith.text.trim() !== "");
  const randomHadith =
    nonEmptyHadiths[getRandomNumber(0, nonEmptyHadiths.length - 1)];

  const { grades } = randomHadith;
  const shareLink = `${randomBook}_${randomHadith.hadithnumber}`;
  hadithText.innerHTML = `<div class="hadith-text">
  ${randomHadith.text}
  </div>`;
  // +
  // `<div class="bookName">(${bookFullName}, ${randomHadith.hadithnumber})</div>`;
  // console.log(randomHadith);
  hadithText.insertAdjacentHTML(
    "beforeend",
    `<div class="bookName">(${bookFullName}, ${randomHadith.hadithnumber})</div>`
  );
  shareLinkBtns.forEach((linkBtn) =>
    linkBtn.setAttribute("data-share-link", shareLink)
  );

  // set the share link for the input link and also for the qr code
  inputShareLink.value = `${document.URL}?book=${shareLink}`;
  inputShareLink.setAttribute(
    "data-book",
    bookFullName + randomHadith.hadithnumber
  );
  qrCodeElem.setAttribute("data-qr-value", `${document.URL}?book=${shareLink}`);
  HADITH_BOOK = bookFullName;
  HADITH_NUMBER = randomHadith.hadithnumber;

  // getting grades ot the hadith
  gradeHadithNum.innerText = `${bookFullName}, Hadith ${randomHadith.hadithnumber}`;
  grades.forEach((grade) => {
    const gradeItem = document.createElement("div");
    gradeItem.classList.add(
      "grade__item",
      grade.grade.replaceAll(" ", "").toLowerCase()
    );

    const gradeDiv = document.createElement("div");
    gradeDiv.classList.add("grade");
    gradeDiv.innerText = grade.grade;

    const gradeName = document.createElement("span");
    gradeName.classList.add("grade__name");
    gradeName.innerHTML = grade.name;

    gradeItem.appendChild(gradeDiv);
    gradeItem.appendChild(gradeName);
    gradesList.appendChild(gradeItem);
  });
};

// Function to create loader
const createLoader = () => {
  const loaderContainer = document.createElement("div");
  loaderContainer.classList.add("loader__container");

  const loader = document.createElement("span");
  loader.classList.add("loader");

  const loaderText = document.createElement("div");
  loaderText.innerHTML = "Loading...";
  loaderText.classList.add("loader__text");

  loaderContainer.appendChild(loader);
  loaderContainer.appendChild(loaderText);

  hadithText.appendChild(loaderContainer);
};

// Function to fetch and display a specific book and hadith number
const fetchBookAndDisplay = async (bookId, hadithNumber) => {
  gradesList.innerHTML = "";
  // Construct the path to the book JSON file based on bookId
  // const bookPath = `/data/${langId}-${bookId}.json`;
  const bookPath = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${langId}-${bookId}.json`;

  createLoader();
  disableButtons();
  document.body.classList.remove("error");
  document.body.classList.add("loading");

  // Fetch the book data
  try {
    const response = await fetch(bookPath);
    const data = await response.json();

    // Find the specified hadith by hadithNumber
    const hadith = data.hadiths.find(
      (item) => item.hadithnumber == hadithNumber
    );

    const { grades } = hadith;

    if (hadith && hadith.text !== "") {
      // Display the hadith
      enableButtons();
      // arrangeColors();
      document.body.classList.remove("loading");

      hadithText.innerHTML =
        hadith.text +
        `<div class="bookName">(${data.metadata.name}, ${hadith.hadithnumber})</div>`;

      gradeHadithNum.innerText = `${data.metadata.name}, ${hadith.hadithnumber}`;

      const shareLink = `${bookId}_${hadithNumber}`;
      inputShareLink.value = `${document.URL}?book=${shareLink}`;
      inputShareLink.setAttribute(
        "data-book",
        data.metadata.name + hadith.hadithnumber
      );
      qrCodeElem.setAttribute("data-qr-value", `${document.URL}`);

      grades.forEach((grade) => {
        const gradeItem = document.createElement("div");
        gradeItem.classList.add(
          "grade__item",
          grade.grade.replaceAll(" ", "").toLowerCase()
        );

        const gradeDiv = document.createElement("div");
        gradeDiv.classList.add("grade");
        gradeDiv.innerText = grade.grade;

        const gradeName = document.createElement("span");
        gradeName.classList.add("grade__name");
        gradeName.innerHTML = grade.name;

        gradeItem.appendChild(gradeDiv);
        gradeItem.appendChild(gradeName);
        gradesList.appendChild(gradeItem);
      });
    } else {
      hadithText.innerHTML = "";
      // createMsg("No text availabe for this hadith!", 2000, false);
      document.querySelector(
        ".search__nf .title-2 .book"
      ).innerText = `(${data.metadata.name}, ${hadith.hadithnumber})`;
      document.body.removeAttribute("style");
      document.body.classList.remove("text-white", "text-black");
      document.body.classList.add("snf");
    }
  } catch (error) {
    createMsg("Something went wrong! Please try again.", 1000, true);
    document.body.classList.add("error");
    document.querySelector(".loader__container").remove();
    disableButtons();
  }
};

// check if there's a "book" parameter in the URL fetch it
window.addEventListener("load", () => {
  // arrangeColors();
  mobileNav.classList.add("show");
  const params = new URLSearchParams(window.location.search);
  const bookIdParam = params.get("book");
  document.querySelector(".spacebar__info").classList.add("show");
  // document.querySelector(".top__btns").style.display = "flex";
  document.querySelector(".top__btns").classList.add("show");

  // if the user is online then fetch the book data

  if (ONLINE_STATUS == "online") {
    if (bookIdParam) {
      const [bookId, hadithNumber] = bookIdParam.split("_");

      // Fetch and display the specified book and hadith number
      fetchBookAndDisplay(bookId, hadithNumber);
    } else {
      // If there's no "book" parameter, fetch a random book as before
      fetchRandomHadithBook();
    }
  }
});

// Function to remove the "book" parameter from the URL
const removeBookParameter = () => {
  const params = new URLSearchParams(window.location.search);
  params.delete("book");
  const newURL = `${window.location.pathname}${params.toString()}`;
  history.replaceState({}, "", newURL);
};

// capture audio
const loaderFixed = document.querySelector("[data-loader-fixed]");
const captureAud = new Audio("assets/capture.mp3");
captureImageBtn.forEach((captureBtn) => {
  editImageMain.style.background = "";

  captureBtn.addEventListener("click", () => {
    const bgColor = document.body.style.background;

    document.body.setAttribute("data-bg-clr", bgColor);
    document.body.classList.add("capturing", "loader-active");
    mask.style.display = "block";
    // editImageMain.style.background = bgColor;
    captureOverlay.classList.add("captured");

    if (langId === "ara") {
      editHadithText.classList.add("arabic");
    } else {
      editHadithText.classList.remove("arabic");
    }

    // remove any popup active
    document
      .querySelectorAll(".popup")
      .forEach((pop) => pop.classList.remove("popup-active"));

    captureAud.play();
    setTimeout(() => {
      captureOverlay.classList.remove("captured");
      html2canvas(document.body, { scale: 3 }).then((canvas) => {
        captureOverlay.classList.remove("captured");

        canvas.toBlob((blob) => {
          const capturedImg = URL.createObjectURL(blob);
          editImageMain.style.background = bgColor;
          editLogoText.innerHTML = logoText.innerHTML;
          if (langId == "eng") {
            editHadithText.innerHTML = truncateText(
              hadithText.querySelector(".hadith-text").innerHTML,
              600
            );
          } else {
            editHadithText.innerHTML = truncateText(
              hadithText.querySelector(".hadith-text").innerHTML,
              500
            );
          }
          editHadithText.insertAdjacentHTML(
            "beforeend",
            `<div class="bookName">(${HADITH_BOOK}, ${HADITH_NUMBER})</div>`
          );

          setTimeout(() => {
            fitTextToContainer();
          });
          // Call the function whenever you need to fit the text (e.g., after updating the text content)

          document.body.classList.remove("capturing", "loader-active");
          mask.style.display = "none";
          document.body.classList.add("captured");
          editImagePopup.classList.add("show");
        });
      });
    }, 250);
  });
});

const fitTextToContainer = () => {
  const container = document.querySelector(".hadith__text-container");
  const text = document.querySelector("[data-edit-hadith-text]");

  const containerHeight = container.offsetHeight;

  // Reset the font size to auto before dynamically adjusting it
  text.style.fontSize = "auto";
  if (text.classList.contains("arabic")) text.style.fontSize = "2rem";

  while (text.scrollHeight > containerHeight) {
    let currentFontSize = parseFloat(getComputedStyle(text).fontSize);
    currentFontSize -= 1;
    text.style.fontSize = currentFontSize + "px";
    text.querySelector(".bookName").style.fontSize = currentFontSize + "px";
  }
};

// Function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text; // Return the original text if it's shorter than or equal to the maxLength
  } else {
    const truncatedText = text.slice(0, maxLength - 3) + "..."; // Shorten the text and add an ellipsis
    return truncatedText;
  }
};

copyBtns.forEach((btn) =>
  btn.addEventListener("click", () => copyHadithText())
);

randomBtn.forEach((randBtn) =>
  randBtn.addEventListener("click", () => {
    if (randBtn.classList.contains("disable")) return;
    hadithText.innerHTML = "";
    removeBookParameter();
    fetchRandomHadithBook();
    document.body.classList.remove("snf");
  })
);

closeEditImagePopupBtn.addEventListener("click", () => {
  document.body.classList.remove("text-white", "text-black");
  editImagePopup.classList.remove("show");
  document.body.style.background = document.body.getAttribute("data-bg-clr");
  document.body.classList.add(document.body.getAttribute("data-text-clr"));
  logoText.removeAttribute("style");
  hadithText.removeAttribute("style");
  editLogoText.removeAttribute("style");
  editHadithText.removeAttribute("style");

  resetUI();
});

closeOverlayBtn.addEventListener("click", () => resetUI());
overlay.addEventListener("click", () => {
  resetUI();
});

// Funtion to disable mobile nav btns
const disableButtons = () => {
  mobileNavBtns.forEach((btn) => btn.classList.add("disable"));
  randomBtn.forEach((randBtn) => randBtn.classList.add("disable"));
  document
    .querySelectorAll(".top__btns button")
    .forEach((btn) => btn.classList.add("disable"));
  document.querySelector(".search__random-btn").classList.remove("disable");
};

// Funtion to enable mobile nav btns
const enableButtons = () => {
  mobileNavBtns.forEach((btn) => btn.classList.remove("disable"));
  document
    .querySelectorAll(".top__btns button")
    .forEach((btn) => btn.classList.remove("disable"));
};

// Function to copy share link
const copyShareLink = () => {
  const shareLink = shareLinkBtns[0].getAttribute("data-share-link");

  navigator.clipboard.writeText(window.location.href + "?book=" + shareLink);
  createMsg("Link copied successfully!", 1000, false);
};

// Funciton to copy hadith text
const copyHadithText = () => {
  navigator.clipboard.writeText("(ihadith)" + "\n" + hadithText.innerText);
  if (hadithText.innerText.length > 0) {
    createMsg("Hadith copied successfully!", 1000, false);
  }
};

// Function to create msg
let idx = 0;
const createMsg = (msg, time, isVisible) => {
  idx++;
  const msgDiv = document.createElement("div");
  msgDiv.className = "msg";
  msgDiv.innerHTML = msg;
  if (
    document.documentElement.style.getPropertyValue("--bottom-btns-clr") !== ""
  ) {
    msgDiv.style.backgroundColor = "var(--bottom-btns-clr)";
  }
  setTimeout(() => {
    msgDiv.classList.add("show");
    msgDiv.style.top = `calc(${idx} * 1rem)`;
    if (!isVisible) {
      setTimeout(() => {
        idx--;
        msgDiv.classList.remove("show");
        setTimeout(() => {
          msgDiv.remove();
        }, 100);
      }, time);
    }
  });

  msgContainer.appendChild(msgDiv);
};

// Function to download image
const downloadImage = (name, fileType) => {
  document.body.classList.remove("captured");
  document.body.classList.add("capturing");
  html2canvas(document.body, { scale: 3 }).then((canvas) => {
    canvas.toBlob((blob) => {
      saveAs(blob, name + fileType);
      document.body.classList.add("captured");
      document.body.classList.remove("capturing");
    });
  });
};

/**
 * Edit Image Popup
 */

const engFonts = [
  "IBMPlexSans",
  "Lato",
  "Montserrat",
  "Mooli",
  "Nunito",
  "OpenSans",
  "Oswald",
  "PlayfairDisplay",
  "Poppins",
  "Raleway",
  "REM",
  "Roboto",
  "Stylish",
  "Ubuntu",
];

const backgrounds = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
];

const backgroundColors = [
  "#ffffff",
  "#e67e22", //flat ui palette
  "#f1c40f",
  "#f39c12",
  "#c0392b",
  "#bdc3c7",
  "#1abc9c",
  "#16a085",
  "#2ecc71",
  "#27ae60",
  "#d35400",
  "#3498db",
  "#2980b9",
  "#e74c3c",
  "#c0392b",
  "#bdc3c7",
  "#ecf0f1",
  "#8e44ad",
  "#9b59b6",
  "#34495e",
  "#2c3e50",
  "#95a5a6",
  "#7f8c8d",
  "#55efc4", //american palette
  "#00b894",
  "#ffeaa7",
  "#fdcb6e",
  "#81ecec",
  "#00cec9",
  "#fab1a0",
  "#e17055",
  "#d63031",
  "#ff7675",
  "#0984e3",
  "#74b9ff",
  "#a29bfe",
  "#6c5ce7",
  "#fd79a8",
  "#e84393",
  "#2d3436",
  "#636e72",
  "#b2bec3",
  "#dfe6e9",
  "#f6e58d", //aussie palette
  "#f9ca24",
  "#7ed6df",
  "#22a6b3",
  "#ffbe76",
  "#f0932b",
  "#e056fd",
  "#be2edd",
  "#4834d4",
  "#686de0",
  "#eb4d4b",
  "#ff7979",
  "#badc58",
  "#6ab04c",
  "#30336b",
  "#130f40",
  "#535c68",
  "#95afc0",
  "#c7ecee",
  "#dff9fb",
  "#00a8ff", //british palette
  "#0097e6",
  "#e84118",
  "#c23616",
  "#9c88ff",
  "#8c7ae6",
  "#f5f6fa",
  "#dcdde1",
  "#fbc531",
  "#e1b12c",
  "#7f8fa6",
  "#718093",
  "#192a56",
  "#273c75",
  "#44bd32",
  "#4cd137",
  "#487eb0",
  "#353b48",
  "#40739e",
  "#2f3640",
  "#ff9ff3", //canadian palette
  "#f368e0",
  "#00d2d3",
  "#01a3a4",
  "#feca57",
  "#ff9f43",
  "#54a0ff",
  "#2e86de",
  "#341f97",
  "#5f27cd",
  "#ee5253",
  "#ff6b6b",
  "#48dbfb",
  "#0abde3",
  "#c8d6e5",
  "#8395a7",
  "#1dd1a1",
  "#10ac84",
  "#576574",
  "#222f3e",
  "#eccc68", //chinese palette
  "#ffa502",
  "#7bed9f",
  "#2ed573",
  "#1e90ff",
  "#70a1ff",
  "#ff6348",
  "#ff7f50",
  "#ff6b81",
  "#ff4757",
  "#5352ed",
  "#3742fa",
  "#f1f2f6",
  "#747d8c",
  "#a4b0be",
  "#57606f",
  "#2f3542",
  "#ced6e0",
  "#dfe4ea",
];

editImageMenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const tab = document.querySelector(item.getAttribute("data-tab-open"));
    const modal = document.querySelector(item.dataset.modalOpen);
    const menuText = item.querySelector(".menu__text").innerText.toLowerCase();
    document
      .querySelectorAll(".modal")
      .forEach((modal2) => modal2.classList.remove("no-anim"));

    if (!item.classList.contains("isSelected")) {
      editImageMenuItems.forEach((item2) =>
        item2.classList.remove("isSelected")
      );

      item.classList.add("isSelected");
      openTab(tab);
      openModal(modal);
      if (menuText == "font" && tabListFont.childElementCount > 0) {
        loadedFonts.clear();
        fetchMoreFonts(defaultFontLanguage);
      }
    } else {
      item.classList.remove("isSelected");
      closeTab(tab);
      closeModal(modal);
    }
  });
});

tabHeaderItems.forEach((tabItem) => {
  tabItem.addEventListener("click", () => {
    tabHeaderItems.forEach((tabItem2) => {
      tabItem2.classList.remove("active");
      tabItem2.style.pointerEvents = "all";
    });
    tabItem.classList.add("active");
    tabItem.style.pointerEvents = "none";

    // selecting the clicked btn
    const query = tabItem
      .getElementsByTagName("span")[1]
      .innerText.toLowerCase()
      .replace(" ", "");
    // append the bg list items according to the clicked btn
    appendBgListItems(query);

    const modal = document.querySelector(tabItem.dataset.modalOpen);
    if (modal) {
      modal.classList.add("no-anim");
      openModal(modal);
    }

    openFileBgBtn.innerText = "Open from file";
  });
});

import { gradient } from "./gradients.js";

// Function to append bg list items
const tabListBg = document.querySelector("[data-tab-list-bg]");
const appendBgListItems = (query) => {
  // tabListBg.classList.remove("bg-image", "color", "gradient", "file");
  // tabListBg.innerHTML = "";
  if (query === "image" && !tabListBg.classList.contains("bg-image")) {
    tabListBg.innerHTML = "";
    tabListBg.classList.remove("bg-image", "color", "gradient", "file");
    tabListBg.classList.add("bg-image");
    backgrounds.forEach((bg) => {
      const bgPath = `/assets/images/backgrounds/${bg}.webp`;
      createBgTab(query, bgPath);
    });
  } else if (query === "color" && !tabListBg.classList.contains("color")) {
    tabListBg.innerHTML = "";
    tabListBg.classList.remove("bg-image", "color", "gradient", "file");
    tabListBg.classList.add("color");
    backgroundColors.forEach((bgColor) => {
      createBgTab(query, bgColor);
    });
  } else if (
    query === "gradient" &&
    !tabListBg.classList.contains("gradient")
  ) {
    tabListBg.innerHTML = "";
    tabListBg.classList.remove("bg-image", "color", "gradient", "file");
    tabListBg.classList.add("gradient");
    for (let i = 0; i < 50; i++) {
      const li = `
      <li class="list__item gr-color" style="background: linear-gradient(to right, ${gradient[i].colors[0]}, ${gradient[i].colors[1]})">
      </li>`;
      tabListBg.innerHTML += li;
    }
  } else if (query === "fromfile" && !tabListBg.classList.contains("file")) {
    tabListBg.classList.remove("bg-image", "color", "gradient", "file");
    tabListBg.classList.add("file");
    const fileBgImage = document.createElement("div");
    fileBgImage.classList.add("file__bg-image");
    const img = document.createElement("img");
    img.classList.add("file-bg");

    const span = document.createElement("span");
    span.classList.add("preview__text");
    span.innerHTML = "Preview";

    fileBgImage.appendChild(img);
    fileBgImage.appendChild(span);
    tabListBg.appendChild(fileBgImage);
  }

  // set background when clicked the image or background color
  const allBgListItems = tabListBg.querySelectorAll(".list__item");
  allBgListItems.forEach((listItem) => {
    listItem.addEventListener("click", () => setBg(listItem));
  });
};

// create background tab
const createBgTab = (query, bg) => {
  if (query === "image") {
    const li = `
            <li class="list__item bg-image">
              <img src="${bg}" loading="lazy"/>
            </li>`;
    tabListBg.innerHTML += li;
    // tabListBg.classList.add("bg-image");
  } else if (query === "color") {
    const li = `
            <li class="list__item color" style="background: ${bg}; color: var(--white);">
              <span>${bg}</span>
            </li>`;
    tabListBg.innerHTML += li;
    // tabListBg.classList.add("color");
  }
};

/**
 * Fething fonts from the google api
 */

// Function to create a loading card
const createLoadingCard = () => {
  return `<div class="card loading list__item">
    <span class="card__text">Loading...</span>
  </div>`;
};

// Keep track of loaded fonts and whether they are currently loaded
const tabListFont = document.querySelector("[data-tab-list]");
const loadedFonts = new Set();
const fontsPerPage = 5; // Number of fonts to load per batch
let defaultFontLanguage = window.localStorage.getItem("defaultLang");
let isFetching = false;

switch (defaultFontLanguage) {
  case "eng":
    defaultFontLanguage = "latin";
    break;
  case "ara":
    defaultFontLanguage = "arabic";
    break;
  default:
    defaultFontLanguage = "latin";
}
// Function to add loading cards
const addLoadingCards = () => {
  const loadingCards = Array.from({ length: fontsPerPage }, createLoadingCard);
  tabListFont.insertAdjacentHTML("beforeend", loadingCards.join(""));
};

// Function to remove loading cards
const removeLoadingCards = () => {
  const loadingCards = tabListFont.querySelectorAll(".loading");
  loadingCards.forEach((card) => {
    card.remove();
  });
};

// Function to fetch more fonts
let fetchTimeout;
const fetchMoreFonts = async (lang) => {
  if (isFetching) return;

  isFetching = true;

  // remove the tab according to the default language
  if (langId == "eng") {
    tabFontItems[0].classList.add("active");
    tabFontItems[0].classList.remove("ff-disable");
    tabFontItems[1].classList.remove("active");
    tabFontItems[1].classList.add("ff-disable");
  } else {
    tabFontItems[0].classList.remove("active");
    tabFontItems[0].classList.add("ff-disable");
    tabFontItems[1].classList.add("active");
    tabFontItems[1].classList.remove("ff-disable");
  }

  try {
    // Add loading cards before making the API request
    addLoadingCards();

    // Clear any existing fetch timeout to reset the timer
    clearTimeout(fetchTimeout);

    // Set a delay of 1000 milliseconds (1 second) before fetching more data
    fetchTimeout = setTimeout(async () => {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}&subset=${lang}&sort=popularity`
      );
      const data = await response.json();
      let totalFonts = data.items.length;
      // Filter out fonts that are already loaded
      const newFonts = data.items.filter(
        (font) => !loadedFonts.has(font.family)
      );

      if (newFonts.length <= 0) return;

      // console.log(loadedFonts)
      // Remove loading cards before appending new fonts
      removeLoadingCards();

      // Load the fonts
      newFonts.slice(0, fontsPerPage).forEach(async (font) => {
        const familyName = font.family;
        const familySrc = font.files.regular;
        const fontFace = `
          @font-face {
              font-family: '${familyName}';
              src: url('${familySrc}');
          }`;

        let newCard = `<div class="card list__item ${defaultFontLanguage == "latin" ? "english" : defaultFontLanguage
          }">
              <p class="card__text" style="font-family: '${familyName}';">${lang == "arabic" ? "سعيد اخلاق يار" : "Saeed Akhlaq Yaar"
          }</p>
            <small>${familyName}</small>
              <style>${fontFace}</style>
            </div>`;

        // Append the new card to tabListFont
        tabListFont.insertAdjacentHTML("beforeend", newCard);

        // Add the loaded font to the set to prevent duplicates
        loadedFonts.add(familyName);
      });

      // change the font family when clicked on a font card
      const fontCards = tabFont.querySelectorAll(".card");

      fontCards.forEach((card) => {
        card.addEventListener("click", () => {
          const fontName = card.querySelector("small").innerText;

          // change the font of logo and hadith
          if (defaultFontLanguage === "arabic") {
            hadithText.style.fontFamily = fontName;
            editHadithText.style.fontFamily = fontName;
          } else {
            logoText.style.fontFamily = fontName;
            hadithText.style.fontFamily = fontName;

            editLogoText.style.fontFamily = fontName;
            editHadithText.style.fontFamily = fontName;
            editHadithText.querySelector(".bookName").style.fontFamily =
              fontName;
          }
        });
      });
    }, 500);
  } catch (error) {
    console.error("Error fetching fonts:", error);
  } finally {
    isFetching = false;
  }
};

// fetch more fonts when scrolling inside the tabListFont
tabListFont.addEventListener("scroll", () => {
  // if (loadedFonts.size == totalFonts) return;
  if (
    tabListFont.scrollTop + tabListFont.clientHeight >=
    tabListFont.scrollHeight
  ) {
    fetchMoreFonts(defaultFontLanguage);
  }
});

const tabFont = document.querySelector(".menu__tab#tabFont");
const tabFontItems = tabFont.querySelectorAll(".tab__header-item");

tabFontItems.forEach((item) => {
  item.addEventListener("click", () => {
    // logoText.style.fontFamily = "";
    // hadithText.style.fontFamily = "";

    // editLogoText.style.fontFamily = "";
    // editHadithText.style.fontFamily = "";
    // editHadithText.querySelector(".bookName").style.fontFamily = "";

    console.log(tabFontItems);
    loadedFonts.clear();
    tabListFont.innerHTML = "";
    const tabText = item
      .querySelector(".tab__header-item-text")
      .innerText.toLowerCase();
    defaultFontLanguage = tabText;

    if (tabText == "english") defaultFontLanguage = "latin";
    fetchMoreFonts(defaultFontLanguage);
  });
});

// create color tab
const tabListColor = document.querySelector("[data-tab-list-color]");
const createColorTab = () => {
  tabListColor.innerHTML = "";
  tabListColor.classList.remove("font");
  backgroundColors.forEach((color) => {
    const li = `
            <li class="list__item color" style="background: ${color};">
              <span>${color}</span>
            </li>`;
    tabListColor.innerHTML += li;
  });

  const colorListItems = tabListColor.querySelectorAll(".list__item");

  colorListItems.forEach((clrItem) => {
    clrItem.addEventListener("click", () => {
      // changeTextClr(clrItem)
      const color = clrItem.querySelector("span").innerText;
      changeTextClr(color);
    });
  });
};

/**
 * letter spacing and line height functionality
 */
const tabSpacing = document.querySelector(".menu__tab#tabSpacing");
const tabSpacingItems = tabSpacing.querySelectorAll(".tab__header-item");
const tabRanges = tabSpacing.querySelector(".ranges");
rangeLineSpacing.style.background = `linear-gradeint(to right, #f3f3f3, red 0)`;

tabSpacingItems.forEach((item) => {
  item.addEventListener("click", () => {
    const itemText = item
      .querySelector(".tab__header-item-text")
      .innerText.toLowerCase();
    tabRanges.setAttribute("data-target", itemText);

    inputLetterSpacing.value = 0;
    inputLineSpacing.value = 0;
    rangeLetterSpacing.removeAttribute("disabled");
    rangeLineSpacing.removeAttribute("disabled");
    rangeLetterSpacing.value = 0;
    rangeLineSpacing.value = 0;

    rangeLetterSpacing.style.background = `linear-gradient(90deg, var(--veronica) 0%, #e2e2e2 0%)`;
    rangeLineSpacing.style.background = `linear-gradient(90deg, var(--veronica) 0%, #e2e2e2 0%)`;

    const letterValue = item.getAttribute("data-range-letter-value");
    const rangeValue = item.getAttribute("data-range-line-value");

    if (rangeValue) {
      rangeLineSpacing.value = rangeValue;
      inputLineSpacing.value = rangeValue / 100;

      const percentage = ((rangeLineSpacing.value - 140) / (250 - 140)) * 100;
      rangeLineSpacing.style.background = `linear-gradient(90deg, var(--veronica) ${percentage}%, #e2e2e2 ${percentage}%)`;
    }

    if (
      (rangeValue && rangeValue == 170) ||
      (rangeValue && rangeValue == 140)
    ) {
      rangeLineSpacing.value = 0;
      inputLineSpacing.value = 0;
      rangeLetterSpacing.style.background = `linear-gradient(90deg, var(--veronica) 0%, #e2e2e2 0%)`;
      rangeLineSpacing.style.background = `linear-gradient(90deg, var(--veronica) 0%, #e2e2e2 0%)`;
    }

    if (letterValue) {
      rangeLetterSpacing.value = letterValue;
      inputLetterSpacing.value = letterValue;

      const percentage = (rangeLetterSpacing.value / 40) * 100;
      rangeLetterSpacing.style.background = `linear-gradient(90deg, var(--veronica) ${percentage}%, #e2e2e2 ${percentage}%)`;
    }
  });
});

rangeLetterSpacing.addEventListener("input", () => {
  const percentage = (rangeLetterSpacing.value / 40) * 100;
  rangeLetterSpacing.style.background = `linear-gradient(90deg, var(--veronica) ${percentage}%, #e2e2e2 ${percentage}%)`;

  const target = tabRanges.getAttribute("data-target");
  inputLetterSpacing.value = rangeLetterSpacing.value;

  if (target == "logo") {
    logoText.style.letterSpacing = rangeLetterSpacing.value + "px";
    editLogoText.style.letterSpacing = rangeLetterSpacing.value + "px";
    tabSpacingItems[0].setAttribute(
      "data-range-letter-value",
      rangeLetterSpacing.value
    );
  } else if (target == "text") {
    hadithText.style.letterSpacing = rangeLetterSpacing.value + "px";
    editHadithText.style.letterSpacing = rangeLetterSpacing.value + "px";
    tabSpacingItems[1].setAttribute(
      "data-range-letter-value",
      rangeLetterSpacing.value
    );
  }
});

rangeLineSpacing.addEventListener("input", () => {
  const percentage = ((rangeLineSpacing.value - 140) / (250 - 140)) * 100;
  rangeLineSpacing.style.background = `linear-gradient(90deg, var(--veronica) ${percentage}%, #e2e2e2 ${percentage}%)`;

  const target = tabRanges.getAttribute("data-target");
  inputLineSpacing.value = rangeLineSpacing.value / 100;

  if (target == "logo") {
    logoText.style.lineHeight = rangeLineSpacing.value / 100;
    editLogoText.style.lineHeight = rangeLineSpacing.value / 100;
    tabSpacingItems[0].setAttribute(
      "data-range-line-value",
      rangeLineSpacing.value
    );
    if (inputLineSpacing.value == 1.4) {
      inputLineSpacing.value = 0;
    }

    // if (rangeLetterSpacing.value == 140) {
    //   inputLineSpacing.value = 0;
    //   tabSpacingItems[0].setAttribute("data-range-line-value", 140);
    //   tabSpacingItems[1].setAttribute("data-range-line-value", 170);
    // }
  } else if (target == "text") {
    hadithText.style.lineHeight = rangeLineSpacing.value / 100;
    editHadithText.style.lineHeight = rangeLineSpacing.value / 100;
    tabSpacingItems[1].setAttribute(
      "data-range-line-value",
      rangeLineSpacing.value
    );
    if (inputLineSpacing.value == 1.4) {
      hadithText.style.lineHeight = 1.7;
      inputLineSpacing.value = 0;
      tabSpacingItems[1].setAttribute("data-range-line-value", 170);
    }
  }
});

// const editBgImg = document.querySelector("[data-edit-bg-img]");

// set the background
const setBg = (elem) => {
  document.body.style.background = "";
  const bg = elem.firstElementChild;

  if (elem.classList.contains("color")) {
    editImageMain.style.background = elem.style.background;
    document.body.style.background = elem.style.background;
  } else if (elem.classList.contains("gr-color")) {
    editImageMain.style.background = elem.style.background;
    document.body.style.background = elem.style.background;
  } else if (elem.classList.contains("bg-image")) {
    editImageMain.style.background = `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('${bg.src}')`;
    editImageMain.style.backgroundSize = "cover";
    editImageMain.style.backgroundPosition = "center";
    editImageMain.style.backgroundAttachment = "fixed";

    hadithMain.style.backgroundColor = "transparent";
    document.body.style.background = `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('${bg.src}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    editImageMain.style.background = `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('${bg.src}')`;
    editImageMain.style.backgroundSize = "cover";
    editImageMain.style.backgroundPosition = "center";
    editImageMain.style.backgroundAttachment = "fixed";

    hadithMain.style.backgroundColor = "transparent";
    document.body.style.background = `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)),url('${bg.src}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }
};

// Function to open the active tab
const openTab = (tab) => {
  if (tab === null) return;
  document
    .querySelectorAll(".modal")
    .forEach((modal) => modal.classList.remove("modal-active"));

  document
    .querySelectorAll(".tab-active")
    .forEach((tab2) => tab2.classList.remove("tab-active"));

  tabHeaderItems.forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".tab__list").forEach((list) => {
    if (!list.classList.contains("file")) {
      list.innerHTML = "";
    } else {
      tabHeaderItems[0].classList.add("active");
    }
  });

  tab.classList.add("tab-active");
  overlay.classList.add("show");

  colorInputBg.removeAttribute("data-target");

  // when the font tab is clicked then call createFonts
  if (tab.id == "tabFont") {
    // call the fontTab
    tab.querySelectorAll(".tab__header-item")[0].classList.add("active");
    fetchMoreFonts(defaultFontLanguage);
  } else if (tab.id == "tabColor") {
    // call the createColorTab
    createColorTab();
    colorInputBg.setAttribute("data-target", "text");
  }
};

// Function to close the active tab
const closeTab = (tab) => {
  resetUI();
  tab.classList.remove("tab-active");
  overlay.classList.remove("show");
};

// popup open btns
popupOpenBtns.forEach((openBtn) => {
  openBtn.addEventListener("click", () => {
    if (openBtn.classList.contains("search__more")) {
      document.querySelector(".search__container").classList.add("show");
      document.querySelector("#popupSearch").classList.add("popup-active");
      document.body.classList.add("snf");
      searchSelectedItem.innerHTML = "Sahih al-Bukhari";
      inputSearchHadithNum.value = "";
    } else {
      const popup = document.querySelector(openBtn.dataset.popupOpen);
      openPopup(popup);
    }
  });
});

// popup close btns
popupCloseBtns.forEach((closeBtn) => {
  closeBtn.addEventListener("click", () => {
    const popup = document.querySelector(closeBtn.dataset.popupClose);
    closePopup(popup);
  });
});

// Funtion to open popup
const openPopup = (popup) => {
  if (popup === null) return;
  if (popup.id == "popupCustomGradient") {
    overlay2.classList.add("show");
  }

  const searchContainer = document.querySelector(".search__container");
  const gradesContainer = document.querySelector(".grades__container");
  const shareContainer = document.querySelector(".share__container");

  if (popup.id == "popupSearch") {
    searchContainer.classList.add("show");
    document.body.classList.add("h-100");
    // when there is no grades fot the hadith
  } else if (popup.id == "popupGrades" && gradesList.childElementCount == 0) {
    createMsg("No grades found for this hadith!", 1000, false);
    return true;
  } else if (popup.id == "popupGrades") {
    gradesContainer.classList.add("show");
    document.body.classList.add("h-100");
  } else if (popup.id == "popupShare") {
    shareContainer.classList.add("show");
    document.body.classList.add("h-100");
  } else if (popup.id == "popupQRCode") {
    document.querySelector("#popupQRCode").classList.add("scan");
    qrCodeElem.classList.add("scan");

    setTimeout(() => {
      generateQRCode(qrCodeElem.getAttribute("data-qr-value"));
      qrCodeElem.classList.remove("scan");
      document.querySelector("#popupQRCode").classList.remove("scan");
    }, 2200);
  }

  popup.classList.add("popup-active");
  overlay2.classList.remove("show");
};

// Funtion to close popup
const closePopup = (popup) => {
  if (popup === null) return;

  const searchContainer = document.querySelector(".search__container");
  const gradesContainer = document.querySelector(".grades__container");
  const shareContainer = document.querySelector(".share__container");

  if (popup.id == "popupQRCode") {
    clearQRCodeUI();
    document.querySelector("#popupQRCode").classList.remove("popup-active");
  } else {
    searchContainer.classList.remove("show");
    gradesContainer.classList.remove("show");
    shareContainer.classList.remove("show");
    document.body.classList.remove("h-100");
    popup.classList.remove("popup-active");
    overlay2.classList.remove("show");
    inputShareLink.removeAttribute("data-qr-code");
  }
};

// Function to get image from file
const getImageFromFile = (e) => {
  const file = e.target.files[0];

  openFileBgBtn.innerText = "Open From File";

  if (!file) return;
  const fileBgImage = document.createElement("div");
  fileBgImage.classList.add("file__bg-image");

  const img = document.createElement("img");
  img.classList.add("file-bg");
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    tabListBg.innerHTML = "";
    fileBgImage.appendChild(img);
    // fileBgImage.appendChild(closeBtn);
    tabListBg.appendChild(fileBgImage);
    tabListBg.classList.add("file");
    tabListBg.classList.remove("bg-image");

    openFileBgBtn.innerText = "Set as background";
  };
};

// select image from the files
openFileBgBtn.addEventListener("click", () => {
  if (
    openFileBgBtn.innerText.toLowerCase().replaceAll(" ", "") == "openfromfile"
  ) {
    fileInputBg.click();
  } else {
    setBg(tabListBg.querySelector(".file__bg-image"));
    closeTabPopMod();
    tabListBg.classList.remove("bg-image", "file");
    openFileBgBtn.innerText = "Open from file";
  }
});

fileInputBg.addEventListener("change", getImageFromFile);

// Function to close all tabs popups, modals and menu items
const closeTabPopMod = () => {
  document
    .querySelectorAll(".menu__tab")
    .forEach((tab) => tab.classList.remove("tab-active"));
  document
    .querySelectorAll(".popup")
    .forEach((popup) => popup.classList.remove("popup-active"));
  document
    .querySelectorAll(".modal")
    .forEach((modal) => modal.classList.remove("modal-active"));
  document
    .querySelectorAll(".menu__item")
    .forEach((item) => item.classList.remove("isSelected"));

  if (tabListBg.querySelector(".file__bg-image")) {
    tabListBg.querySelector(".file__bg-image").remove();
  }
  tabListBg.classList.remove("bg-image", "color", "gradient", "file");
  openFileBgBtn.innerText = "Open from file";
  tabHeaderItems.forEach((tabItem) => {
    tabItem.style.pointerEvents = "all";
  });

  overlay.classList.remove("show");
};

// selecting custom color from the input
colorInputBg.addEventListener("input", () => {
  const target = colorInputBg.getAttribute("data-target");

  if (target == "text") {
    document.body.classList.remove("text-white", "text-black");
    const textColor = getContrastTextColor(colorInputBg.value);
    const textClass = textColor == "#000000" ? "text-black" : "text-white";

    document.body.classList.add(textClass);

    changeTextClr(colorInputBg.value);
  } else {
    document.body.classList.remove("text-white", "text-black");
    const textColor = getContrastTextColor(colorInputBg.value);
    const textClass = textColor == "#000000" ? "text-black" : "text-white";

    document.body.classList.add(textClass);
    editImageMain.style.background = colorInputBg.value;
    // hadithMain.style.background = colorInputBg.value;
    document.body.style.background = colorInputBg.value;
  }
});

colorInputTitle.addEventListener("click", () => colorInputBg.click());

// Function to open the modal
const openModal = (modal) => {
  if (modal === null) return;
  const modals = document.querySelectorAll(".modal-active");
  removeActiveModals(modals);
  modal.classList.add("modal-active");
};

// Function to close the modal
const closeModal = (modal) => {
  if (modal === null) return;
  modal.classList.remove("modal-active");
};

// Function to remove the modal-active
const removeActiveModals = (modals) => {
  modals.forEach((modal) => modal.classList.remove("modal-active"));
};

// Function to change the text color
const changeTextClr = (color) => {
  logoText.style.color = color;
  hadithText.style.color = color;
  editLogoText.style.color = color;
  editHadithText.style.color = color;
};

// Funtion to reset everything to its default
const resetUI = () => {
  captureOverlay.classList.remove("captured");
  captureImageContainer.innerHTML = "";

  closeTabPopMod();

  tabHeaderItems.forEach((item) => item.classList.remove("active"));
  document.querySelector(".file__type-list").classList.remove("show");

  document.querySelectorAll(".tab__list").forEach((list) => {
    if (list.hasAttribute("data-tab-list-font")) return;
    list.innerHTML = "";
  });

  document.body.classList.remove("captured");
  colorInputBg.value = "#9743e3";
};

/**
 * Random Colors
 */
// Function to get random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

// Function to get the contrast ratio of colors
const getContrastRatio = (color1, color2) => {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const ratio =
    (Math.max(luminance1, luminance2) + 0.05) /
    (Math.min(luminance1, luminance2) + 0.05);
  return ratio;
};

// Function to get luminance
const getLuminance = (color) => {
  const rgb = parseInt(color.slice(1), 16); // Convert hex to decimal
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance;
};

const getContrastTextColor = (bgColor) => {
  const contrastRatio = getContrastRatio(bgColor, "#FFFFFF");
  return contrastRatio >= 2 ? "#FFFFFF" : "#000000";
  //   return contrastRatio >= 4.5 ? "white" : "black";
};

/**
 * Search functionality
 */
const hadithBooks = [
  "Sahih al-Bukhari",
  "Sahih Muslim",
  "Sunan an-Nasa'i",
  "Sunan Abi Dawud",
  "Jami at-Tirmidhi",
  "Sunan Ibn Majah",
  "Muwatta Malik",
];

const searchSelectedItem = document.querySelector(
  "[data-search-selected-item]"
);
const searchMenuOptionsList = document.querySelector(
  "[data-search-menu-options-list]"
);
const searchMenuOptionItems = searchMenuOptionsList.querySelectorAll(
  "data-search-menu-option-item"
);

const selectedText = searchSelectedItem.querySelector(".selected__text");

const inputSearchHadithNum = document.querySelector(
  "[data-input-search-hadith-num]"
);

const searchHadithBtn = document.querySelector("[data-search-hadith-btn]");

searchSelectedItem.addEventListener("click", () => {
  searchMenuOptionsList.classList.toggle("show");
});

searchMenuOptionsList.innerHTML = "";
hadithBooks.forEach((book, i) => {
  const option = document.createElement("div");
  option.classList.add("option");
  option.setAttribute("data-book", hadithBooksArr[i]);
  option.innerText = book;

  searchMenuOptionsList.appendChild(option);

  option.addEventListener("click", () => {
    selectedText.innerText = option.innerText;
    searchSelectedItem.setAttribute(
      "data-book",
      option.getAttribute("data-book")
    );

    // searchMenuOptionsList
    //   .querySelectorAll(".option")
    //   .forEach((opt) => opt.classList.remove("selected"));
    option.classList.add("selected");
    searchMenuOptionsList.classList.remove("show");
    inputSearchHadithNum.focus();
  });
});

searchHadithBtn.addEventListener("click", () => {
  // const book = selectedText.innerText;
  const hadithBook = searchSelectedItem.getAttribute("data-book");
  const hadithNum = inputSearchHadithNum.value;
  const searchVal = `${hadithBook}_${hadithNum}`;

  if (hadithNum == "") {
    createMsg("Please Enter the hadith number", 1000, false);
    inputSearchHadithNum.focus();
  } else {
    const params = new URLSearchParams(window.location.search);
    params.set("book", searchVal);
    const newURL = `${window.location.pathname}?${params.toString()}`;
    history.replaceState({}, "", newURL);
    document.querySelector(".search__container").classList.remove("show");
    document.querySelector("#popupSearch").classList.remove("popup-active");
    // remove the h-100 and snf(search not found class from the body)
    document.body.classList.remove("h-100");
    document.body.classList.remove("snf");
    hadithText.innerHTML = "";

    setTimeout(() => {
      fetchBookAndDisplay(hadithBook, hadithNum);
    }, 200);
  }
});

/**
 * Download hadith as custom file like: png, jpeg and pdf
 */

const fileTypeSelected = document.querySelector(
  "[data-file-type-download-selected]"
);
const fileTypeList = document.querySelector("[data-file-type-download-list]");
const fileTypeItems = fileTypeList.querySelectorAll(
  "[data-file-type-download-item]"
);
const downloadFileDownloadBtn = document.querySelector(
  "[data-download-file-btn]"
);

fileTypeSelected.addEventListener("click", () => {
  fileTypeList.classList.toggle("show");
});

fileTypeItems.forEach((fileType) => {
  fileType.addEventListener("click", () => {
    let selectedIcon = fileTypeSelected.querySelector(
      ".left span:nth-child(1)"
    );
    let selectedText = fileTypeSelected.querySelector(".left .selected__text");

    const currentIcon = fileType.querySelector(".icon span");
    const currentText = fileType.querySelector(".text span");
    const currentExt = currentText.getAttribute("data-extension");

    fileTypeItems.forEach((type) => type.classList.remove("isSelected"));

    fileType.classList.add("isSelected");
    selectedIcon.innerText = currentIcon.innerText;
    selectedText.innerText = currentText.innerText;
    fileTypeSelected.setAttribute("data-extension", currentExt);
  });
});

downloadFileDownloadBtn.addEventListener("click", () => {
  const ext = fileTypeSelected.getAttribute("data-extension");
  const downloadImageName =
    "ihadith_" + shareLinkBtns[0].getAttribute("data-share-link");

  if (ext == ".pdf") {
    createMsg("PDF will come soon. Insha Allah!", 1500, false);
    return true;
  }

  // download the iamge
  downloadImage(downloadImageName, ext);
  // and close any tab, popup and modal if active
  closeTabPopMod();
});

// fetch random hadith when pressing the spacebar
document.addEventListener("keydown", (e) => {
  if (
    editImagePopup.classList.contains("show") ||
    document.body.classList.contains("error") ||
    document.body.classList.contains("loading")
  ) {
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      e.preventDefault();
    }
    return true;
  }
  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    e.preventDefault();
    hadithText.innerHTML = "";
    removeBookParameter();
    fetchRandomHadithBook();
  }
});

/**
 * Share to social media
 */

// window.addEventListener("load", () => setShareLinks());
const shareLinkItems = document.querySelectorAll("[data-share-link]");

shareLinkItems.forEach((shareLink) => {
  shareLink.addEventListener("click", () => {
    const socialMed = shareLink.getAttribute("data-share-link");

    setShareLinks(socialMed);
  });
});

const setShareLinks = (soc) => {
  // const pageUrl = encodeURIComponent(document.URL);
  const pageUrl = inputShareLink.value;
  const pageTitle = document.title;
  const hadithBook = inputShareLink.getAttribute("data-book");
  const hadithNum = inputShareLink.getAttribute("data-hadith-num");
  const hadithRef = `${hadithBook}, ${hadithNum}`;
  let url = null;

  switch (soc) {
    case "facebook":
      updateOpenGraphMetaTags(pageTitle, "Saeed Akhlaqyaar", " ", pageUrl);
      url = `https://www.facebook.com/sharer.php?u=${pageUrl}`;
      break;

    case "twitter":
      url = `https://twitter.com/intent/tweet?text=${pageTitle}%0A${pageUrl}`;
      break;

    case "whatsapp":
      url = `https://wa.me/?text=${pageTitle}%0A${pageUrl}`;
      break;

    case "mail":
      url = `mailto:?subject=${pageTitle}&body=Read%20the%20hadith%20${hadithBook}%20,%20${hadithNum}%20from%20${pageTitle}%20on%20${pageUrl}`;
      break;

    default:
      createMsg(`Unsupported social network: + ${soc}`, 1500, false);
      return;
  }

  socialWindow(url, 570, 450);
};

const socialWindow = (url, width, height) => {
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  window.open(
    url,
    "_blank",
    `width=${width},height=${height},left=${left},top=${top}`
  );
};

function updateOpenGraphMetaTags(
  hadithTitle,
  hadithDescription,
  imgUrl,
  pageUrl
) {
  const metaTags = document.querySelectorAll('meta[property^="og:"]');

  metaTags.forEach((tag) => {
    const property = tag.getAttribute("property");
    switch (property) {
      case "og:title":
        tag.setAttribute("content", hadithTitle);
        break;
      case "og:description":
        tag.setAttribute("content", hadithDescription);
        break;
      case "og:image":
        tag.setAttribute("content", imgUrl);
      case "og:url":
        tag.setAttribute("content", pageUrl);
        break;
    }
  });
}

// copy share link in the share popup
copyShareLinkBtn.addEventListener("click", () => {
  const shareLink = inputShareLink.value;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareLink);
    copyShareLinkBtn.innerText = "Copied!";
    createMsg("Link copied successfully!", 2000, false);

    setTimeout(() => {
      copyShareLinkBtn.innerText = "Copy";
    }, 2000);
  } else {
    // Fallback for browsers that don't support the Clipboard API
    inputShareLink.select();
    if (document.execCommand("copy")) {
      copyShareLinkBtn.innerText = "Copied";
      createMsg("Link copied successfully!", 2000, false);

      setTimeout(() => {
        window.getSelection().removeAllRanges();
        copyShareLinkBtn.innerText = "Copy";
      }, 2000);
    }
  }
});

// const shareData = {
//   title: "Web Share API Demo",
//   text: "Check out this cool web app!",
//   url: "https://example.com",
// };

// try {
//   await navigator.share(shareData);
//   console.log("Shared successfully");
// } catch (error) {
//   console.error("Error sharing:", error);
// }

/**
 * Generate QR Code
 */
const qrCodeElem = document.querySelector("[data-qr-code]");
const shareQrCodeBtn = document.querySelector("[data-share-qrcode-btn]");
const downloadQrCodeBtn = document.querySelector("[data-download-qrcode-btn]");

const qrCodeWidth = qrCodeElem.clientWidth - 25;
const qrCodeHeight = qrCodeElem.clientHeight - 25;
const generateQRCode = (url) => {
  const qrcode = new QRCode(qrCodeElem, {
    text: url,
    width: 200,
    height: 200,
    // colorDark: "#972adb",
  });
};

// share the qr code
shareQrCodeBtn.addEventListener("click", () => {
  const url = qrCodeElem.querySelector("canvas").toDataURL();

  inputShareLink.setAttribute("data-qr-code", url);
  inputShareLink.value = "qrcode.png";
  setTimeout(() => {
    clearQRCodeUI();
    setTimeout(() => {
      document.querySelector("#popupQRCode").classList.remove("popup-active");
    }, 100);
  }, 200);
});

// download the generated qr code in the png
downloadQrCodeBtn.addEventListener("click", () => {
  const url = qrCodeElem.querySelector("canvas").toDataURL();
  downloadQRCode(url);
});

// Function to download the qr code in .png
const downloadQRCode = (url) => {
  const link = document.createElement("a");
  link.classList.add("qr-link");
  link.href = url;
  link.download = `${HADITH_BOOK}, ${HADITH_NUMBER}_QR.png`;

  link.click();
  setTimeout(() => {
    link.remove();
  }, 200);
};

// Function to clear the UI of qr code
const clearQRCodeUI = () => {
  const qrCanvas = qrCodeElem.querySelector("canvas");
  const qrImg = qrCodeElem.querySelector("img");
  const qrLink = qrCodeElem.querySelector("qr-link");

  if (qrCanvas) qrCanvas.remove();
  if (qrImg) qrImg.remove();
  if (qrLink) qrLink.remove();
};

// Function the check whether the user is online or offline
const onlineStatusElem = document.querySelector("[data-online-status]");
const onlineStatusPopup = document.querySelector("[data-online-status-popup]");
const updateOnlineStatus = () => {
  if (navigator.onLine) {
    ONLINE_STATUS = "online";
    onlineStatusElem.classList.remove("slide-in");
    setTimeout(() => {
      onlineStatusPopup.classList.remove("active");
      document.body.classList.remove("h-100");
    }, 550);
  } else {
    ONLINE_STATUS = "offline";
    onlineStatusPopup.classList.add("active");
    onlineStatusElem.classList.add("slide-in");
    document.body.classList.add("h-100");
  }
};

updateOnlineStatus();

// fetch the data only when the user is online
window.addEventListener("offline", updateOnlineStatus);
window.addEventListener("online", () => {
  // update the online status
  updateOnlineStatus();
  const params = new URLSearchParams(window.location.search);
  const bookIdParam = params.get("book");
  if (bookIdParam) {
    const [bookId, hadithNumber] = bookIdParam.split("_");

    // Fetch and display the specified book and hadith number
    fetchBookAndDisplay(bookId, hadithNumber);
  } else {
    // If there's no "book" parameter, fetch a random book as before
    fetchRandomHadithBook();
  }
});

// theme
const theme = window.localStorage.getItem("theme");
const setTheme = (theme) => {
  if (theme == "light") {
    document.body.removeAttribute("theme-dark");
  } else {
    document.body.setAttribute("theme-dark", "theme-dark");
  }
};

window.addEventListener("load", setTheme(theme));
