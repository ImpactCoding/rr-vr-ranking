const vueApp = {
  name: "Vue Schema Creator",
  data() {
    return {
      players: [],
      ranks: [
        {
          name: "Overall",
          id: "overall",
          range_min: 1,
          range_max: 30000,
          players: [],
          image: "Overall.png",
        },
        {
          name: "Rewind Grandmaster",
          id: "rewind-grandmaster",
          range_min: 28000,
          range_max: 30000,
          players: [],
          image: "RewindGrandmaster.png",
        },
        {
          name: "Rewind Master",
          id: "rewind-master",
          range_min: 25000,
          range_max: 27999,
          players: [],
          image: "RewindMaster.png",
        },
        {
          name: "Rewind Veteran",
          id: "rewind-veteran",
          range_min: 22000,
          range_max: 24999,
          players: [],
          image: "RewindVeteran.png",
        },
        {
          name: "Rewind Elite",
          id: "rewind-elite",
          range_min: 20000,
          range_max: 21999,
          players: [],
          image: "RewindElite.png",
        },
        {
          name: "Rewind",
          id: "rewind",
          range_min: 18000,
          range_max: 19999,
          players: [],
          image: "Rewind.png",
        },
        {
          name: "Class S",
          id: "class-s",
          range_min: 15000,
          range_max: 17999,
          players: [],
          image: "Sclass.png",
        },
        {
          name: "Class A",
          id: "class-a",
          range_min: 12000,
          range_max: 14999,
          players: [],
          image: "Aclass.png",
        },
        {
          name: "Class B",
          id: "class-b",
          range_min: 10000,
          range_max: 11999,
          players: [],
          image: "Bclass.png",
        },
        {
          name: "Class C",
          id: "class-c",
          range_min: 8000,
          range_max: 9999,
          players: [],
          image: "Cclass.png",
        },
        {
          name: "Class D",
          id: "class-d",
          range_min: 6000,
          range_max: 7999,
          players: [],
          image: "Dclass.png",
        },
        {
          name: "Learner's Permit",
          id: "learner",
          range_min: 1,
          range_max: 5999,
          players: [],
          image: "Learner.png",
        },
      ],
      activeRank: {
        name: "Overall",
        id: "overall",
        range_min: 1,
        range_max: 30000,
        players: [],
        image: "Crown.webp",
      },
    };
  },
  methods: {
    async refreshData() {
      const response = await fetch("http://zplwii.xyz/api/groups");
      const rooms = await response.json();
      this.players = []; // Clear the players array before updating it

      // Iterate through each room and add players to the array
      rooms.forEach((room) => {
        this.players.push(...Object.values(room.players));
      });

      this.players = this.players.filter(
        (player) => player.ev !== undefined && player.ev !== null
      );

      // Sort the players array by ev value in descending order
      this.players.sort((a, b) => {
        return parseInt(b.ev, 10) - parseInt(a.ev, 10); // Sort by ev descending
      });

      this.ranks.forEach((rank) => {
        rank.players = this.players.filter(
          (p) => p.ev >= rank.range_min && p.ev <= rank.range_max
        );
      });
    },

    titleImage(VR) {
      if (VR < 6000) return "Learner.png";
      else if (VR >= 6000 && VR < 8000) return "Dclass.png";
      else if (VR >= 8000 && VR < 10000) return "Cclass.png";
      else if (VR >= 10000 && VR < 12000) return "Bclass.png";
      else if (VR >= 12000 && VR < 15000) return "Aclass.png";
      else if (VR >= 15000 && VR < 18000) return "Sclass.png";
      else if (VR >= 18000 && VR < 20000) return "Rewind.png";
      else if (VR >= 20000 && VR < 22000) return "RewindElite.png";
      else if (VR >= 22000 && VR < 25000) return "RewindVeteran.png";
      else if (VR >= 25000 && VR < 28000) return "RewindMaster.png";
      else return "RewindGrandmaster.png";
    },

    changeRank(index) {
      this.activeRank = this.ranks[index];
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },

  created() {
    this.changeRank(0);
  },

  mounted() {
    this.refreshData();
    setInterval(this.refreshData, 10000); // Refresh data every 10 seconds if needed
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
