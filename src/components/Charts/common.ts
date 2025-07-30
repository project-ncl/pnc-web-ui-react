export const getColorValue = (style: CSSStyleDeclaration, color: string) =>
  color.startsWith('--') ? style.getPropertyValue(color) : color;
