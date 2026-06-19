export function getGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const who = name?.split(" ")[0] || "Admin";

  if (hour >= 5 && hour < 12) return `Good Morning, ${who}`;
  if (hour >= 12 && hour < 17) return `Good Afternoon, ${who}`;
  return `Good Evening, ${who}`;
}
