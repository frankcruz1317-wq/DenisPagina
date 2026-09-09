(function (browser, factory) {
  'use strict';
  const theme = factory();
  if (typeof module === 'object' && module.exports) module.exports = theme;
  if (!browser || !browser.document) return;
  function apply() {
    const season = theme.forDate(new Date());
    browser.document.documentElement.dataset.season = season;
    const meta = browser.document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme.colors[season];
  }
  apply();
  browser.addEventListener('pageshow', apply);
  browser.document.addEventListener('visibilitychange', function () {
    if (!browser.document.hidden) apply();
  });
  // Also refresh tabs left open across a season change, without reloading a form.
  browser.setInterval(apply, 60 * 60 * 1000);
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const colors = {fall:'#362116', winter:'#172e45', spring:'#203c2c', summer:'#133d3b'};
  const calendar = ['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter'];
  const formatter = new Intl.DateTimeFormat('en-US', {timeZone:'America/New_York',month:'numeric'});
  function forDate(date) {
    const month = Number(formatter.format(date));
    return calendar[month - 1];
  }
  return {forDate, colors};
});
