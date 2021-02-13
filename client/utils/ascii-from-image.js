export function asciiFromImage(file, asciiDimensions) {
    return new Promise((resolve, reject) => {
        let asciiWidth = asciiDimensions.width;
        let asciiHeight = asciiDimensions.height;

        const errors = validateDimensions(asciiWidth, asciiHeight);
        if (errors) {
            return reject(errors);
        }

        const reader = new FileReader();

        reader.addEventListener("load", () => {
            let img = new Image();

            img.addEventListener("load", () => {
                let canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                let ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, img.width, img.height);

                if (!asciiWidth) {
                    asciiWidth = Math.round(5 / 3 * asciiHeight * img.width / img.height);
                }
                if (!asciiHeight) {
                    asciiHeight = Math.round(3 / 5 * asciiWidth * img.height / img.width);
                }

                resolve(genAscii(ctx, img.width, img.height, asciiWidth, asciiHeight));
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

function validateDimensions(asciiWidth, asciiHeight){
    if (!asciiWidth && !asciiHeight) {
        return new Error('At least one dimension is required');
    }

    let validator = new Validator();

    if(asciiWidth) {
        validator.validatePositive(asciiWidth, "Width");
        validator.validateInteger(asciiWidth, "Width");
    }

    if(asciiHeight){
        validator.validatePositive(asciiHeight, "Height");
        validator.validateInteger(asciiHeight, "Height");
    }

    return validator.getErrors();
}

function genAscii(ctx, imgWidth, imgHeight, asciiWidth, asciiHeight) {
    let asciiArt = "";

    const stepW = imgWidth / asciiWidth;
    const stepH = imgHeight / asciiHeight;

    for (let h = 0; h < asciiHeight; h++) {
        for (let w = 0; w < asciiWidth; w++) {
            const sourceW = Math.floor(w * stepW);
            const sourceH = Math.floor(h * stepH);

            let newPixel = new Uint32Array([0, 0, 0, 0]);

            let numPixels = 0;
            for (let sW = 0; sW < stepW; sW++) {
                for (let sH = 0; sH < stepH; sH++) {
                    const pixel = ctx.getImageData(sourceW + sW, sourceH + sH, 1, 1).data;

                    for (let i = 0; i < 4; i++) {
                        newPixel[i] += pixel[i];
                    }
                    numPixels++;
                }
            }
            for (let i = 0; i < 4; i++) {
                newPixel[i] /= numPixels;
            }
            asciiArt += mapColorToAscii(newPixel[0], newPixel[1], newPixel[2]);
        }
        asciiArt += '\n';
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

export function drawPalette(numberColors, colorWidth = 50, colorHeight = 50) {
    const step = 255 / numberColors;
    const betweenColors = 5;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = (colorWidth + betweenColors) * numberColors;
    canvas.height = colorWidth;

    for (let i = 0; i < numberColors; i++) {
        const color = Math.floor(i * step);
        ctx.fillStyle = `rgb(${color},${color},${color})`;
        ctx.fillRect(i * (colorWidth + betweenColors), 0, colorWidth, colorHeight);
    }
    document.body.appendChild(canvas)
}