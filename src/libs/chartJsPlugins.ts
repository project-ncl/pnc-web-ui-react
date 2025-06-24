/**
 * Chart.js plugin for adding text in center of Dougnut Chart.
 *
 * author: scorgn
 * source: https://stackoverflow.com/a/43026361
 * slightly modified
 *
 * Centered text can be set in ChartConfiguration.
 * @example
 * {
 *   options: {
 *     elements: {
 *       center: {
 *         text: 20,
 *         fontStyle: 'Roboto'
 *         color: '#000'
 *       },
 *     },
 *   }
 * }
 */
export const dougnutCenterPlugin = {
  id: 'dougnutCenterPlugin',
  beforeDraw: function (chart: any) {
    if (chart.config?.options?.elements?.center) {
      // Get ctx from string
      const ctx = chart.ctx;

      // Get options from the center object in options
      const centerConfig = chart.config.options.elements.center;
      const fontStyle = centerConfig.fontStyle || 'Arial';
      const txt = centerConfig.text;
      const color = centerConfig.color || '#000';
      const maxFontSize = centerConfig.maxFontSize || 75;
      const sidePadding = centerConfig.sidePadding || 20;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2);
      // Start with a base font of 30px
      ctx.font = '40px ' + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(30 * widthRatio);
      const elementHeight = chart.innerRadius * 2;

      // Pick a new font size so it will not be larger than the height of label.
      let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      let minFontSize = centerConfig.minFontSize;
      const lineHeight = centerConfig.lineHeight || 25;
      let wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      let centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
      ctx.font = fontSizeToUse + 'px ' + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      const words = txt.split(' ');
      let line = '';
      const lines = [];

      // Break words up into multiple lines if necessary
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (let n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  },
};

/**
 * Chart.js plugin for setting legend height.
 *
 * author: Glogo
 * source: https://stackoverflow.com/a/67723827
 * slightly modified
 *
 * Legend height can be set in ChartConfiguration.
 * @example
 * {
 *   options: {
 *     elements: {
 *       legend: {
 *         height: 100,
 *       },
 *     },
 *   }
 * }
 */
export const legendHeightPlugin = {
  id: 'legendHeightPlugin',
  beforeInit: (chart: any) => {
    const pluginLegend = chart.config.options.plugins?.legend;
    const elemLegend = chart.config.options.elements?.legend;
    const forcedHeight = pluginLegend?.maxHeight ?? elemLegend?.height;
    if (forcedHeight) {
      // Get reference to the original fit function
      const originalFit = chart.legend.fit;

      // Override the fit function
      chart.legend.fit = function fit() {
        // Call original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        // Change the height as suggested in another answers
        this.height = Math.min(this.height, forcedHeight);
      };
    }
  },
};
