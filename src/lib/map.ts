/** OpenStreetMap embed (no API key) centred on a marker. */
export const mapEmbedUrl = (lat: number, lon: number) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.008},${lat - 0.005},${lon + 0.008},${lat + 0.005}&layer=mapnik&marker=${lat},${lon}`;

export const mapLink = (lat: number, lon: number) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
