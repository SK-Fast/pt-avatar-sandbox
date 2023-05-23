function loadImage(url) {
    return new Promise((resolve) => {
        const imageObj = new Image();

        imageObj.onload = function () {
            resolve(imageObj);
        };

        imageObj.src = url
    })
}

function resizeImage(url, width, height, x, y) {
    return new Promise(async (resolve) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext('2d');
        const imageObj = await loadImage(url)

        // set canvas dimensions

        canvas.width = width;
        canvas.height = height;

        context.drawImage(imageObj, x, y, width, height, 0, 0, width, height);

        const imgPreview = new Image()
        imgPreview.src = canvas.toDataURL()

        resolve(imgPreview);

        canvas.remove()

    })
}

export async function convert(url) {
    const armTop = await resizeImage(url, 100, 100, 317, 250)
    const armInnerSide = await resizeImage(url, 100, 200, 20, 349)
    const armBack = await resizeImage(url, 100, 200, 119, 349)
    const armSide = await resizeImage(url, 100, 200, 218, 349)
    const armFront = await resizeImage(url, 100, 200, 317, 349)
    const armBottom = await resizeImage(url, 100, 100, 218, 548)

    const torsoTop = await resizeImage(url, 200, 100, 416, 250)
    const torsoFront = await resizeImage(url, 200, 200, 416, 349)
    const torsoSideL = await resizeImage(url, 100, 200, 615, 349)
    const torsoBack = await resizeImage(url, 200, 200, 714, 349)
    const torsoSideR = await resizeImage(url, 100, 200, 913, 349)
    const torsoBottom = await resizeImage(url, 200, 100, 714, 250)

    const legTop = await resizeImage(url, 100, 100, 317, 548)
    const legL = await resizeImage(url, 100, 200, 416, 548)
    const legR = await resizeImage(url, 100, 200, 516, 548)
    const legSideR = await resizeImage(url, 100, 200, 615, 548)
    const legBackR = await resizeImage(url, 100, 200, 714, 548)
    const legBackL = await resizeImage(url, 100, 200, 814, 548)
    const legSideL = await resizeImage(url, 100, 200, 913, 548)
    const legBottom = await resizeImage(url, 100, 100, 416, 747)


    const shirtCanvas = document.createElement("canvas");
    const context = shirtCanvas.getContext('2d');

    shirtCanvas.width = 1024;
    shirtCanvas.height = 1024;

    context.drawImage(torsoTop, 197, 73, 204, 104);
    context.drawImage(torsoFront, 197, 183, 204, 204);
    context.drawImage(torsoSideL, 407, 183, 104, 204);
    context.drawImage(torsoSideR, 87, 183, 104, 204);
    context.drawImage(torsoBack, 517, 183, 204, 204);
    context.drawImage(torsoBottom, 197, 393, 204, 104);

    context.drawImage(armFront, 380, 666, 104, 204);
    context.drawImage(armFront, 536, 666, 104, 204);
    context.drawImage(armSide, 647, 666, 104, 204);
    context.drawImage(armSide, 270, 666, 104, 204);
    context.drawImage(armBack, 160, 666, 104, 204);
    context.drawImage(armBack, 757, 666, 104, 204);
    context.drawImage(armInnerSide, 868, 666, 104, 204);
    context.drawImage(armInnerSide, 50, 666, 104, 204);

    context.drawImage(armTop, 380, 556, 104, 104);
    context.drawImage(armTop, 536, 556, 104, 104);

    context.drawImage(armBottom, 380, 876, 104, 104);
    context.drawImage(armBottom, 536, 876, 104, 104);

    const pantCanvas = document.createElement("canvas");
    const contextPant = pantCanvas.getContext('2d');

    pantCanvas.width = 1024;
    pantCanvas.height = 1024;

    contextPant.drawImage(legR, 380, 666, 104, 204);
    contextPant.drawImage(legL, 536, 666, 104, 204);
    contextPant.drawImage(legSideL, 647, 666, 104, 204);
    contextPant.drawImage(legSideR, 270, 666, 104, 204);
    contextPant.drawImage(legBackR, 160, 666, 104, 204);
    contextPant.drawImage(legBackL, 757, 666, 104, 204);
    contextPant.drawImage(legSideL, 868, 666, 104, 204);
    contextPant.drawImage(legSideR, 50, 666, 104, 204);

    contextPant.drawImage(legTop, 380, 556, 104, 104);
    contextPant.drawImage(legTop, 536, 556, 104, 104);

    contextPant.drawImage(legBottom, 380, 876, 104, 104);
    contextPant.drawImage(legBottom, 536, 876, 104, 104);

    return [shirtCanvas.toDataURL(), pantCanvas.toDataURL()]
}