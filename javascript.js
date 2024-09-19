const vueApp = {
  name: "Retro Rewind Live VR Ranking",
  data() {
    return {
      date: "",
      last_refresh: "",
      highlight_fc: "",
      banned: [],
      players: [],
      last_seen: [],
      faq: {
        open: "",
        tabs: [
          {
            heading: "How can I get on the leaderboard?",
            content:
              "To entry the leaderboard, you have to start your license at <span class='yellow-text'><b>5000 VR or lower</b></span> to avoid people hacking VR. Also, your VR progress will be tracked and you will get banned and end up in the <a href='hallOfShame.html'><b>Hall of Shame</b></a> if you manipulate your VR.",
            image: "assets/characters/ToadCheepCharger.webp",
          },
          {
            heading:
              "Why am I not on the leaderboard even though I followed the rules?",
            content:
              "Data refreshing might be delayed sometimes due to high traffic or other factors. This can potentially mess up the banning or entry creation system.<br><br>If your profile is not shown as it should, contact me <a href='https://discordapp.com/channels/@me/342736380163653633/' target='_blank'>here</a>.",
            image: "assets/characters/Waluigi.webp",
          },
          {
            heading:
              "I can't highlight my FC event though I typed it correctly",
            content:
              "If your profile is ranked for the <span class='yellow-text'><b>current rank</b></span> you selected, the search field border will turn green. Make sure you remove white space or try the Overall category. Also, try to set the maximum amount of players per table to 500 in settings.",
            image: "assets/characters/DonkeyKong.webp",
          },
          {
            heading: "How does this page work?",
            content:
              "All data is collected from the Rooms API, stored and updated by a script.",
            image: "assets/sprites/Wii.webp",
          },
          {
            heading: "Will there be new stuff added to the website?",
            content:
              "Yes, I have a couple ideas on my mind that I will try to integrate when I have time:<ul><li>Seasons: 1 Month time to gains as much VR as possible. Season results will be saved.</li><li>VR Tracking: VR progress of each player will be tracked and shown in a graph.</li></ul>",
            image: "assets/characters/ThinkingMario.png",
          },
        ],
      },
      settings: {
        open: false,
        params: {
          dark_mode: localStorage.getItem("dark_mode"),
          max_players: localStorage.getItem("max_players") || 100,
          sort_by_last_seen: localStorage.getItem("sort_by_last_seen"),
        },
      },
      ranks: [
        {
          name: "Overall",
          id: "overall",
          range_min: 1,
          range_max: 30000,
          players: [],
          image: "assets/ranks/Flag.webp",
        },
        {
          name: "Rewind Grandmaster",
          id: "rewind-grandmaster",
          range_min: 29000,
          range_max: 30000,
          players: [],
          image: "assets/ranks/crown.png",
        },
        {
          name: "Rewind Master",
          id: "rewind-master",
          range_min: 26000,
          range_max: 28999,
          players: [],
          image: "assets/ranks/3star.png",
        },
        {
          name: "Rewind Veteran",
          id: "rewind-veteran",
          range_min: 22000,
          range_max: 25999,
          players: [],
          image: "assets/ranks/2star.png",
        },
        {
          name: "Rewind Elite",
          id: "rewind-elite",
          range_min: 20000,
          range_max: 21999,
          players: [],
          image: "assets/ranks/1star.png",
        },
        {
          name: "Rewind",
          id: "rewind",
          range_min: 18000,
          range_max: 19999,
          players: [],
          image: "assets/ranks/goldwheel.png",
        },
        {
          name: "Class A",
          id: "class-a",
          range_min: 15000,
          range_max: 17999,
          players: [],
          image: "assets/ranks/rank A.png",
        },
        {
          name: "Class B",
          id: "class-b",
          range_min: 12000,
          range_max: 14999,
          players: [],
          image: "assets/ranks/rank B.png",
        },
        {
          name: "Class C",
          id: "class-c",
          range_min: 10000,
          range_max: 11999,
          players: [],
          image: "assets/ranks/rank C.png",
        },
        {
          name: "Class D",
          id: "class-d",
          range_min: 8000,
          range_max: 9999,
          players: [],
          image: "assets/ranks/rank D.png",
        },
        {
          name: "Class E",
          id: "class-e",
          range_min: 6000,
          range_max: 7999,
          players: [],
          image: "assets/ranks/rank E.png",
        },
        {
          name: "Learner's Permit",
          id: "learner",
          range_min: 1,
          range_max: 5999,
          players: [],
          image: "assets/ranks/wheel .png",
        },
      ],
      activeRank: {
        name: "Overall",
        id: "overall",
        range_min: 1,
        range_max: 30000,
        players: [],
        image: "",
      },
    };
  },
  methods: {
    async refreshData() {
      const response = await fetch(
        "https://impactcoding.github.io/rr-player-database/rr-players.json"
      );
      const playerData = await response.json();
      this.last_refresh = playerData.last_refresh;
      delete playerData.last_refresh;
      this.date = Date.now();
      this.players = [];
      this.banned = [];

      let playerArray = [];
      for (player in playerData) {
        if (playerData[player].banned === true) {
          this.banned.push(playerData[player]);
        } else {
          playerArray.push(playerData[player]);
        }
      }

      const vr_array = [...playerArray];
      const last_seen_array = [...playerArray];

      vr_array.sort((a, b) => {
        return parseInt(b.ev, 10) - parseInt(a.ev, 10); // Sort by ev descending
      });

      this.players = vr_array;

      last_seen_array.sort((a, b) => {
        return b.lastupdated - a.lastupdated; // Sort by last seen descending
      });

      this.last_seen = last_seen_array;

      this.changeSorting(this.settings.params.sort_by_last_seen);
    },

    titleImage(VR) {
      if (VR < 6000) return "assets/ranks/wheel .png";
      else if (VR >= 6000 && VR < 8000) return "assets/ranks/rank E.png";
      else if (VR >= 8000 && VR < 10000) return "assets/ranks/rank D.png";
      else if (VR >= 10000 && VR < 12000) return "assets/ranks/rank C.png";
      else if (VR >= 12000 && VR < 15000) return "assets/ranks/rank B.png";
      else if (VR >= 15000 && VR < 18000) return "assets/ranks/rank A.png";
      else if (VR >= 18000 && VR < 20000) return "assets/ranks/goldwheel.png";
      else if (VR >= 20000 && VR < 22000) return "assets/ranks/1star.png";
      else if (VR >= 22000 && VR < 26000) return "assets/ranks/2star.png";
      else if (VR >= 26000 && VR < 29000) return "assets/ranks/3star.png";
      else return "assets/ranks/crown.png";
    },

    changeRank(index) {
      this.activeRank = this.ranks[index];
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    miiImage(player) {
      if (player.mii) {
        if (player.mii[0].data.includes("base64")) return player.mii[0].data;
        else return "assets/sprites/questionMark.png";
      } else return "assets/sprites/questionMark.png";
    },

    searchFC() {
      const tableRow = document.querySelector("tr[style]");
      if (tableRow)
        tableRow.scrollIntoView({ block: "end", behavior: "smooth" });
      localStorage.setItem("rrfc", this.highlight_fc);
    },

    returnTime(unixTime) {
      timeDiff = this.date - unixTime;
      const minutes = Math.round(timeDiff / (1000 * 60));
      if (minutes < 60) return minutes + "min ago";
      const hours = Math.round(timeDiff / (1000 * 60 * 60));
      if (hours < 24) return hours + "h ago";
      const days = Math.round(timeDiff / (1000 * 60 * 60 * 24));
      if (days < 7) return days + "d ago";
      else return Math.round(timeDiff / (1000 * 60 * 60 * 24 * 7)) + "w ago";
    },

    returnDate(unixTime) {
      if (unixTime) {
        const date = new Date(unixTime).toLocaleDateString("en-US");
        return date;
      } else return "-";
    },

    openSettings() {
      this.settings.open = !this.settings.open;
    },

    checkInput() {
      let fcFound = false;
      this.activeRank.players.forEach((player) => {
        if (this.highlight_fc === player.fc) {
          document.querySelector(".highlight-fc input").style.border =
            "1px solid #5edd5f";
          fcFound = true;
        }
      });
      if (fcFound == false)
        document.querySelector(".highlight-fc input").style.border =
          "1px solid #c90000";
    },

    setLocalStorage(item) {
      localStorage.setItem(item, this.settings.params[item]);
    },

    toggleFAQ(i) {
      console.log(i);
      if (this.faq.open === i) {
        this.faq.open = "";
      } else this.faq.open = i;
    },

    scrollToFAQ() {
      const faq = document.querySelector(".faq-heading");
      faq.scrollIntoView({ behavior: "smooth" });
    },

    changeSorting(sort_by_last_seen) {
      if (sort_by_last_seen == true || sort_by_last_seen == "true") {
        this.ranks.forEach((rank) => {
          rank.players = this.last_seen.filter(
            (p) => p.ev >= rank.range_min && p.ev <= rank.range_max
          );
        });
      } else {
        this.ranks.forEach((rank) => {
          rank.players = this.players.filter(
            (p) => p.ev >= rank.range_min && p.ev <= rank.range_max
          );
        });
      }
    },
  },

  created() {
    this.changeRank(0);
    this.settings.params.sort_by_last_seen =
      localStorage.getItem("sort_by_last_seen");
  },

  mounted() {
    this.refreshData();
    setInterval(this.refreshData, 60000);
    this.highlight_fc = localStorage.getItem("rrfc");
    this.checkInput();
  },

  watch: {
    highlight_fc() {
      setTimeout(this.checkInput, 200);
    },
  },

  computed: {
    playerCount() {
      return this.activeRank.players.length;
    },

    firstName() {
      if (this.activeRank.players[0]) {
        if (this.activeRank.players[0].name === "no name") {
          return "Player";
        } else {
          return this.activeRank.players[0].name;
        }
      } else {
        return "";
      }
    },
  },
};

function headerPosition() {
  const header = document.querySelector(".header");
  document.addEventListener("scroll", function () {
    if (window.scrollY > 0) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  Vue.createApp(vueApp).mount(".rr-rooms");
  headerPosition();
});
