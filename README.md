Student name: Peter El Gemayel

Hello dr. this is my project related to trails and parks in the USA.

I used Claude to help me build it. I hope you find it interesting. I used an API from the NPS website of the United States that has all the parks data.

I used 3 prompts for claude

Prompt 1, the custom requirement (sticky nav):

"Build a sticky top navigation bar as an ES6 class with at least 4 internal links. It should pin to the top on scroll using position: sticky, collapse into a hamburger menu below 768px, and highlight the current page by matching the filename from window.location.pathname. Hand-written CSS, no jQuery, and comment how the sticky positioning and active-link detection work."

Prompt 2, the API integration:

"Write an ES6 class that fetches parks from the NPS Data API using the X-Api-Key header, and a controller class that does client-side search and pagination over the fetched results. Handle loading, error, and empty states properly, and read the API key from a separate config file instead of hardcoding it."

Prompt 3, the curated content + structure:

"Help me set up a curated dataset of 15 real U.S. national parks with name, state, established year, and notes, and an ES6 class that renders them as responsive cards on a separate Field Notes page."

One mistake claude made was that he told me at one time to delete the INDEX.HTML file that resulted in a bad UI because github pages only viewed the READ.ME file and displayed a white screen with a header with the project's name.

