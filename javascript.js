const vueApp = {
  name: "Vue Schema Creator",
  data() {
    return {
      loading: false,
      date: "",
      last_refresh: "",
      highlight_fc: "",
      players: [],
      ranks: [
        {
          name: "Overall",
          id: "overall",
          range_min: 1,
          range_max: 30000,
          players: [],
          image: "assets/ranks/Overall.png",
        },
        {
          name: "Rewind Grandmaster",
          id: "rewind-grandmaster",
          range_min: 28000,
          range_max: 30000,
          players: [],
          image: "assets/ranks/RewindGrandmaster.png",
        },
        {
          name: "Rewind Master",
          id: "rewind-master",
          range_min: 25000,
          range_max: 27999,
          players: [],
          image: "assets/ranks/RewindMaster.png",
        },
        {
          name: "Rewind Veteran",
          id: "rewind-veteran",
          range_min: 22000,
          range_max: 24999,
          players: [],
          image: "assets/ranks/RewindVeteran.png",
        },
        {
          name: "Rewind Elite",
          id: "rewind-elite",
          range_min: 20000,
          range_max: 21999,
          players: [],
          image: "assets/ranks/RewindElite.png",
        },
        {
          name: "Rewind",
          id: "rewind",
          range_min: 18000,
          range_max: 19999,
          players: [],
          image: "assets/ranks/Rewind.png",
        },
        {
          name: "Class S",
          id: "class-s",
          range_min: 15000,
          range_max: 17999,
          players: [],
          image: "assets/ranks/Sclass.png",
        },
        {
          name: "Class A",
          id: "class-a",
          range_min: 12000,
          range_max: 14999,
          players: [],
          image: "assets/ranks/Aclass.png",
        },
        {
          name: "Class B",
          id: "class-b",
          range_min: 10000,
          range_max: 11999,
          players: [],
          image: "assets/ranks/Bclass.png",
        },
        {
          name: "Class C",
          id: "class-c",
          range_min: 8000,
          range_max: 9999,
          players: [],
          image: "assets/ranks/Cclass.png",
        },
        {
          name: "Class D",
          id: "class-d",
          range_min: 6000,
          range_max: 7999,
          players: [],
          image: "assets/ranks/Dclass.png",
        },
        {
          name: "Learner's Permit",
          id: "learner",
          range_min: 1,
          range_max: 5999,
          players: [],
          image: "assets/ranks/Learner.png",
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
      this.loading = true;
      const response = await fetch(
        "https://impactcoding.github.io/rr-player-database/rr-players.json"
      );
      const playerData = await response.json();
      this.last_refresh = playerData.last_refresh;
      this.date = Date.now();
      this.players = [];
      for (player in playerData) {
        this.players.push(playerData[player]);
      }

      // Sort the players array by ev value in descending order
      this.players.sort((a, b) => {
        return parseInt(b.ev, 10) - parseInt(a.ev, 10); // Sort by ev descending
      });

      this.ranks.forEach((rank) => {
        rank.players = this.players.filter(
          (p) => p.ev >= rank.range_min && p.ev <= rank.range_max
        );
      });
      this.loading = false;
    },

    titleImage(VR) {
      if (VR < 6000) return "assets/ranks/Learner.png";
      else if (VR >= 6000 && VR < 8000) return "assets/ranks/Dclass.png";
      else if (VR >= 8000 && VR < 10000) return "assets/ranks/Cclass.png";
      else if (VR >= 10000 && VR < 12000) return "assets/ranks/Bclass.png";
      else if (VR >= 12000 && VR < 15000) return "assets/ranks/Aclass.png";
      else if (VR >= 15000 && VR < 18000) return "assets/ranks/Sclass.png";
      else if (VR >= 18000 && VR < 20000) return "assets/ranks/Rewind.png";
      else if (VR >= 20000 && VR < 22000) return "assets/ranks/RewindElite.png";
      else if (VR >= 22000 && VR < 25000)
        return "assets/ranks/RewindVeteran.png";
      else if (VR >= 25000 && VR < 28000)
        return "assets/ranks/RewindMaster.png";
      else return "assets/ranks/RewindGrandmaster.png";
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
      if (minutes < 60) return minutes + " minutes ago";
      const hours = Math.round(timeDiff / (1000 * 60 * 60));
      if (hours < 24) return hours + " hours ago";
      const days = Math.round(timeDiff / (1000 * 60 * 60 * 24));
      if (days < 7) return days + " days ago";
      else
        return Math.round(timeDiff / (1000 * 60 * 60 * 24 * 7)) + " weeks ago";
    },
  },

  created() {
    this.changeRank(0);
  },

  mounted() {
    this.refreshData();
    setInterval(this.refreshData, 180000);
    this.highlight_fc = localStorage.getItem("rrfc");
  },

  computed: {
    playerCount() {
      return this.activeRank.players.length;
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
