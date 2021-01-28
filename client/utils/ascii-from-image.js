window.addEventListener('load', () => {
    const input = document.getElementById('upload-button')

    input.addEventListener('change', event => {
        AsciiFromImage(event.target.files[0], { width: 150 })
        event.target.value = null;
    })
})

function AsciiFromImage(file, asciiDimensions) {
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

            const ascii_art = genAscii(ctx, img.width, img.height, asciiWidth, asciiHeight)

            console.log(ascii_art)
            return ascii_art
        })

        img.src = reader.result;
    }, false);

    if (file) {
        reader.readAsDataURL(file)
    }
}


function genAscii(ctx, img_width, img_height, asciiWidth, asciiHeight) {
    let ascii_art = "";

    const step_w = img_width / asciiWidth;
    const step_h = img_height / asciiHeight;

    for (h = 0; h < asciiHeight; h++) {
        for (w = 0; w < asciiWidth; w++) {
            const source_w = Math.floor(w * step_w);
            const source_h = Math.floor(h * step_h);

            let new_pixel = new Uint32Array([0, 0, 0, 0]);

            num_pixels = 0
            for (sw = 0; sw < step_w; sw++) {
                for (sh = 0; sh < step_h; sh++) {
                    const pixel = ctx.getImageData(source_w + sw, source_h + sh, 1, 1).data

                    for (let i = 0; i < 4; i++) {
                        new_pixel[i] += pixel[i]
                    }
                    num_pixels++
                }
            }
            for (let i = 0; i < 4; i++) {
                new_pixel[i] /= num_pixels
            }

            ascii_art += mapColorToAscii(new_pixel[0], new_pixel[1], new_pixel[2]);
        }

        ascii_art += '\n'
    }

    return ascii_art;
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


function drawPalette(number_colors, color_width, color_height) {
    const step = 255 / number_colors;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = (color_width + 3) * number_colors;
    canvas.height = color_width;

    for (let i = 0; i < number_colors; i++) {
        let color_string = "rgb(";
        color_string += Math.floor(i * step);
        color_string += ",";
        color_string += Math.floor(i * step);
        color_string += ",";
        color_string += Math.floor(i * step);
        color_string += ")";
        ctx.fillStyle = color_string;
        ctx.fillRect(i * (color_width + 3), 0, color_width, color_height);
    }
    document.body.appendChild(canvas)
}