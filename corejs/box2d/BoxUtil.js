function BoxUtil(){};
BoxUtil.ONED = Math.PI / 180;
BoxUtil.screenDG = function (value) {
    return value / BoxUtil.ONED;
}
BoxUtil.radianDG = function (value) {
    return BoxUtil.ONED * value;
}
BoxUtil.Pt = function (value) {
    return value / 30;
}
BoxUtil.b2Pt = function (x, y) {
    return new b2Vec2(x / 30, y / 30);
}
BoxUtil.screenPt = function (b2vec2) {
    return {"x": b2vec2.x * 30, "y": b2vec2.y * 30};
}

/**
使用左上對應設定座標及大小取得box2d建立box於正中心的對應座標
*/
BoxUtil.topLeftToCeterRect = function (tox, toy, width, height) {
    tox = BoxUtil.Pt(tox);
    toy = BoxUtil.Pt(toy);
    width = BoxUtil.Pt(width);
    height = BoxUtil.Pt(height);
    return {
        "x": (width * .5) + tox,
        "y": (height * .5) + toy,
        "w": width * .5,
        "h": height * .5
    }
}

BoxUtil.angleBetween = function (bodyA, bodyB) {
    //return Math.atan2(body2.GetPosition().y-body1.GetPosition().y , body2.GetPosition().x-body1.GetPosition().x );
}
BoxUtil.anglePower = function (ang, basePower) {
    var xp = Math.cos(ang) * basePower;
    var yp = Math.sin(ang) * basePower;
    return new b2Vec2(xp, yp);
}



//ITEM CREATION SHORT FUNCTIONS
BoxUtil.gameWorld = null;
BoxUtil.makeBox = function (x, y, width, height, isStatic, density, friction, restitution) {

    if (BoxUtil.gameWorld == null) return;
    //fixture binds a shape to a body and adds material properties
    var fixDef = new b2FixtureDef;
    fixDef.density = (density == null) ? 1.0 : density;
    fixDef.friction = (friction == null) ? .5 : friction;
    fixDef.restitution = (restitution == null) ? 0 : restitution;
    var bodyDef = new b2BodyDef;
    if (isStatic) {
        bodyDef.type = b2Body.b2_staticBody;
    } else {
        bodyDef.type = b2Body.b2_dynamicBody;
    }
    //create box shape
    fixDef.shape = new b2PolygonShape;
    var rect = BoxUtil.topLeftToCeterRect(x, y, width, height);
    fixDef.shape.SetAsBox(rect.w, rect.h);
    bodyDef.position.Set(rect.x, rect.y);
    var madeBody = BoxUtil.gameWorld.world.CreateBody(bodyDef);
    madeBody.CreateFixture(fixDef);
    return madeBody;
}

BoxUtil.makePtBox = function (x, y, width, height, rotate, isStatic, density, friction, restitution) {
    if (BoxUtil.gameWorld == null) return;
    x = BoxUtil.Pt(x);
    y = BoxUtil.Pt(y);
    width = BoxUtil.Pt(width * .5);
    height = BoxUtil.Pt(height * .5);
    if (rotate != undefined) {
        rotate = BoxUtil.radianDG(rotate);
    } else {
        rotate = 0;
    }
    //fixture binds a shape to a body and adds material properties
    var fixDef = new b2FixtureDef;
    fixDef.density = (density == null) ? 1.0 : density;
    fixDef.friction = (friction == null) ? .5 : friction;
    fixDef.restitution = (restitution == null) ? 0 : restitution;
    var bodyDef = new b2BodyDef;
    if (isStatic) {
        bodyDef.type = b2Body.b2_staticBody;
    } else {
        bodyDef.type = b2Body.b2_dynamicBody;
    }
    //create box shape
    fixDef.shape = new b2PolygonShape;
    fixDef.shape.SetAsBox(width, height);
    bodyDef.position.Set(x, y);
    var madeBody = BoxUtil.gameWorld.world.CreateBody(bodyDef);
    madeBody.CreateFixture(fixDef);
    madeBody.SetAngle(rotate);
    return madeBody;
}

BoxUtil.makePtCircle = function (x, y, radius, isStatic, density, friction, restitution) {
    x = BoxUtil.Pt(x);
    y = BoxUtil.Pt(y);
    radius = BoxUtil.Pt(radius);
    if (BoxUtil.gameWorld == null) return;
    //fixture binds a shape to a body and adds material properties
    var fixDef = new b2FixtureDef;
    fixDef.density = (density == null) ? 1.0 : density;
    fixDef.friction = (friction == null) ? .5 : friction;
    fixDef.restitution = (restitution == null) ? 0 : restitution;
    var bodyDef = new b2BodyDef;
    if (isStatic) {
        bodyDef.type = b2Body.b2_staticBody;
    } else {
        bodyDef.type = b2Body.b2_dynamicBody;
    }
    //create circle shape
    fixDef.shape = new b2CircleShape;
    fixDef.shape.SetRadius(radius);
    bodyDef.position.Set(x, y);
    var madeBody = BoxUtil.gameWorld.world.CreateBody(bodyDef);
    madeBody.CreateFixture(fixDef);
    return madeBody;
}