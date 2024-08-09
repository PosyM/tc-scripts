/*
    author: Posy
    description: Script for cating non-pits buildings, therefore maximizing neutral villages' production. Script is meant to be run from report page.
 */

(function () {
  "use strict";
  // Function to get building levels from the report
  function getBuildingLevels() {
    const buildingLevels = [];

    // Query selector to find building level elements
    const buildingRows = document.querySelectorAll(
      "#attack_spy_buildings_left tr, #attack_spy_buildings_right tr",
    );

    const scrapBuildings = (buildingRows) => {
      buildingRows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 2) {
          const buildingName = cells[0].innerText.trim();
          const level = parseInt(cells[1].innerText.trim());

          // Store the building name and level in the array
          if (buildingName && !isNaN(level)) {
            buildingLevels.push({ name: buildingName, level: level });
          }
        }
      });
    };

    const targetedVillage = (() => {
      // Example selector where coordinates might be found in the report
      const coordElement = document.querySelector(
        "#attack_info_def .village_anchor",
      );

      // Extract the text from the element, which might look like "Village Name (486|846)"
      const coordText = coordElement
        ? coordElement.innerText.match(/\((\d+)\|(\d+)\)/)
        : null;

      if (coordText) {
        return { x: parseInt(coordText[1], 10), y: parseInt(coordText[2], 10) };
      } else {
        console.error("Village coordinates not found");
        return null;
      }
    })();

    if (!targetedVillage) {
      alert("Targeted village coordinates not found.");
      return;
    }

    scrapBuildings(buildingRows);
    return buildingLevels;
  }

  // Required catapults for each level
  const requiredCatapults = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    17: 17,
    18: 18,
    19: 19,
    20: 20,
    21: 21,
    22: 22,
    23: 23,
    24: 24,
    25: 25,
    26: 26,
    27: 27,
    28: 28,
    29: 29,
    30: 30,
  };

  const { buildingLevels, targetedVillage } = getBuildingLevels();

  // Buildings to check
  const targetBuildings = [
    "Headquarters",
    "Barracks",
    "Smithy",
    "Stables",
    "Workshop",
    "Academy",
    "Market",
    "Wall",
  ];

  // Filter out buildings with levels less than 1 and map to object with building names and levels
  const filteredBuildings = buildingLevels.filter(
    (building) => targetBuildings.includes(building.name) && building.level > 0,
  );

  // Create the table and button if there are buildings to demolish
  if (filteredBuildings.length > 0) {
    const table = document.createElement("table");
    table.setAttribute("id", "catapultTable");
    table.innerHTML = `
            <tr>
                ${filteredBuildings.map((building) => `<th>${building.name}</th>`).join("")}
            </tr>
            <tr>
                ${filteredBuildings.map((building) => `<td>${requiredCatapults[building.level]}</td>`).join("")}
            </tr>
        `;
    document.querySelector("h2").appendChild(table);

    const button = document.createElement("button");
    button.innerText = "Launch Catapult Attacks";
    button.onclick = function () {
      filteredBuildings.forEach((building) => {
        const requiredCatapultsForBuilding = requiredCatapults[building.level];
        const attackingVillageId = 208; // Replace this with a dynamic value if needed
        const attackLink = `https://enc2.tribalwars.net/game.php?village=${attackingVillageId}&screen=place&target=&x=${targetedVillage.x}&y=${targetedVillage.y}&catapult=${requiredCatapultsForBuilding}`;
        console.log(attackLink);
        window.open(attackLink, "_blank");
      });
    };
    document.querySelector("#catapultTable").appendChild(button);
  } else {
    alert("No targeted buildings with levels greater than 0 found.");
  }
})();

// const attackLink = `https://enc2.tribalwars.net/game.php?village=${attackingVillageId}&screen=place&target=&x=${targetedVillage.x}&y=${targetedVillage.y}&catapult=${requiredCatapultsForBuilding}`;

//enc2.tribalwars.net/game.php?&village=4522&screen=place&x=480&y=554&sword=537
