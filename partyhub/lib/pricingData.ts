export const pricingData = {
  "states": {
    "andhra_pradesh": 1.3,
    "arunachal_pradesh": 1.0,
    "assam": 1.2,
    "bihar": 0,
    "chhattisgarh": 1.1,
    "goa": 0.8,
    "gujarat": 0,
    "haryana": 0.9,
    "himachal_pradesh": 0.9,
    "jharkhand": 1.1,
    "karnataka": 1.2,
    "kerala": 1.5,
    "madhya_pradesh": 1.1,
    "maharashtra": 1.0,
    "manipur": 1.2,
    "meghalaya": 1.0,
    "mizoram": 1.1,
    "nagaland": 1.2,
    "odisha": 1.1,
    "punjab": 0.95,
    "rajasthan": 1.0,
    "sikkim": 0.9,
    "tamil_nadu": 1.4,
    "telangana": 1.3,
    "tripura": 1.0,
    "uttar_pradesh": 1.1,
    "uttarakhand": 1.0,
    "west_bengal": 1.0,
    "delhi": 0.9,
    "chandigarh": 0.9,
    "puducherry": 0.95,
    "ladakh": 1.1,
    "lakshadweep": 1.3,
    "andaman_nicobar": 0.85,
    "dry_states": ["bihar", "gujarat"]
  },
  "spirits": {
    "whisky": {
      "brands": [
        { "name": "Officer's Choice", "segment": "budget", "price_750ml": [350, 550] },
        { "name": "Imperial Blue", "segment": "budget", "price_750ml": [450, 700] },
        { "name": "Royal Stag", "segment": "budget", "price_750ml": [500, 750] },
        { "name": "Blenders Pride", "segment": "mid", "price_750ml": [900, 1400] },
        { "name": "Antiquity Blue", "segment": "mid", "price_750ml": [1100, 1800] },
        { "name": "Signature", "segment": "mid", "price_750ml": [1000, 1600] },
        { "name": "Black Dog", "segment": "premium", "price_750ml": [2000, 3500] },
        { "name": "100 Pipers", "segment": "premium", "price_750ml": [1800, 3000] },
        { "name": "Jameson", "segment": "premium", "price_750ml": [2500, 4000] },
        { "name": "Chivas Regal", "segment": "luxury", "price_750ml": [3500, 6500] },
        { "name": "Johnnie Walker Black", "segment": "luxury", "price_750ml": [4000, 7000] }
      ]
    },
    "rum": {
      "brands": [
        { "name": "Old Monk", "segment": "budget", "price_750ml": [400, 700] },
        { "name": "McDowell's Rum", "segment": "budget", "price_750ml": [350, 600] },
        { "name": "Bacardi White", "segment": "mid", "price_750ml": [1200, 1800] },
        { "name": "Captain Morgan", "segment": "mid", "price_750ml": [1300, 2000] }
      ]
    },
    "vodka": {
      "brands": [
        { "name": "Magic Moments", "segment": "budget", "price_750ml": [600, 900] },
        { "name": "Romanov", "segment": "budget", "price_750ml": [500, 800] },
        { "name": "Smirnoff", "segment": "mid", "price_750ml": [900, 1500] },
        { "name": "Absolut", "segment": "premium", "price_750ml": [1800, 3200] },
        { "name": "Grey Goose", "segment": "luxury", "price_750ml": [5000, 8000] }
      ]
    },
    "gin": {
      "brands": [
        { "name": "Blue Riband", "segment": "budget", "price_750ml": [500, 800] },
        { "name": "Greater Than", "segment": "mid", "price_750ml": [1200, 1800] },
        { "name": "Tanqueray", "segment": "premium", "price_750ml": [2500, 4000] },
        { "name": "Bombay Sapphire", "segment": "premium", "price_750ml": [2500, 4200] }
      ]
    },
    "tequila": {
      "brands": [
        { "name": "Camino Real", "segment": "mid", "price_750ml": [2000, 3500] },
        { "name": "Jose Cuervo", "segment": "premium", "price_750ml": [3000, 5000] }
      ]
    }
  },
  "beer": {
    "brands": [
      { "name": "Kingfisher Strong", "segment": "budget", "price_650ml": [180, 200] },
      { "name": "Tuborg", "segment": "mid", "price_650ml": [200, 220] },
      { "name": "Budweiser", "segment": "premium", "price_650ml": [230, 250] },
      { "name": "Heineken", "segment": "premium", "price_650ml": [270, 300] },
      { "name": "Corona", "segment": "luxury", "price_650ml": [200, 250] }
    ]
  },
  "wine": {
    "brands": [
      { "name": "Sula", "segment": "mid", "price_750ml": [700, 1200] },
      { "name": "Fratelli", "segment": "mid", "price_750ml": [800, 1500] },
      { "name": "Grover Zampa", "segment": "premium", "price_750ml": [1200, 2500] }
    ]
  },
  "consumption": {
    "beer": {
      "per_person": 2,
      "unit_ml": 650
    },
    "spirits": {
      "ml_per_person": 180
    },
    "wine": {
      "ml_per_person": 150
    }
  }
};
