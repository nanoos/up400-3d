const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///home/claude/catalog/fa_catalog.html', { waitUntil: 'networkidle' });
  await page.pdf({
    path: '/home/claude/catalog/UHP-400-catalog-FA.pdf',
    printBackground: true,
    width: '210mm',
    height: '297mm',
    margin: { top: '0', bottom: '0', left: '0', right: '0' },
  });
  // also grab PNG screenshots per page for QA
  await page.setViewportSize({ width: 900, height: 1273 });
  await browser.close();
})();
