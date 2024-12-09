export class Utils {
  static toCents(val: number): bigint {
    return BigInt(Math.round(val * 100));
  }

  static fromCents(val: bigint): number {
    return Number(val) / 100;
  }
}
