export async function wait(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000 * seconds));
}
