export async function fireConfetti(options = {}) {
  try {
    const { default: confetti } = await import('canvas-confetti');
    return confetti(options);
  } catch {
    return null;
  }
}

