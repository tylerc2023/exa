import {Color} from '../../models';

/*
SIZING https://material.io/design/typography/the-type-system.html#applying-the-type-scale
*/

const padding = {
  p00: 0,
  p01: 4,
  p02: 8,
  p03: 12,
  p04: 16,
  p05: 20,
  p06: 24,
  p07: 28,
  p08: 32,
  p09: 36,
  p10: 40,
  p11: 44,
  p12: 48,
  p13: 52,
  p14: 56,
  p15: 60,
  p16: 64,
  p17: 68,
  p18: 72,
  p19: 76,
  p20: 80,
  p21: 84,
  p22: 88,
  p23: 92,
  p24: 96,
  p25: 100,
  p26: 104,
  p27: 108,
  p28: 112,
  p29: 116,
  p30: 120,
};

export type FontType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline';
export type FontEmphasis = 'high' | 'medium' | 'low' | 'none';
type FontWeight = '100' | '300' | '600';
type FontSize = {
  fontSize: number;
  fontWeight: FontWeight;
  letterSpacing: number;
};
type FontSizes = {[key in FontType]: FontSize};
type FontEmphases = {[key in FontEmphasis]: number};

const fontWeight: {[key: string]: FontWeight} = {
  light: '100',
  medium: '600',
  regular: '300',
};
const scaling = 1.5;
const fontEmphases: FontEmphases = {
  high: 0.87,
  medium: 0.6,
  low: 0.38,
  none: 1.0,
};
const fontSizes: FontSizes = {
  body1: {
    fontSize: 16,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.5,
  },
  body2: {
    fontSize: 14,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.75,
  },
  caption: {
    fontSize: 12,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.4,
  },
  h1: {
    fontSize: 96 / scaling,
    fontWeight: fontWeight.light,
    letterSpacing: -1.5,
  },
  h2: {
    fontSize: 60 / scaling,
    fontWeight: fontWeight.light,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 48 / scaling,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 34 / scaling,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.25,
  },
  h5: {
    fontSize: 24 / scaling,
    fontWeight: fontWeight.regular,
    letterSpacing: 0,
  },
  h6: {
    fontSize: 20 / scaling,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.15,
  },
  overline: {
    fontSize: 10,
    fontWeight: fontWeight.regular,
    letterSpacing: 1.5,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.1,
  },
};

const sizing = {
  borderRadius: padding.p02,
};

export const Theme = {
  fontSizes,
  fontEmphases,
  fontWeight,
  padding,
  sizing,
};

export const colorWithOpacity = (colorCode: string, opacity = 0.5): string => {
  const boundedOpacity = opacity < 0 ? 0 : opacity > 1 ? 1 : opacity;
  const leading = 4;
  if (!colorCode.startsWith('hsl')) return colorCode;

  const substr = colorCode.substring(leading, colorCode.length - 1);
  return `hsla(${substr}, ${boundedOpacity})`;
};

type GetFontStylesProps = {
  emphasis?: FontEmphasis;
  color?: keyof Color;
  type?: FontType;
  inverse?: boolean;
  colorScheme: Color;
};

type GetFontStylesReturn = {
  textColor: string;
  fontSize: {fontSize: number};
};

export const getFontStyles = ({
  emphasis = 'none',
  type = 'body2',
  inverse = false,
  color = 'text',
  colorScheme,
}: GetFontStylesProps): GetFontStylesReturn => {
  const textColorPercent = Theme.fontEmphases[emphasis];
  const fontSize = Theme.fontSizes[type];
  const textColor = inverse
    ? colorScheme.background
    : color
    ? colorScheme[color]
    : colorScheme.text;
  const textColorWithOpacity = colorWithOpacity(textColor, textColorPercent);
  return {textColor: textColorWithOpacity, fontSize};
};
