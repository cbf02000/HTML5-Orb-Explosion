function hue2rgb(hue) {

    if (hue == null || hue < 0 || hue > 360) {
        return null;
    }

    var h = hue;
    var s = 1.0;
    var v = 1.0;
    var rgb;
    var i;
    var data = [];
    if (s === 0) {
        rgb = [v,v,v];
    } else {
        h = h / 60;
        i = Math.floor(h);
        data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
        switch(i) {
            case 0:
                rgb = [v, data[2], data[0]];
                break;
            case 1:
                rgb = [data[1], v, data[0]];
                break;
            case 2:
                rgb = [data[0], v, data[2]];
                break;
            case 3:
                rgb = [data[0], data[1], v];
                break;
            case 4:
                rgb = [data[2], data[0], v];
                break;
            default:
                rgb = [v, data[0], data[1]];
                break;
        }
    }
    return {r:Math.round(rgb[0]*255), g:Math.round(rgb[1]*255), b:Math.round(rgb[2]*255)};
};