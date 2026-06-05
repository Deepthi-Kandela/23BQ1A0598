const PRIORITY_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// Exact data from the evaluation document
const NOTIFICATIONS = [
  { ID: "d146095a-0d86-4a34-9e69-3900a14576bc", Type: "Result",    Message: "mid-sem",                        Timestamp: "2026-04-22 17:51:30" },
  { ID: "b283218f-ea5a-4b7c-93a9-1f2f240d64b0", Type: "Placement", Message: "CSX Corporation hiring",         Timestamp: "2026-04-22 17:51:18" },
  { ID: "81589ada-0ad3-4f77-9554-f52fb558e09d", Type: "Event",     Message: "farewell",                       Timestamp: "2026-04-22 17:51:06" },
  { ID: "0005513a-142b-4bbc-8678-eefec65e1ede", Type: "Result",    Message: "mid-sem",                        Timestamp: "2026-04-22 17:50:54" },
  { ID: "ea836726-c25e-4f21-a72f-544a6af8a37f", Type: "Result",    Message: "project-review",                 Timestamp: "2026-04-22 17:50:42" },
  { ID: "003cb427-8fc6-47f7-bb00-be228f6b0d2c", Type: "Result",    Message: "external",                       Timestamp: "2026-04-22 17:50:30" },
  { ID: "e5c4ff20-31bf-4d40-8f02-72fda59e8918", Type: "Result",    Message: "project-review",                 Timestamp: "2026-04-22 17:50:18" },
  { ID: "1cfce5ee-ad37-4894-8946-d707627176a5", Type: "Event",     Message: "tech-fest",                      Timestamp: "2026-04-22 17:50:06" },
  { ID: "cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", Type: "Result",    Message: "project-review",                 Timestamp: "2026-04-22 17:49:54" },
  { ID: "8a7412bd-6065-4d09-8501-a37f11cc848b", Type: "Placement", Message: "Advanced Micro Devices Inc. hiring", Timestamp: "2026-04-22 17:49:42" },
];

function computeScore(notification) {
  const weight = PRIORITY_WEIGHT[notification.Type] ?? 0;
  const ageMs = Date.now() - new Date(notification.Timestamp).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);
  // Higher type weight = higher score, newer = higher score
  return weight * 1000 - ageHours;
}

function getTopN(notifications, n = 10) {
  return notifications
    .map((notif) => ({
      ...notif,
      _score: computeScore(notif),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, n);
}

function displayResults(notifications) {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║           TOP 10 PRIORITY NOTIFICATIONS                 ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("  Scoring Formula: type_weight x 1000 - age_in_hours");
  console.log("  Weights → Placement: 3 | Result: 2 | Event: 1\n");

  notifications.forEach((notif, index) => {
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
    console.log(`${medal} ──────────────────────────────────────────────`);
    console.log(`   Type      : ${notif.Type}`);
    console.log(`   Message   : ${notif.Message}`);
    console.log(`   ID        : ${notif.ID}`);
    console.log(`   Timestamp : ${notif.Timestamp}`);
    console.log(`   Score     : ${notif._score.toFixed(4)}`);
  });

  console.log("\n══════════════════════════════════════════════════════════");
  console.log(`  Total notifications processed : ${NOTIFICATIONS.length}`);
  console.log(`  Top N displayed               : ${notifications.length}`);
  console.log("══════════════════════════════════════════════════════════\n");
}

function main() {
  console.log("Processing notifications...");
  console.log(`Total loaded: ${NOTIFICATIONS.length} notifications\n`);

  const top10 = getTopN(NOTIFICATIONS, 10);
  displayResults(top10);
}

main();
