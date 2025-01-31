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
    const canvas = createCanvas()
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
    return {
        H: h,
        S: s,
        L: l,
        R: r,
        G: g,
        B: b,
        hex: rgb2hex(rgb)
    };
}

function rgb2hex(rgb) {
    return "#" + rgb.map(function (value) {
        return ("0" + value.toString(16)).slice(-2);
    }).join("");
}

exports.imageLightness = (req, res) => {

    let isbns = req.query['isbns']
    if (!isbns) return res.status(200).send('isbnsを指定してください。')
    isbns = isbns.split(',')

    let hsls = {}
    isbns.map(async (isbn) => {
        // 書影の平均色を出す
        const rgb = await AverageColorByImage('https://calil.jp/cover/' + isbn)
        hsls[isbn] = rgbToHsl(rgb)
        if (isbns.length === Object.keys(hsls).length) {
            res.type('application/json');
            res.set('Access-Control-Allow-Origin', '*');
            res.set('Access-Control-Allow-Methods', 'GET');
            res.set('Access-Control-Allow-Headers', 'Content-Type');
            res.set('Access-Control-Max-Age', '3600');
            res.set('cache-control', 'public, max-age=3600');
            res.status(200).send(hsls);
        }
    })

}