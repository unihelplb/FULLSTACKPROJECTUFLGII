/* =====================================================================
   explore.js — Explore page controller (ES6 class)

   Responsibilities:
     - Calls ParksAPI to fetch a batch of parks once on load.
     - Handles the three required UI states: LOADING, ERROR, EMPTY.
     - Provides CLIENT-SIDE SEARCH over the fetched parks (by name/state).
     - Provides CLIENT-SIDE PAGINATION over the (filtered) results.
       -> This is the course's required "search/filter/pagination over the
          fetched data" feature.

   Why client-side: we fetch one batch of parks, then filter and page
   through them in the browser. Fewer API calls, instant search, and it
   matches the brief's "over the fetched data" wording.
   ===================================================================== */
class ExploreController {
  constructor() {
    this.api = new ParksAPI(CONFIG.NPS_KEY);
    this.perPage = 9;          // cards per page
    this.page = 1;             // current page (1-indexed)
    this.allParks = [];        // everything we fetched
    this.filtered = [];        // after search filter

    // DOM references
    this.grid = document.querySelector("#explore-grid");
    this.statusEl = document.querySelector("#explore-status");
    this.searchEl = document.querySelector("#explore-search");
    this.pagerEl = document.querySelector("#explore-pager");

    this.init();
  }

  async init() {
    // Wire up search (debounced lightly via input event)
    if (this.searchEl) {
      this.searchEl.addEventListener("input", () => {
        this.page = 1;
        this.applyFilter();
      });
    }

    await this.load();
  }

  setStatus(message) {
    if (this.statusEl) this.statusEl.textContent = message || "";
    this.statusEl.style.display = message ? "block" : "none";
  }

  async load() {
    // ---- LOADING state ----
    this.setStatus("Loading parks from the National Park Service…");
    this.grid.innerHTML = "";
    this.pagerEl.innerHTML = "";

    try {
      const { data } = await this.api.fetchParks(50, 0);

      // ---- EMPTY state (API returned nothing) ----
      if (!data.length) {
        this.setStatus("No parks were returned. Try again later.");
        return;
      }

      this.allParks = data;
      this.filtered = data;
      this.setStatus("");      // clear loading message
      this.render();
    } catch (err) {
      // ---- ERROR state ----
      this.setStatus(
        "Couldn't reach the National Park Service right now. " +
        "Check your connection or API key and refresh."
      );
      console.error(err);
    }
  }

  applyFilter() {
    const q = (this.searchEl?.value || "").trim().toLowerCase();
    this.filtered = !q
      ? this.allParks
      : this.allParks.filter((p) => {
          const name = (p.fullName || "").toLowerCase();
          const states = (p.states || "").toLowerCase();
          return name.includes(q) || states.includes(q);
        });
    this.render();
  }

  render() {
    // ---- EMPTY state (search matched nothing) ----
    if (!this.filtered.length) {
      this.grid.innerHTML = "";
      this.pagerEl.innerHTML = "";
      this.setStatus("No parks match that search. Try another name or state.");
      return;
    }
    this.setStatus("");

    const totalPages = Math.ceil(this.filtered.length / this.perPage);
    this.page = Math.min(this.page, totalPages);

    const startIdx = (this.page - 1) * this.perPage;
    const pageItems = this.filtered.slice(startIdx, startIdx + this.perPage);

    this.grid.innerHTML = pageItems.map((p) => this.cardHTML(p)).join("");
    this.renderPager(totalPages);
  }

  cardHTML(park) {
    const img = park.images && park.images[0] ? park.images[0].url : "";
    const thumb = img
      ? `style="background-image:url('${img}')"`
      : "";
    // Trim the (often long) NPS description to a card-friendly length
    const desc = (park.description || "").slice(0, 150).trim() +
      (park.description && park.description.length > 150 ? "…" : "");

    return `
      <article class="park-card">
        <div class="thumb" ${thumb}></div>
        <div class="body">
          <span class="loc">${park.states || ""}</span>
          <h3>${park.fullName || "Unnamed park"}</h3>
          <p>${desc}</p>
          <a class="btn-ghost" href="${park.url}" target="_blank" rel="noopener">
            Visit NPS page
          </a>
        </div>
      </article>`;
  }

  renderPager(totalPages) {
    if (totalPages <= 1) { this.pagerEl.innerHTML = ""; return; }

    const prevDisabled = this.page === 1 ? "disabled" : "";
    const nextDisabled = this.page === totalPages ? "disabled" : "";

    this.pagerEl.innerHTML = `
      <button class="page-btn" data-act="prev" ${prevDisabled}>← Prev</button>
      <span class="page-info">Page ${this.page} of ${totalPages}</span>
      <button class="page-btn" data-act="next" ${nextDisabled}>Next →</button>`;

    this.pagerEl.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.act === "prev" && this.page > 1) this.page--;
        if (btn.dataset.act === "next" && this.page < totalPages) this.page++;
        this.render();
        window.scrollTo({ top: this.grid.offsetTop - 90, behavior: "smooth" });
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new ExploreController());
