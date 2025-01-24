type Play = {
  name: string;
  type: string;
};

type Performance = {
  playID: string;
  audience: number;
};

type PerformanceSummary = {
  customer: string;
  performances: Performance[];
};

export function statement(
  summary: PerformanceSummary,
  plays: Record<string, Play>
) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${summary.customer}\n`;

  for (let perf of summary.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    // add volume credits
    volumeCredits += calculateCredistsFor(play, perf);
    // print line for this order
    result += ` ${play.name}: ${formatAsUSD(thisAmount)} (${
      perf.audience
    } seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${formatAsUSD(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

function formatAsUSD(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

function calculateCredistsFor(play: Play, performance: Performance) {
  const baseCredits = Math.max(performance.audience - 30, 0);
  const extraCreditsForComedyAttendees = Math.floor(performance.audience / 5);

  return "comedy" === play.type
    ? baseCredits + extraCreditsForComedyAttendees
    : baseCredits;
}

function calculateAmount(play: Play, performance: Performance) {
  let totalAmount = 0;
  switch (play.type) {
    case "tragedy":
      totalAmount = 40000;
      if (performance.audience > 30) {
        totalAmount += 1000 * (performance.audience - 30);
      }
      break;
    case "comedy":
      totalAmount = 30000;
      if (performance.audience > 20) {
        totalAmount += 10000 + 500 * (performance.audience - 20);
      }
      totalAmount += 300 * performance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return totalAmount;
}
