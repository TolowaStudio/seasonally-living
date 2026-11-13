import type { BrandContent } from "./types";

// Hearth brand pages (/fireplaces/[brand]). Generated from manufacturer research (2026-11-12), then edited.
// Images: Cloudinary public IDs (cloud tolowa-studio) copied from each maker's site for dealer use.
export const BRANDS: BrandContent[] = [
  {
    "slug": "stuv",
    "name": "Stûv",
    "origin": "Belgium",
    "categories": [
      "Wood stoves",
      "Wood inserts",
      "Wood fireplaces"
    ],
    "tagline": {
      "before": "Stûv: ",
      "emphasis": "the fire, designed."
    },
    "summary": "Stûv designs and builds wood stoves, inserts and fireplaces in Belgium, adapted for North America. Clean lines, big windows on the fire and clean-burning combustion, from the compact Stûv 6 to the rotating Stûv 30.",
    "heroImage": "seasonally-living/brands/stuv/s-21-sf-2",
    "heroAlt": "A double-sided Stûv 21 wood fireplace burning in a brick wall between two rooms",
    "heroPosition": "center 50%",
    "points": [
      {
        "title": "A fire you can watch",
        "body": "Wide windows on every model, frameless guillotine glass on the Stûv 21, and a Stûv 30 that turns to face the room."
      },
      {
        "title": "Clean-burning and certified",
        "body": "Most Stûv stoves and inserts are EPA certified and UL/ULC listed for North America. We'll show you which fits your home and the valley's burn rules."
      },
      {
        "title": "Installed and vented by our crew",
        "body": "We size the venting to the model and install it ourselves, the way we have since 1979."
      }
    ],
    "sections": [
      {
        "name": "Stûv 6",
        "summary": "The smallest Stûv line: a compact freestanding stove and a small-hearth insert, both with a firebox that widens toward the glass for a broad view.",
        "models": [
          {
            "name": "s[6]H",
            "description": "A compact freestanding stove with curved sides and a black firebox that widens toward the front door.",
            "facts": [
              "One size: s[6]H 76/60",
              "EPA heat output 21,067 BTU/h; max 64,000 BTU/h",
              "EPA efficiency 69%; 1.2 g/h particulate"
            ],
            "type": "Wood stove",
            "image": "seasonally-living/brands/stuv/stuv-6",
            "alt": "Stûv s[6]H",
            "url": "https://stuvamerica.com/en/products/stuv-6h/"
          },
          {
            "name": "s[6]in",
            "description": "A small wood insert for tight masonry hearths that narrow toward the back, keeping a wide view of the flames.",
            "facts": [
              "Three sizes: 66/50, 76/55, 76/60",
              "EPA heat output 19,316-21,732 BTU/h; max 49,000-64,000 BTU/h",
              "EPA efficiency 67-69%; heats 1,000-1,400 sq ft"
            ],
            "type": "Wood insert",
            "image": "seasonally-living/brands/stuv/s-6-in",
            "alt": "Stûv s[6]in",
            "url": "https://stuvamerica.com/en/products/stuv-6/"
          }
        ]
      },
      {
        "name": "Stûv 16",
        "summary": "A clean-lined, handle-free family of wood stoves, inserts and zero-clearance fireplaces in three sizes (58, 68, 78) with a very wide window on the fire.",
        "models": [
          {
            "name": "s[16]cube",
            "description": "The freestanding square-lined Stûv 16 stove, sitting straight on the floor, with a removable key instead of a visible door handle.",
            "facts": [
              "Sizes 58, 68, 78",
              "EPA heat output 23,727-27,092 BTU/h; max 65,000-86,000 BTU/h",
              "EPA efficiency 66-71%; heats 1,400-2,100 sq ft"
            ],
            "type": "Wood stove",
            "image": "seasonally-living/brands/stuv/hero",
            "alt": "Stûv s[16]cube",
            "url": "https://stuvamerica.com/en/products/stuv-16/"
          },
          {
            "name": "s[16]H",
            "description": "The Stûv 16 stove on an H-shaped base that adds built-in log storage below the firebox.",
            "facts": [
              "Sizes 58, 68, 78",
              "EPA heat output 23,727-27,092 BTU/h; max 65,000-86,000 BTU/h",
              "Integrated log storage in H-base; weight 332-396 lb"
            ],
            "type": "Wood stove",
            "image": "seasonally-living/brands/stuv/s-16-h",
            "alt": "Stûv s[16]H",
            "url": "https://stuvamerica.com/en/products/stuv-16/"
          },
          {
            "name": "s[16]V",
            "description": "The Stûv 16 stove on a tall V-shaped base for a raised fire.",
            "facts": [
              "Sizes 58, 68, 78",
              "EPA heat output 23,727-27,092 BTU/h; max 65,000-86,000 BTU/h",
              "EPA efficiency 66-71%; heats 1,400-2,100 sq ft"
            ],
            "type": "Wood stove",
            "image": "seasonally-living/brands/stuv/s-16-v",
            "alt": "Stûv s[16]V",
            "url": "https://stuvamerica.com/en/products/stuv-16/"
          },
          {
            "name": "s[16]in",
            "description": "A wide-view wood insert that upgrades an existing masonry fireplace to modern clean-burn performance, with finishing frames to cover the gap.",
            "facts": [
              "Sizes 58, 68, 78; StûvGrey finish",
              "EPA heat output 23,727-27,092 BTU/h; max 65,000-86,000 BTU/h",
              "Heats 1,400-2,100 sq ft; weight 180-228 lb"
            ],
            "type": "Wood insert",
            "image": "seasonally-living/brands/stuv/s-16-in",
            "alt": "Stûv s[16]in",
            "url": "https://stuvamerica.com/en/products/stuv-16-in/"
          },
          {
            "name": "s[16]Z",
            "description": "A zero-clearance, insulated wood fireplace built into a wall, with a wide view of the flames and no visible handle.",
            "facts": [
              "Sizes 58, 68, 78; StûvGrey finish",
              "EPA heat output 23,727-27,092 BTU/h; max 65,000-86,000 BTU/h; under 2 g/h particulate",
              "Zero clearance; heats 1,400-2,100 sq ft"
            ],
            "type": "Wood fireplace",
            "image": "seasonally-living/brands/stuv/s-16-z",
            "alt": "Stûv s[16]Z",
            "url": "https://stuvamerica.com/en/products/stuv-16-z/"
          }
        ]
      },
      {
        "name": "Stûv 21",
        "summary": "Architectural built-in wood fireplaces with a frameless guillotine glass window so the fire can be viewed open or closed, in single- or double-sided versions.",
        "models": [
          {
            "name": "s[21]sf",
            "description": "A single-faced built-in fireplace with a frameless guillotine glass window and a choice of surround frames.",
            "facts": [
              "Sizes 85, 95, 105, 125",
              "Nominal heat output 43,000-65,000 BTU/h (European test protocol)",
              "Heats 1,400-1,800 sq ft; 4.8-8.4 cu ft firebox"
            ],
            "type": "Wood fireplace",
            "image": "seasonally-living/brands/stuv/stuv-21",
            "alt": "Stûv s[21]sf",
            "url": "https://stuvamerica.com/en/products/stuv-21/"
          },
          {
            "name": "s[21]df",
            "description": "A double-sided built-in fireplace that shows the fire from two faces, for dividing walls or open-plan rooms.",
            "facts": [
              "Sizes 85, 95, 125",
              "Nominal heat output 48,000-61,000 BTU/h (European test protocol)",
              "Heats 1,400-1,800 sq ft; 6.5-10.6 cu ft firebox"
            ],
            "type": "Wood fireplace",
            "image": "seasonally-living/brands/stuv/s-21-df",
            "alt": "Stûv s[21]df",
            "url": "https://stuvamerica.com/en/products/stuv-21/"
          }
        ]
      },
      {
        "name": "Stûv 21-clad",
        "summary": "Turnkey freestanding fireplaces with their own casing and a visible insulated chimney, so they need no finishing, in single- or double-sided formats.",
        "models": [
          {
            "name": "s[21CLAD]sf2",
            "description": "A ready-to-install single-faced freestanding fireplace with guillotine glass for an open or closed fire.",
            "facts": [
              "Sizes 85, 95, 105, 125",
              "Nominal heat output 43,000-65,000 BTU/h (European test protocol)",
              "Heats 1,400-1,800 sq ft; weight 765-975 lb"
            ],
            "type": "Wood fireplace",
            "image": "seasonally-living/brands/stuv/stuv-21-clad",
            "alt": "Stûv s[21CLAD]sf2",
            "url": "https://stuvamerica.com/en/products/stuv-21-clad/"
          },
          {
            "name": "s[21CLAD]df2",
            "description": "A ready-to-install double-sided freestanding fireplace, visible from two faces.",
            "facts": [
              "Sizes 85, 95, 125",
              "Nominal heat output 48,000-61,000 BTU/h (European test protocol)",
              "Heats 1,400-1,800 sq ft; weight 885-1,100 lb"
            ],
            "type": "Wood fireplace",
            "image": "seasonally-living/brands/stuv/s-21clad-df2",
            "alt": "Stûv s[21CLAD]df2",
            "url": "https://stuvamerica.com/en/products/stuv-21-clad/"
          }
        ]
      },
      {
        "name": "Stûv 30 compact",
        "summary": "Slow-burning cylindrical stoves with a drum that rotates up to 360 degrees to reveal a loading door, glass door or closed face.",
        "models": [
          {
            "name": "s[30C]one",
            "description": "The simplest rotating Stûv 30, in black with a glass door only.",
            "facts": [
              "Black; glass door only",
              "EPA heat output 17,049 BTU/h; max 47,000 BTU/h; 73.9% efficiency",
              "Heats about 900 sq ft; weight 248 lb; rotates up to 360 degrees"
            ],
            "type": "Wood stove",
            "image": "seasonally-living/brands/stuv/s-30c-one",
            "alt": "Stûv s[30C]one",
            "url": "https://stuvamerica.com/en/products/stuv-30/"
          },
          {
            "name": "s[30C]",
            "description": "The standard rotating stove with three doors (loading, glass, closed) in StûvGrey.",
            "facts": [
              "StûvGrey; three doors",
              "EPA heat output 17,049 BTU/h; max 47,000 BTU/h; 73.9% efficiency",
              "Heats about 900 sq ft; weight 284 lb"
            ],
            "type": "Wood stove",
            "image": "seasonally-living/brands/stuv/stuv-30-compact",
            "alt": "Stûv s[30C]",
            "url": "https://stuvamerica.com/en/products/stuv-30/"
          },
          {
            "name": "s[30C]H",
            "description": "The three-door rotating stove on a base fitted with a refractory-brick heat accumulator that keeps radiating after the fire is out.",
            "facts": [
              "StûvGrey; three doors",
              "EPA heat output 17,049 BTU/h; max 47,000 BTU/h; 73.9% efficiency",
              "Weight 340 lb plus 330 lb heat accumulator"
            ],
            "type": "Wood stove",
            "image": "seasonally-living/brands/stuv/s-30c-h",
            "alt": "Stûv s[30C]H",
            "url": "https://stuvamerica.com/en/products/stuv-30/"
          }
        ]
      }
    ],
    "makerUrl": "https://stuvamerica.com/en/",
    "sourceNote": "Product images and specifications courtesy of Stûv America."
  },
  {
    "slug": "kuma",
    "name": "Kuma",
    "origin": "Idaho, USA",
    "categories": [
      "Wood stoves",
      "Wood inserts",
      "Cookstoves"
    ],
    "tagline": {
      "before": "Kuma: ",
      "emphasis": "built for real winters."
    },
    "summary": "Kuma builds heavy-duty wood stoves, inserts and a wood cookstove in Idaho. Their LE-1 line burns clean and holds a long, steady fire, made for homes that heat with wood.",
    "heroImage": "seasonally-living/brands/kuma/alpine-le-1",
    "heroAlt": "A Kuma Alpine wood insert burning in a brick fireplace",
    "heroPosition": "center 55%",
    "points": [
      {
        "title": "Made in the Northwest",
        "body": "Built in Idaho for long, cold winters, by people who heat their own homes with wood."
      },
      {
        "title": "Clean, long burns",
        "body": "The LE-1 stoves and inserts are EPA certified, with fireboxes sized for overnight heat."
      },
      {
        "title": "Heat and cook on one fire",
        "body": "The Applewood cookstove has a cooktop and oven, so the same fire heats the room and makes dinner."
      }
    ],
    "sections": [
      {
        "name": "Wood inserts",
        "summary": "Cordwood inserts that fit into an existing masonry or zero-clearance fireplace and put the heat into the room.",
        "models": [
          {
            "name": "Alpine LE-1",
            "description": "Smaller of Kuma's two current inserts, suited to modest living areas.",
            "facts": [
              "63,000 BTU cordwood (EPA est. 29,153)",
              "78% HHV efficiency",
              "1.8 ft3 firebox, 16 in logs"
            ],
            "image": "seasonally-living/brands/kuma/alpine-le-1",
            "alt": "Kuma Alpine LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/alpine-le",
            "inShowroom": true
          },
          {
            "name": "Cascade LE-1",
            "description": "Larger insert with a bigger firebox for longer burns and bigger homes.",
            "facts": [
              "82,000 BTU cordwood (EPA est. 30,612)",
              "78% HHV efficiency",
              "2.5 ft3 firebox, 18 in logs"
            ],
            "image": "seasonally-living/brands/kuma/cascade-le-1",
            "alt": "Kuma Cascade LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/cascade-le"
          }
        ]
      },
      {
        "name": "Wood stoves",
        "summary": "Freestanding LE-1 stoves in two firebox sizes, offered in several cabinet styles.",
        "models": [
          {
            "name": "Aspen LE-1",
            "description": "Small-firebox freestanding stove for mid-size spaces.",
            "facts": [
              "63,000 BTU cordwood (EPA est. 29,153)",
              "1.8 ft3 firebox",
              "Heats up to 1,800 sq ft"
            ],
            "image": "seasonally-living/brands/kuma/aspen-le-1",
            "alt": "Kuma Aspen LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/aspen-le"
          },
          {
            "name": "Tamarack LE-1",
            "description": "Same small-firebox engine as the Aspen in a different cabinet style.",
            "facts": [
              "63,000 BTU cordwood",
              "1.8 ft3 firebox",
              "Heats up to 1,800 sq ft"
            ],
            "image": "seasonally-living/brands/kuma/tamarack-le-1",
            "alt": "Kuma Tamarack LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/tamarack-le"
          },
          {
            "name": "Aberdeen LE-1",
            "description": "Small-firebox stove with a traditional look.",
            "facts": [
              "63,000 BTU cordwood",
              "1.8 ft3 firebox",
              "Heats up to 1,800 sq ft"
            ],
            "image": "seasonally-living/brands/kuma/aberdeen-le-1",
            "alt": "Kuma Aberdeen LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/aberdeen-le"
          },
          {
            "name": "Ashwood LE-1",
            "description": "Large-firebox stove for bigger homes or cold-climate primary heat.",
            "facts": [
              "82,000 BTU cordwood (EPA est. 30,612)",
              "2.5 ft3 firebox",
              "Heats up to 2,800 sq ft"
            ],
            "image": "seasonally-living/brands/kuma/ashwood-le-1",
            "alt": "Kuma Ashwood LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/ashwood-le"
          },
          {
            "name": "Wood Classic LE-1",
            "description": "Large-firebox stove in Kuma's classic styling.",
            "facts": [
              "82,000 BTU cordwood",
              "2.5 ft3 firebox",
              "Heats up to 2,800 sq ft"
            ],
            "image": "seasonally-living/brands/kuma/wood-classic-le-1",
            "alt": "Kuma Wood Classic LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/wood-classic-le"
          },
          {
            "name": "Cambridge LE-1",
            "description": "Large-firebox stove with a more furniture-like cabinet.",
            "facts": [
              "82,000 BTU cordwood",
              "2.5 ft3 firebox",
              "Heats up to 2,800 sq ft"
            ],
            "image": "seasonally-living/brands/kuma/cambridge-le-1",
            "alt": "Kuma Cambridge LE-1",
            "url": "https://www.kumastoves.com/Store/ProductDetails/cambridge-le"
          }
        ]
      },
      {
        "name": "Cookstoves",
        "summary": "A wood-fired cookstove that heats a room and cooks meals on one fire.",
        "models": [
          {
            "name": "Applewood",
            "description": "Compact wood cookstove with a cooktop and oven, made to heat a small home and cook on the same fire.",
            "facts": [
              "25,000 BTU cordwood",
              "EPA exempt",
              "1.2 ft3 firebox, 14 in logs"
            ],
            "image": "seasonally-living/brands/kuma/hero",
            "alt": "Kuma Applewood",
            "url": "https://www.kumastoves.com/Store/ProductDetails/applewood",
            "inShowroom": true
          }
        ]
      }
    ],
    "makerUrl": "https://www.kumastoves.com/",
    "sourceNote": "Product images and specifications courtesy of Kuma Stoves."
  },
  {
    "slug": "morso",
    "name": "Morsø",
    "origin": "Denmark",
    "categories": [
      "Wood stoves",
      "Wood inserts"
    ],
    "tagline": {
      "before": "Morsø: ",
      "emphasis": "Danish cast iron since 1853."
    },
    "summary": "Morsø has cast wood stoves in Denmark since 1853. Heavy cast iron, simple Scandinavian lines and the classic squirrel stove, alongside modern round and wide-window models.",
    "heroImage": "seasonally-living/brands/morso/3112-b-2",
    "heroAlt": "A Morsø cast-iron stove burning, with a dog resting on the rug in front",
    "heroPosition": "center 45%",
    "points": [
      {
        "title": "Cast iron that lasts",
        "body": "Thick cast iron holds and radiates heat long after the fire burns down, and stands up to decades of use."
      },
      {
        "title": "Design classics",
        "body": "From the squirrel-relief 1400 series to the round 6100 and the wide-window 7110, each one is unmistakably Morsø."
      },
      {
        "title": "Stoves and inserts",
        "body": "Freestanding stoves for any room, and cast-iron inserts that turn an old fireplace into real heat."
      }
    ],
    "sections": [
      {
        "name": "Wood stoves",
        "summary": "Cast-iron freestanding stoves, from the classic squirrel-relief 1400 series to modern clean-lined models.",
        "models": [
          {
            "name": "1410 B (squirrel sides)",
            "description": "Compact classic cast-iron stove with the squirrel relief on both sides.",
            "facts": [
              "Max 24,733 BTU/hr",
              "Heats up to 1,000 sq ft",
              "EPA approved"
            ],
            "image": "seasonally-living/brands/morso/1410-b-with-squirrel-sides",
            "alt": "Morsø 1410 B (squirrel sides)",
            "url": "https://morsoe.com/us/product/indoor/wood-burning-stove/p1410_us",
            "inShowroom": true
          },
          {
            "name": "1440 B",
            "description": "Small classic stove in the 1400 family.",
            "facts": [
              "EPA approved"
            ],
            "image": "seasonally-living/brands/morso/1440-b",
            "alt": "Morsø 1440 B",
            "url": "https://morsoe.com/us/product/indoor/wood-burning-stove/p1440_us"
          },
          {
            "name": "2B Classic",
            "description": "Long, narrow radiant stove with roots going back over 70 years.",
            "facts": [
              "Max 31,988 BTU/hr",
              "Heats up to 1,200 sq ft",
              "18 in logs; 253 lb"
            ],
            "image": "seasonally-living/brands/morso/2b-classic",
            "alt": "Morsø 2B Classic",
            "url": "https://morsoe.com/us/product/indoor/wood-burning-stove/p2bclassic_us"
          },
          {
            "name": "3112 B",
            "description": "Classic Morso look with newer combustion tech and a larger firebox.",
            "facts": [
              "Max 28,000 BTU/hr",
              "Heats up to 1,000-1,200 sq ft",
              "0.85 ft3 firebox; 245 lb"
            ],
            "image": "seasonally-living/brands/morso/3112-b",
            "alt": "Morsø 3112 B",
            "url": "https://morsoe.com/us/product/indoor/wood-burning-stove/p3112_us"
          },
          {
            "name": "6140 B",
            "description": "Clean-lined cast-iron stove with hidden hinges and a convection system.",
            "facts": [
              "Max 19,067 BTU/hr",
              "Heats up to 1,000 sq ft",
              "0.505 ft3 firebox; 258 lb"
            ],
            "image": "seasonally-living/brands/morso/6140-b",
            "alt": "Morsø 6140 B",
            "url": "https://morsoe.com/us/product/indoor/wood-burning-stove/p6140_us",
            "inShowroom": true
          },
          {
            "name": "7110 C",
            "description": "Modern horizontal stove with a large bar-free glass door.",
            "facts": [
              "Max 36,554 BTU/hr",
              "Heats up to 1,300 sq ft",
              "16.5 in logs; 309 lb"
            ],
            "image": "seasonally-living/brands/morso/7110-c",
            "alt": "Morsø 7110 C",
            "url": "https://morsoe.com/us/product/indoor/wood-burning-stove/p7110_us"
          }
        ]
      },
      {
        "name": "Wood inserts",
        "summary": "Cast-iron inserts for existing masonry fireplaces.",
        "models": [
          {
            "name": "5660 B Standard",
            "description": "Large-glass cast-iron insert with a four-sided frame, non-catalytic combustion.",
            "facts": [
              "Max 43,499 BTU",
              "Heats up to 2,200 sq ft",
              "1.15 ft3 firebox, 20 in logs"
            ],
            "image": "seasonally-living/brands/morso/5660-b-standard",
            "alt": "Morsø 5660 B Standard",
            "url": "https://morsoe.com/us/product/indoor/inserts/p5660st_us"
          },
          {
            "name": "5660 B Blower",
            "description": "Same 5660 insert with a convection blower.",
            "facts": [
              "Convection blower",
              "Cast iron",
              "Same firebox as the 5660 B Standard"
            ],
            "image": "seasonally-living/brands/morso/5660-b-blower",
            "alt": "Morsø 5660 B Blower",
            "url": "https://morsoe.com/us/product/indoor/inserts/p5660blower_us"
          }
        ]
      }
    ],
    "makerUrl": "https://morsoe.com/us",
    "sourceNote": "Product images and specifications courtesy of Morsø."
  },
  {
    "slug": "napoleon",
    "name": "Napoleon",
    "origin": "Canada",
    "categories": [
      "Gas fireplaces",
      "Gas inserts",
      "Electric"
    ],
    "tagline": {
      "before": "Napoleon: ",
      "emphasis": "flame at the touch of a button."
    },
    "summary": "Napoleon builds gas and electric fireplaces in Ontario, from traditional full-view fireplaces to wide linear designs. Instant heat, no ash, and warm on burn-ban days.",
    "heroImage": "seasonally-living/brands/napoleon/hero",
    "heroAlt": "A Napoleon linear gas fireplace with a wide, low flame",
    "heroPosition": "center 50%",
    "points": [
      {
        "title": "Gas, built in",
        "body": "Direct-vent fireplaces from a classic 36-inch to 62-inch linear statement walls."
      },
      {
        "title": "Inserts for old fireplaces",
        "body": "Convert an existing masonry or factory fireplace to clean, efficient gas. We fit the insert and the venting."
      },
      {
        "title": "Burn-ban ready",
        "body": "Gas and electric keep the room warm on the days the valley stops wood burning."
      }
    ],
    "sections": [
      {
        "name": "Gas fireplaces",
        "summary": "Direct vent gas fireplaces, from traditional-proportion to wide linear designs.",
        "models": [
          {
            "name": "Altitude X 36 (AX36)",
            "description": "Traditional-proportion 36 in full-view fireplace with a tall glass face.",
            "facts": [
              "Up to 36,500 BTU, natural gas",
              "42.4 x 35.3 x 18.8 in",
              "Viewing area 33.1 x 35.3 in"
            ],
            "image": "seasonally-living/brands/napoleon/altitude-x-36-ax36",
            "alt": "Napoleon Altitude X 36 (AX36)",
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-products/gas-fireplaces/altitude-x-36-ax36nte-2",
            "inShowroom": true
          },
          {
            "name": "Ascent Linear 36",
            "description": "Compact linear fireplace with a wide, low flame and multiple designer options.",
            "facts": [
              "Up to 17,500 BTU, natural gas",
              "39.1 x 35.9 x 15.8 in",
              "Viewing area 16.75 x 30.75 in"
            ],
            "image": "seasonally-living/brands/napoleon/ascent-linear-36",
            "alt": "Napoleon Ascent Linear 36",
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-products/gas-fireplaces/ascent-linear-36-bl36nte-2"
          },
          {
            "name": "Vector 62 (LV62N)",
            "description": "Large linear fireplace for a statement wall.",
            "facts": [
              "Up to 42,000 BTU, natural gas",
              "41.2 x 77.3 x 19.9 in",
              "Viewing area 18.6 x 64.75 in"
            ],
            "image": "seasonally-living/brands/napoleon/vector-62-lv62n",
            "alt": "Napoleon Vector 62 (LV62N)",
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-products/gas-fireplaces/vector-62-lv62n"
          },
          {
            "name": "Tall Vector 62 (TLV62)",
            "description": "Taller version of the Vector with a bigger flame picture and LED ember bed.",
            "facts": [
              "Up to 44,000 BTU, natural gas",
              "49.4 x 77.3 x 19.9 in",
              "Viewing area 26.8 x 64.6 in"
            ],
            "image": "seasonally-living/brands/napoleon/hero",
            "alt": "Napoleon Tall Vector 62 (TLV62)",
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-products/gas-fireplaces/tall-linear-vector-series/tall-linear-vector-62-tlv62n",
            "inShowroom": true
          },
          {
            "name": "Ascent X 42",
            "description": "Mid-size traditional-style fireplace with hand-painted logs and ember bed.",
            "facts": [
              "Up to 30,000 BTU, natural gas",
              "34.5 x 42 x 18.5 in",
              "Viewing area 20.25 x 34.5 in"
            ],
            "image": "seasonally-living/brands/napoleon/ascent-x-42",
            "alt": "Napoleon Ascent X 42",
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-products/gas-fireplaces/ascent-x-42-bx42ntre"
          },
          {
            "name": "Luxuria 62 (LVX62N-1)",
            "description": "Luxury-tier linear fireplace in the 62 in width with extensive design options.",
            "facts": [
              "Up to 44,000 BTU, natural gas",
              "41.2 x 81.3 x 17.2 in",
              "Viewing area 18.6 x 66.1 in"
            ],
            "image": "seasonally-living/brands/napoleon/luxuria-62-lvx62n-1",
            "alt": "Napoleon Luxuria 62 (LVX62N-1)",
            "url": "https://sites.salsify.com/7f15a6c7-dece-4721-ac9e-9fd4858ab82f/0df0b53e-bc61-4ed0-86ec-684755fc5e30/en-US/product/LVX62N-1/Luxuriatm-62-Direct-Vent-Fireplace-Natural-Gas-Electronic-Ignition/"
          }
        ]
      },
      {
        "name": "Gas inserts",
        "summary": "Direct vent inserts that convert an existing masonry or factory wood fireplace to gas.",
        "models": [
          {
            "name": "Oakville X4 (GDIX4N-1)",
            "description": "Insert for retrofitting an existing fireplace, with a triple flame pattern and brick-kit trim options.",
            "facts": [
              "Up to 40,000 BTU, natural gas",
              "24.6 x 34.1 x 18.75 in",
              "Viewing area 11.7 x 27.75 in"
            ],
            "image": "seasonally-living/brands/napoleon/oakville-x4-gdix4n-1",
            "alt": "Napoleon Oakville X4 (GDIX4N-1)",
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-remodeling/gas-inserts/oakville-x4-gdix4n-1"
          }
        ]
      },
      {
        "name": "Electric",
        "summary": "Built-in and wall-mount electric linear fireplaces; no venting required.",
        "models": [
          {
            "name": "Alluravision Slim 50 (NEFL50CHS-1)",
            "description": "Nearly frameless 50 in electric that hangs on the wall or recesses flush.",
            "facts": [
              "5,000 BTU, 1,450 W at 120 V",
              "Viewing area about 11 x 48.5 in",
              "About 4.25 in deep"
            ],
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-products/electric-fireplaces/alluravision-series"
          },
          {
            "name": "Alluravision Deep 50 (NEFL50CHD-1)",
            "description": "Deeper 50 in version with a higher heat output option on 240 V.",
            "facts": [
              "Up to 9,000 BTU on 240 V",
              "50.7 x 17.3 x 5.8 in",
              "6 ember bed colors"
            ],
            "url": "https://www.napoleon.com/en/us/fireplaces/products/fireplace-products/electric-fireplaces/alluravision-series"
          }
        ]
      }
    ],
    "makerUrl": "https://www.napoleon.com/en/us/fireplaces",
    "sourceNote": "Product images and specifications courtesy of Napoleon."
  },
];

export function getBrand(slug: string): BrandContent | undefined {
  return BRANDS.find((b) => b.slug === slug);
}
