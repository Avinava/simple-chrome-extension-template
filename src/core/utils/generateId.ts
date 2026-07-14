/** Generate a short, collision-resistant id (time component + random suffix). */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
