from typing import Dict

from app.schemas.yamibaito import GameMode


def clamp(value: int, min_value: int, max_value: int) -> int:
    return max(min_value, min(value, max_value))


def create_initial_meters(mode: GameMode) -> Dict[str, int]:
    return {meter.key: meter.initial for meter in mode.meters}


def apply_effect(
    meters: Dict[str, int],
    effect_values: Dict[str, int],
    mode: GameMode,
) -> Dict[str, int]:
    next_meters = dict(meters)

    meter_map = {meter.key: meter for meter in mode.meters}

    for key, delta in effect_values.items():
        if key not in meter_map:
            continue

        meter_def = meter_map[key]
        current = next_meters.get(key, meter_def.initial)
        next_meters[key] = clamp(current + delta, meter_def.min, meter_def.max)

    return next_meters


def get_ending_comment(mode: GameMode, meters: Dict[str, int]) -> str:
    safety = meters.get("safety", 50)
    risk = meters.get("risk", 50)
    awareness = meters.get("awareness", 50)

    if safety >= 70 and risk <= 30 and awareness >= 60:
        return "危険な求人をしっかり見抜けています。とても安全な判断ができました。"

    if risk >= 70:
        return "危険な選択が多く、闇バイトに巻き込まれる可能性が高い状態です。"

    if awareness >= 70:
        return "警戒心を持って行動できています。怪しい求人を避ける意識が高いです。"

    return "判断はできていますが、もう少し慎重に情報を確認するとより安全です。"