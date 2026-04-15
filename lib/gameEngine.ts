import { Effect, GameMode, MeterKey, MeterState } from "./types";

export function createInitialMeters(mode: GameMode): MeterState {
  return mode.meters.reduce((acc, meter) => {
    acc[meter.key] = meter.initial;
    return acc;
  }, {} as MeterState);
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function applyEffect(
  meters: MeterState,
  effect: Effect,
  mode: GameMode
): MeterState {
  const next = { ...meters };

  for (const meterDef of mode.meters) {
    const key = meterDef.key as MeterKey;
    const delta = effect[key] ?? 0;
    const min = meterDef.min ?? 0;
    const max = meterDef.max ?? 100;
    next[key] = clamp(next[key] + delta, min, max);
  }

  return next;
}

export function getEndingComment(meters: MeterState): string {
  const { anxiety, trust, freedom, flow } = meters;

  if (anxiety >= 75 && trust <= 35) {
    return "誤情報が広く拡散し、社会の混乱が深まりました。人々は何を信じればよいのかわからなくなっています。";
  }

  if (freedom <= 25 && flow <= 25) {
    return "情報統制が強すぎて、真実まで届きにくい社会になりました。安全は増した一方で、自由な流通は大きく失われています。";
  }

  if (trust >= 70 && anxiety <= 40 && freedom >= 45) {
    return "慎重な対応によって信頼と自由のバランスが保たれました。完全ではないものの、健全な情報空間に近づいています。";
  }

  if (flow <= 30) {
    return "誤情報は抑えられましたが、情報流通そのものが停滞しました。社会は静かですが、必要な情報も届きにくくなっています。";
  }

  return "情報空間はどうにか維持されましたが、各所にひずみが残っています。何を優先するかで社会の姿は大きく変わるようです。";
}