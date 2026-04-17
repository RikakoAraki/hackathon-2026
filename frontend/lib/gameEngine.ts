import {
  CardEffect,
  GameMode,
  MeterKey,
  MeterState,
} from "./types";

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
  effect: CardEffect | undefined,
  mode: GameMode
): MeterState {
  const next = { ...meters };

  if (!effect) return next;

  for (const meterDef of mode.meters) {
    const key = meterDef.key as MeterKey;
    const delta = effect.values[key] ?? 0;
    const min = meterDef.min ?? 0;
    const max = meterDef.max ?? 100;
    next[key] = clamp((next[key] ?? meterDef.initial ?? 0) + delta, min, max);
  }

  return next;
}

export function getEndingComment(mode: GameMode, meters: MeterState): string {
  const meterKeys = new Set(mode.meters.map((m) => m.key));

  // rumor系
  if (
    meterKeys.has("anxiety") ||
    meterKeys.has("trust") ||
    meterKeys.has("freedom") ||
    meterKeys.has("flow")
  ) {
    const anxiety = meters.anxiety ?? 0;
    const trust = meters.trust ?? 0;
    const freedom = meters.freedom ?? 0;
    const flow = meters.flow ?? 0;

    if (anxiety >= 75 && trust <= 35) {
      return "誤情報が広く拡散し、社会の混乱が深まりました。";
    }
    if (freedom <= 25 && flow <= 25) {
      return "情報統制が強すぎて、真実まで届きにくい社会になりました。";
    }
    if (trust >= 70 && anxiety <= 40 && freedom >= 45) {
      return "信頼と自由のバランスが比較的保たれました。";
    }
    return "情報空間は維持されましたが、各所にゆがみが残っています。";
  }

  // yami-baito系
  if (
    meterKeys.has("risk") ||
    meterKeys.has("safety") ||
    meterKeys.has("money") ||
    meterKeys.has("alertness") ||
    meterKeys.has("awareness")
  ) {
    const risk = meters.risk ?? 0;
    const safety = meters.safety ?? 0;
    const money = meters.money ?? 50;
    const alertness = meters.alertness ?? meters.awareness ?? 0;

    if (risk >= 75 && safety <= 30) {
      return "危険な募集を見抜けず、深刻なリスクに近づいてしまいました。";
    }
    if (safety >= 70 && alertness >= 70) {
      return "違和感のある求人を適切に見抜き、安全を守ることができました。";
    }
    if (money <= 20 && safety >= 60) {
      return "慎重に行動したため安全は守られましたが、収入機会はかなり限られました。";
    }
    return "いくつか危ない兆候には気づけましたが、まだ見抜ききれない募集も残っています。";
  }

  return "結果を集計しました。";
}