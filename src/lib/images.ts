// Unsplash placeholders (each checked by eye on 2026-11-12) until the showroom shoot
// and Stûv dealer assets land in Cloudinary (tolowa-studio / seasonally-living/brand/...).
const u = (id: string) => `https://images.unsplash.com/${id}`;

export const PHOTOS = {
  // Fire
  flames: u("photo-1648332202349-a1ca4f99ee0c"), // close-up fire in a stove
  stoveCabin: u("photo-1698933787134-af2d451985c7"), // A-frame living room, hanging stove
  stoveMinimal: u("photo-1761319914911-71b059a655d8"), // modern stove, white room, big windows
  stoveLiving: u("photo-1783628301708-c71042ce5622"), // living room with wood stove
  stoveMoody: u("photo-1678274909137-ae0677d24a9b"), // dark cabin wood stove
  gasLinear: u("photo-1774204834734-b3f799062993"), // modern linear fireplace, big windows
  gasStone: u("photo-1612031737124-28aeae3f2863"), // stacked-stone gas fireplace
  electricMantel: u("photo-1774578342266-18a6eaf1c809"), // electric insert in a white mantel
  electricLinear: u("photo-1775359923999-214631cc9868"), // linear electric on a white wall
  mantelBrick: u("photo-1611589781386-0e204af66f6f"), // white brick mantel
  masonryFire: u("photo-1697834158336-705dbfa2cc9a"), // traditional masonry fireplace burning
  chimneySmoke: u("photo-1732734109593-b52f5e713a01"), // smoke from a chimney
  chimneyBrick: u("photo-1767680148632-137c54313c35"), // brick chimney among trees
  // Water
  hotTubPeople: u("photo-1790361793380-3484892683aa"), // two people in steaming tub, snowy forest
  hotTubDeck: u("photo-1634253539564-8887939e239f"), // acrylic hot tub on a deck by water
  hotTubGarden: u("photo-1772040942277-b194d9d0b648"), // hot tub on deck in garden
  hotTubSnow: u("photo-1734256991510-51011f7d5aad"), // hot tub in snowy forest
  water: u("photo-1500673587002-1d2548cfba1b"), // sunlit rippling clear water
  swimmer: u("photo-1768576544627-c0a7149d0c5b"), // swimmer underwater
  pool: u("photo-1767950470198-c9cd97f8ed87"), // blue-hour home with lap pool
  poolNight: u("photo-1757439402268-1da284675170"), // lit pool at night
  // Sweat
  saunaDark: u("photo-1743286159555-ea765c1bc5e6"), // dark sauna, stones and bucket
  saunaSteam: u("photo-1660735698223-23a4edefa264"), // steam rising off sauna stones
  saunaModern: u("photo-1770625468064-ed83f3320169"), // modern sauna, tiered benches
  // Outdoor living
  outdoorKitchen: u("photo-1762117361035-5cd4f9c24795"), // outdoor kitchen island with stools
  outdoorKitchenPool: u("photo-1762117360871-f11fbad00ee1"), // outdoor kitchen by a pool
  pergolaKitchen: u("photo-1694885090746-d90472e11c0e"), // covered patio with grill
  gazebo: u("photo-1783479857812-12bbb4be9766"), // gazebo beside a pool
  // Trade
  framing: u("photo-1587582423116-ec07293f0395"), // builder on a house frame
  framingInterior: u("photo-1704742950992-9815a104820c"), // interior wood framing
  mountains: u("photo-1506905925346-21bda4d32df4"), // ridges at sunrise
} as const;

export function photoUrl(src: string, w = 1600, h?: number) {
  const params = new URLSearchParams({ auto: "format", fit: "crop", w: String(w), q: "80" });
  if (h) params.set("h", String(h));
  return `${src}?${params.toString()}`;
}
