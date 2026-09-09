/* Shared validation; no customer information is stored in the browser. */
(function (root) {
  "use strict";
  const services = ["Leaf removal", "Fall yard cleanup", "Gutter cleaning", "Lawn mowing", "Mulch and edging", "Hedge trimming", "Hardscape", "Snow removal", "Other"];
  const towns = ["Hatfield", "Lansdale", "Telford", "Harleysville"];
  const clean = value => String(value || "").trim().replace(/\s+/g, " ");
  function phoneValid(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return /^\d{10}$/.test(digits) || /^1\d{10}$/.test(digits);
  }
  function addressErrors(address) {
    const errors = {};
    const street = clean(address.street);
    if (street.length < 5 || !/\d/.test(street) || !/[a-z]/i.test(street) || /\bp\.?\s*o\.?\s*box\b/i.test(street)) {
      errors.street = "Enter the house number and full street name for the property (not a PO box).";
    }
    if (clean(address.city).length < 2 || !/[a-z]/i.test(address.city)) errors.city = "Enter the city or town where the property is located.";
    if (address.state !== "PA") errors.state = "Select Pennsylvania for the service property.";
    if (!/^\d{5}(-\d{4})?$/.test(clean(address.zip))) errors.zip = "Enter a 5-digit ZIP code or ZIP+4.";
    return errors;
  }
  function fullAddress(address) {
    return [clean(address.street), clean(address.unit), clean(address.city), [clean(address.state), clean(address.zip)].filter(Boolean).join(" "), "United States"].filter(Boolean).join(", ");
  }
  const api = { services, towns, clean, phoneValid, addressErrors, fullAddress };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.QuoteRules = api;
})(typeof window !== "undefined" ? window : this);

