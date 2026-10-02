export const PAKISTAN_PROVINCES = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Azad Jammu & Kashmir",
  "Gilgit-Baltistan",
];

export const PAKISTAN_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Larkana",
  "Sheikhupura",
  "Gujrat",
  "Kasur",
  "Rahim Yar Khan",
  "Sahiwal",
  "Okara",
  "Wah Cantt",
  "Dera Ghazi Khan",
  "Mirpur (AJK)",
  "Muzaffarabad",
  "Mardan",
  "Swat",
  "Chiniot",
  "Kamoke",
  "Mandi Bahauddin",
  "Jhelum",
  "Khanewal",
  "Hafizabad",
  "Kohat",
  "Dera Ismail Khan",
  "Turbat",
  "Gilgit",
  "Skardu",
  "Gwadar",
  "Other City"
];

export const COURIER_PROVIDERS = [
  { id: "trax", name: "Trax Logistics", trackingUrl: "https://trax.pk/tracking?tracking_number=" },
  { id: "tcs", name: "TCS Courier", trackingUrl: "https://www.tcsexpress.com/track/" },
  { id: "leopards", name: "Leopards Courier", trackingUrl: "https://www.leopardscourier.com/tracking/" },
  { id: "postex", name: "PostEx", trackingUrl: "https://postex.pk/track/" },
  { id: "callcourier", name: "Call Courier", trackingUrl: "https://cod.callcourier.com.pk/tracking/partner/" },
  { id: "mnp", name: "M&P Express Logistics", trackingUrl: "https://mulphilog.com/tracking/" },
  { id: "rider", name: "Rider Delivery", trackingUrl: "https://withrider.com/track/" },
  { id: "inhouse", name: "In-House Express Rider", trackingUrl: "" },
];

export function validatePakistanPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[^0-9]/g, "");
  // Format: 03XXXXXXXXX (11 digits) or 923XXXXXXXXX (12 digits)
  return /^(03\d{9}|923\d{9})$/.test(cleaned);
}

export function formatPakistanPhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("92") && cleaned.length === 12) {
    return `+92 ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phone;
}
