/* =====================================================================
   parks-api.js — NPS API access layer (ES6 class)

   Wraps the National Park Service Data API.
   - Endpoint: https://developer.nps.gov/api/v1/parks
   - Auth:     API key sent in the "X-Api-Key" request header
               (NPS docs require the header, NOT a URL query param)
   - Returns:  { total, data: [ {fullName, description, states, ...} ] }

   The key is read from CONFIG (config.js) so it isn't hard-coded here.
   ===================================================================== */
class ParksAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.base = "https://developer.nps.gov/api/v1/parks";
  }

  /**
   * Fetch a batch of parks.
   * @param {number} limit  how many to request
   * @param {number} start  offset (for the API's own paging)
   * @returns {Promise<{total:number, data:Array}>}
   */
  async fetchParks(limit = 50, start = 0) {
    // fields=images asks NPS to include photos (not returned by default)
    const url = `${this.base}?limit=${limit}&start=${start}&fields=images,states`;

    const res = await fetch(url, {
      headers: { "X-Api-Key": this.apiKey },
    });

    if (!res.ok) {
      // 403 = bad/missing key, 429 = rate limited, etc.
      throw new Error(`NPS API responded with ${res.status}`);
    }

    const json = await res.json();
    return { total: Number(json.total) || 0, data: json.data || [] };
  }
}
