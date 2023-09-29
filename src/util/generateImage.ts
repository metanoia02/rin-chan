const fs = require('fs');
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

export async function generateImage(
  templateFile: string,
  content: any,
  height: number,
): Promise<Buffer> {
  //compile template
  const htmlFile = fs.readFileSync(templateFile, 'utf8');
  const template = Handlebars.compile(htmlFile);
  const result = template(content);

  //make screenshot
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 400,
    height: height,
  });
  await page.setContent(result);
  const image = await page.screenshot();

  await browser.close();

  return image;
}
