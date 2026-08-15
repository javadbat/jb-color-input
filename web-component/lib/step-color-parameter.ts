export interface SteppedColorValue {
  value: string;
  caretPosition: number;
  replacement: string;
}

interface ParameterConfig {
  step: number;
  min: number;
  max: number;
}

const RGB_PARAMETER_CONFIGS: ParameterConfig[] = [
  { step: 1, min: 0, max: 255 },
  { step: 1, min: 0, max: 255 },
  { step: 1, min: 0, max: 255 },
  { step: 0.1, min: 0, max: 1 },
];

const OKLCH_PARAMETER_CONFIGS: ParameterConfig[] = [
  { step: 0.01, min: 0, max: 1 },
  { step: 0.001, min: 0, max: 0.4 },
  { step: 1, min: 0, max: 360 },
  { step: 0.1, min: 0, max: 1 },
];

const NUMBER_PATTERN = /[-+]?(?:\d+\.?\d*|\.\d+)/g;

export function stepColorParameter(value: string, caretPosition: number, direction: 1 | -1): SteppedColorValue | null {
  const colorMatch = value.match(/^\s*(rgba?|oklch)\((.*)\)\s*$/i);
  if (!colorMatch) return null;

  const functionName = colorMatch[1].toLowerCase();
  const body = colorMatch[2];
  const bodyStart = value.indexOf("(") + 1;
  const parameters = [...body.matchAll(NUMBER_PATTERN)];
  if (parameters.length < 3 || parameters.length > 4) return null;

  const parameterIndex = parameters.findIndex(match => {
    const start = bodyStart + (match.index ?? 0);
    const end = start + match[0].length;
    return caretPosition >= start && caretPosition <= end;
  });
  if (parameterIndex === -1) return null;

  const parameter = parameters[parameterIndex];
  const start = bodyStart + (parameter.index ?? 0);
  const end = start + parameter[0].length;
  const suffix = value.slice(end).match(/^(%|deg|grad|rad|turn)/i)?.[0].toLowerCase() ?? "";
  const configs = functionName === "oklch" ? OKLCH_PARAMETER_CONFIGS : RGB_PARAMETER_CONFIGS;
  const baseConfig = configs[parameterIndex];
  if (!baseConfig) return null;

  const config = convertConfigForUnit(baseConfig, functionName, parameterIndex, suffix);
  const currentValue = Number(parameter[0]);
  if (!Number.isFinite(currentValue)) return null;

  const decimalPlaces = Math.max(getDecimalPlaces(parameter[0]), getDecimalPlaces(config.step));
  const nextValue = Math.min(config.max, Math.max(config.min, currentValue + config.step * direction));
  const replacement = String(Number(nextValue.toFixed(decimalPlaces)));
  const nextCaretPosition = start + replacement.length;

  return {
    value: `${value.slice(0, start)}${replacement}${value.slice(end)}`,
    caretPosition: nextCaretPosition,
    replacement,
  };
}

function convertConfigForUnit(config: ParameterConfig, functionName: string, parameterIndex: number, unit: string): ParameterConfig {
  if (unit === "%") {
    if (functionName === "rgb" || functionName === "rgba") {
      return parameterIndex === 3 ? { step: 10, min: 0, max: 100 } : { step: 1, min: 0, max: 100 };
    }
    if (parameterIndex === 0) return { step: 1, min: 0, max: 100 };
    if (parameterIndex === 3) return { step: 10, min: 0, max: 100 };
  }

  if (functionName === "oklch" && parameterIndex === 2) {
    if (unit === "grad") return { step: 10 / 9, min: 0, max: 400 };
    if (unit === "rad") return { step: Math.PI / 180, min: 0, max: Math.PI * 2 };
    if (unit === "turn") return { step: 1 / 360, min: 0, max: 1 };
  }

  return config;
}

function getDecimalPlaces(value: string | number): number {
  const decimalPart = String(value).split(".")[1];
  return decimalPart?.length ?? 0;
}
