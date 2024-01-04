const main = document.querySelector("[data-main]");
const heroText = document.querySelector("[data-hero-text]");
const mask = document.querySelector("[data-mask]");
const exploreBtn = document.querySelector("[data-explore-btn]");

const languagePopup = document.querySelector("[data-language-popup]");
const languagePopupCloseBtn = document.querySelector(
  "[data-language-popup-close-btn]"
);

const teamBtn = document.querySelector("[data-team-btn]");
const curtain = document.querySelector("[data-curtain]");

teamBtn.addEventListener("click", () => {
  if (!curtain.classList.contains("active")) {
    curtain.classList.add("active");
    curtain.style.zIndex = "102";
  } else {
    curtain.classList.remove("active");
    setTimeout(() => {
      curtain.style.zIndex = "-1";
    }, 700);
  }
});

// preview arr
const previewArr = [
  "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
  "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for",
  "Semua perbuatan tergantung niatnya, dan (balasan) bagi tiap-tiap orang (tergantung) apa yang diniatkan; Barangsiapa niat hijrahnya karena dunia yang ingin digapainya atau karena seorang perempuan yang ingin dinikahinya, maka hijrahnya adalah kepada apa dia diniatkan",
  " কাজ (এর প্রাপ্য হবে) নিয়্যাত অনুযায়ী। আর মানুষ তার নিয়্যাত অনুযায়ী প্রতিফল পাবে। তাই যার হিজরাত হবে ইহকাল লাভের অথবা কোন মহিলাকে বিবাহ করার উদ্দেশে- তবে তার হিজরাত সে উদ্দেশেই হবে, যে জন্যে, সে হিজরাত করেছে",
  "Ameller niyetlere göredir ve herkes için niyet ettiğinin karşılığı vardır. Kimin hicreti elde edeceği dünyalığa veya evleneceği bir kadına ise hicreti, hicret ettiği şeyedir",
  "La récompense des actes dépend des intentions et chacun recevra la récompense selon ce qu'il a prévu. Ainsi, quiconque a émigré pour des avantages matériels ou pour qu'une femme se marie, son émigration était pour ce pour quoi il avait émigré.",
];

// setting up the default language and preview text
const languageList = document.querySelector("[data-language-list]");
const languageItems = document.querySelectorAll("[data-language-item]");

const languagePreviewText = document.querySelector(
  "[data-language-preview-text]"
);
let defaultLang = "";
languageItems.forEach((langItem, idx) => {
  langItem.addEventListener("click", () => {
    const langId = langItem.dataset.langId;
    languageItems.forEach((item) => item.classList.remove("active"));
    langItem.classList.add("active");
    languageList.classList.add("selected");

    localStorage.setItem("defaultLang", langId);
    exploreBtn.style.pointerEvents = "all";
    exploreBtn.style.cursor = "pointer";
  });
});

exploreBtn.addEventListener("click", () => {
  languageItems.forEach((item) => {
    if (item.classList.contains("active")) {
      window.location.href = "hadith.html";
    }
  });
});

/**
 *  particles js
 */
let particleColor = document.body.hasAttribute("theme-dark") ? "#fff" : "#000";
updateParticles = (clr) => {
  {
    particlesJS(
      "particles",

      {
        particles: {
          number: {
            value: 600,
            density: {
              enable: true,
              value_area: 1400,
            },
          },
          color: {
            // value: document.body.hasAttribute("theme-dark") ? "#fff" : "#000",

            value: particleColor,
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000",
            },
            polygon: {
              nb_sides: 5,
            },
            image: {
              src: "img/github.svg",
              width: 100,
              height: 100,
            },
          },
          opacity: {
            value: 1,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false,
            },
          },
          size: {
            value: 2.5,
            random: true,
            anim: {
              enable: false,
              speed: 1,
              size_min: 0.1,
              sync: false,
            },
          },
          line_linked: {
            enable: false,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.7,
            direction: "top",
            random: true,
            straight: false,
            out_mode: "out",
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: false,
              mode: "repulse",
            },
            onclick: {
              enable: false,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 400,
              line_linked: {
                opacity: 1,
              },
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3,
            },
            repulse: {
              distance: 200,
            },
            push: {
              particles_nb: 4,
            },
            remove: {
              particles_nb: 2,
            },
          },
        },
        retina_detect: true,
        config_demo: {
          hide_card: false,
          background_color: "#b61924",
          background_image: "",
          background_position: "50% 50%",
          background_repeat: "no-repeat",
          background_size: "cover",
        },
      }
    );
  }
};

window.addEventListener("load", updateParticles);

/**
 * Theme toggler
 */

const themeToggler = document.querySelector("[data-theme-toggler]");
const themeTogglerBtns = document.querySelectorAll("[data-theme-toggler-btn]");
const theme = window.localStorage.getItem("theme") || "light";
themeTogglerBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (document.body.hasAttribute("theme-dark")) {
      particleColor = "#000";
      document.body.removeAttribute("theme-dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      particleColor = "#fff";
      document.body.removeAttribute("theme-dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
    updateParticles();
  });
});

const setTheme = (theme) => {
  if (theme === "light") {
    document.body.removeAttribute("theme-dark");
    particleColor = "#000";
  } else {
    document.body.setAttribute("theme-dark", "theme-dark");
    particleColor = "#fff";
  }
  updateParticles();
};

window.addEventListener("load", setTheme(theme));
