function asciiFromImage(file, asciiDimensions) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            var img = new Image();

            img.addEventListener("load", () => {
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, img.width, img.height);

                let asciiWidth = asciiDimensions.width;
                let asciiHeight = asciiDimensions.height;

                if (!asciiWidth && !asciiHeight) {
                    throw Error('At least one dimension is required');
                }
                if (!asciiWidth) {
                    asciiWidth = Math.round(5 / 3 * asciiHeight * img.width / img.height);
                }
                if (!asciiHeight) {
                    asciiHeight = Math.round(3 / 5 * asciiWidth * img.height / img.width);
                }

                const asciiArt = genAscii(ctx, img.width, img.height, asciiWidth, asciiHeight)

                console.log(asciiArt)
                resolve(asciiArt);
            })

            img.src = reader.result;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        } else {
            reject(new Error('File failed to load'));
        }
    });
}


function genAscii(ctx, imgWidth, imgHeight, asciiWidth, asciiHeight) {
    let asciiArt = "";

    const stepW = imgWidth / asciiWidth;
    const stepH = imgHeight / asciiHeight;

    for (h = 0; h < asciiHeight; h++) {
        for (w = 0; w < asciiWidth; w++) {
            const sourceW = Math.floor(w * stepW);
            const sourceH = Math.floor(h * stepH);

            let newPixel = new Uint32Array([0, 0, 0, 0]);

            let numPixels = 0
            for (sw = 0; sw < stepW; sw++) {
                for (sh = 0; sh < stepH; sh++) {
                    const pixel = ctx.getImageData(sourceW + sw, sourceH + sh, 1, 1).data

                    for (let i = 0; i < 4; i++) {
                        newPixel[i] += pixel[i]
                    }
                    numPixels++
                }
            }
            for (let i = 0; i < 4; i++) {
                newPixel[i] /= numPixels
            }

            asciiArt += mapColorToAscii(newPixel[0], newPixel[1], newPixel[2]);
        }

        asciiArt += '\n'
    }

    return asciiArt;
}

function mapColorToAscii(r, g, b) {
    const colors = ['W', 'M', '$', '&', '@', '%', '#', '*', 'o', '=', '~', '-', ':', '.', '`', ' '];

    const gray = (r + g + b) / 3;

    const step = 255 / colors.length;

    for (let i = 0; i < colors.length; i++) {
        if (gray < i * step) {
            return colors[i]
        }
    }
    return colors[colors.length - 1]
}


function drawPalette(numberColors, colorWidth, colorHeight) {
    const step = 255 / numberColors;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = (colorWidth + 3) * numberColors;
    canvas.height = colorWidth;

    for (let i = 0; i < numberColors; i++) {
        let colorString = "rgb(";
        colorString += Math.floor(i * step);
        colorString += ",";
        colorString += Math.floor(i * step);
        colorString += ",";
        colorString += Math.floor(i * step);
        colorString += ")";
        ctx.fillStyle = colorString;
        ctx.fillRect(i * (colorWidth + 3), 0, colorWidth, colorHeight);
    }
    document.body.appendChild(canvas)
}