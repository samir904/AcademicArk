const getReferrerInfo = () => {
  const referrer = document.referrer || "";

  let source = "DIRECT";

  if (referrer.includes("google")) source = "SEARCH";
  else if (referrer.includes("bing")) source = "SEARCH";
  else if (referrer.includes("whatsapp")) source = "SOCIAL";
  else if (referrer.includes("facebook")) source = "SOCIAL";
  else if (referrer.includes("instagram")) source = "SOCIAL";

  return {
    referrerSource: source,
    refUrl: referrer || null
  };
};
