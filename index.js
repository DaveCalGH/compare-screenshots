

const puppeteer = require('puppeteer');





(async () => {
  const browser = await puppeteer.launch({
        headless: true,
        timeout: 1000
    });
  const page = await browser.newPage();
  await page.goto('http://morganlewis.com');
  await page.screenshot({path: 'screenshots/example_full.png',
    fullPage:true
    });
  await page.screenshot({path: 'screenshots/example_1024x800.png',
	clip: {x: 0, y:0, width: 1024, height: 800}
    });

  await browser.close();


  const numDiffs = await compareImages("example", "screenshots/example_full.png","screenshots/example_orig.png");
  console.log("Found " + numDiffs.toString() + " different pixels");

})();

async function compareImages(prefix, imgA, imgB) {
    //WARNING  - this will fail if image sizes are different 
    // (e.g. fullpage screenshot has differernt pixel dimensions on final image)
    const fs = require('fs');
    const PNG = require('pngjs').PNG;
    const pixelmatch = require('pixelmatch');
    
    const img1 = PNG.sync.read(fs.readFileSync(imgA));
    const img2 = PNG.sync.read(fs.readFileSync(imgB));
    const {width, height} = img1;
    const diff = new PNG({width, height});
    
    const numDiffs = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, {threshold: 0.1});
    
    fs.writeFileSync('screenshots/' + prefix + '_diff.png', PNG.sync.write(diff));

    return numDiffs;
}