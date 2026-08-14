const API_BASE_URL = "https://de1.api.radio-browser.info/json";

/**
 * Search radio stations.
 *
 * @param {Object} options
 * @param {string} options.name - Station name/search term
 * @param {string} options.country - Country name
 * @param {string} options.tag - Genre/tag
 * @param {number} options.limit - Number of results
 */
export async function searchStations({
  name = "",
  country = "",
  tag = "",
  limit = 20,
} = {}) {
  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  if (country) {
    params.append("country", country);
  }

  if (tag) {
    params.append("tag", tag);
  }

  params.append("hidebroken", "true");
  params.append("limit", limit);
  params.append("order", "votes");
  params.append("reverse", "true");

  const url = `${API_BASE_URL}/stations/search?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Radio Browser API error: ${response.status}`
    );
  }

  return response.json();
}


/**
 * Get popular radio stations.
 */
export async function getPopularStations(limit = 20) {
  return searchStations({
    limit,
  });
}


/**
 * Get stations from a specific country.
 */
export async function getStationsByCountry(
  country,
  limit = 20
) {
  return searchStations({
    country,
    limit,
  });
}


/**
 * Get stations by genre/tag.
 */
export async function getStationsByGenre(
  tag,
  limit = 20
) {
  return searchStations({
    tag,
    limit,
  });
}


/**
 * Get a single station by its UUID.
 */
export async function getStationById(uuid) {
  const response = await fetch(
    `${API_BASE_URL}/stations/byuuid/${uuid}`
  );

  if (!response.ok) {
    throw new Error(
      `Radio Browser API error: ${response.status}`
    );
  }

  const stations = await response.json();

  return stations[0] || null;
}