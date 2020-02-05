/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */

'use strict';

const {
    createCanvas,
    Image
} = require('canvas')

function AverageColorByImage(src) {
    const img = new Image();
    img.src = src;
    const canvas = createCanvas(200, 200)
    const ctx = canvas.getContext('2d');
    return new Promise((resolve, reject) => {
        img.onload = () => {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, img.width, img.height)
            let rgba = [0, 0, 0, 0]

            imageData.data.forEach((v, i) => {
                rgba[i % 4] = rgba[i % 4] + v
            })
            const r = rgba[0] / (img.width * img.height)
            const g = rgba[1] / (img.width * img.height)
            const b = rgba[2] / (img.width * img.height)
            resolve([r, g, b])
        };
        img.onerror = (e) => reject(e)
    });
}

function rgbToHsl(rgb) {
    const r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}


exports.imageLightness = (req, res) => {

    const isbns = req.get('isbns').split(',')

    let hsls = []
    isbns.map(async (isbn, i) => {
        // 書影の平均色を出す
        const rgb = await AverageColorByImage('https://calil.jp/cover/' + isbn)
        hsls.push(rgbToHsl(rgb))
        if (isbns.length === hsls.length) {
            res.type('application/json');
            res.set('Access-Control-Allow-Methods', 'GET');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            res.set('Access-Control-Max-Age', '3600');
            res.status(200).send(hsls);
        }
    })

}