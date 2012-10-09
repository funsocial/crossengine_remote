this.view = this.view || {};
//[full path class body]
TransformTool = Class.extend({

    multiply: function (a, b) {
        var r = [], i, j, k, t;
        for (i = 0; i < a.length; i++) {
            for (j = 0; j < b[0].length; j++) {
                t = 0;
                for (k = 0; k < a[0].length; k++) {
                    t += a[i][k] * b[k][j];
                }
                r[i] = r[i] || [];
                r[i][j] = t;
            }
        }
        return r;
    },
    matrixFromCssString: function (c) {
        c = c.match(/matrix\(([^\)]+)\)/i)[1].split(',');
        c = [
          [+c[0], +c[2], parseFloat(c[4])],
          [+c[1], +c[3], parseFloat(c[5])],
          [0, 0, 1]
        ];
        return c;
    },
    translate: function (m, tx, ty) {
        return [
          [m[0][0], m[0][1], m[0][2] + tx],
          [m[1][0], m[1][1], m[1][2] + ty],
          [0, 0, 1]
        ];
    },
    inverse: function (m) {
        var det = m[0][0] * m[1][1] - m[0][1] * m[1][0];
        return [
          [m[1][1] / det, -m[0][1] / det, (m[0][1] * m[1][2] - m[1][1] * m[0][2]) / det],
          [-m[1][0] / det, m[0][0] / det, (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / det],
          [0, 0, 1]
        ];
    },
    boundingClientRect: function (element, transformationMatrix) {
        var points = [
          this.multiply(transformationMatrix, [[0], [0], [1]]),
          this.multiply(transformationMatrix, [[element.offsetWidth], [0], [1]]),
          this.multiply(transformationMatrix, [[0], [element.offsetHeight], [1]]),
          this.multiply(transformationMatrix, [[element.offsetWidth], [element.offsetHeight], [1]])
        ];
        return {
            left: Math.min(points[0][0][0], points[1][0][0], points[2][0][0], points[3][0][0]),
            top: Math.min(points[0][1][0], points[1][1][0], points[2][1][0], points[3][1][0]),
            right: Math.max(points[0][0][0], points[1][0][0], points[2][0][0], points[3][0][0]),
            bottom: Math.max(points[0][1][0], points[1][1][0], points[2][1][0], points[3][1][0])
        };
    },
    getTransformationMatrix: function (element) {
        var transformationMatrix = this.matrixFromCssString('matrix(1,0,0,1,0,0)'),
            x = element,
            rect = element.getBoundingClientRect(element), c, r;
        while (x && x !== document.documentElement) {
            c = getComputedStyle(x, null);
            c = (c.OTransform || c.WebkitTransform || c.msTransform || c.MozTransform || 'none').replace(/^none$/, 'matrix(1,0,0,1,0,0)');
            c = this.matrixFromCssString(c);
            transformationMatrix = this.multiply(c, transformationMatrix);
            x = x.parentNode;
        }
        r = this.boundingClientRect(element, transformationMatrix, 0, 0);
        return this.translate(transformationMatrix, rect.left - r.left, rect.top - r.top);
    },   
    getBoundingClientRectX: function (element) {
        return element.getBoundingClientRect();
    },

    //取得滑鼠event有(pageX,pageY)事件下webkit 物件local作標
    offsetXY: function (pageX, pageY, element) {
        var result = this.multiply(this.inverse(this.getTransformationMatrix(element)), [[pageX], [pageY], [1]]);
        return { x: result[0][0], y: result[1][0] };
    },

});

TransformTool.instance = null;
TransformTool.getInstance = function () {
    if (TransformTool.instance == null) {
        TransformTool.instance = new TransformTool();
    }
    return TransformTool.instance;
}
view.TransformTool = TransformTool;