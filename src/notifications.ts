/**
 * 🌍 Globalt varningssystem för förarskuld
 * Skickar notiser när föraren närmar sig gränsen (80%) 
 * eller blockeras (100%).
 */
export const checkDebtStatus = (currentDebt: number, countryCode: string) => {
  // Gränser per land (exempel: R 50 i SA, KSh 400 i Kenya)
  const limits: Record<string, number> = {
    ZA: 50,
    KE: 400,
    NG: 2500,
    SE: 30, // 30 kr i Sverige
    DEFAULT: 5 // 5 EUR för övriga Europa
  };

  const limit = limits[countryCode] || limits.DEFAULT;
  const warningThreshold = limit * 0.8; // 80% varningsgräns

  if (currentDebt >= limit) {
    return {
      status: "BLOCKED",
      message: "DIN PROVISION ÄR FÖR HÖG. Du kommer inte att få några nya bud förrän du har betalat av din skuld från den senaste resan.",
      severity: "CRITICAL"
    };
  }

  if (currentDebt >= warningThreshold) {
    return {
      status: "WARNING",
      message: `VARNING: Din skuld är nu nära gränsen. Betala din provision snart för att undvika att bli avstängd från nya bud.`,
      severity: "HIGH"
    };
  }

  return { status: "OK", message: "", severity: "LOW" };
};
