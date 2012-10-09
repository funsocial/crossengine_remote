//####################################################################################
//for Quick access and tools for Box2dS
//####################################################################################
(function (ns) {
    /**
    * FOR AssetLoading and Managements
    */
    var GameWorld = function () {
    }

    //-------------------------------------------------------------------
    //PROPERTIES
    //-------------------------------------------------------------------
    var p = GameWorld.prototype;
    
    p.world = null;
    p.debugDrawer = null;

    p.initialize = function (gravity, drawDebug, drawDebugCanvas) {
        this.world = new b2World(gravity, true);
        if (drawDebug == true) {
            var debugDrawer = new b2DebugDraw();
            debugDrawer.SetSprite(drawDebugCanvas.getContext("2d"));
            debugDrawer.SetDrawScale(30.0);
            debugDrawer.SetFillAlpha(0.5);
            debugDrawer.SetLineThickness(1.0);
            debugDrawer.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
            this.debugDrawer = debugDrawer;
            this.world.SetDebugDraw(this.debugDrawer);
        }
    }

    p.update = function () {
        if (this.world) {
            this.world.Step(1 / 15, 5, 5);
        }
        if (this.debugDrawer) {
            this.world.DrawDebugData();
        }
    }

    p.makeRectBorder = function (thickness, width, height, offx, offy) {

        //create border & ground
        //fixture binds a shape to a body and adds material properties such as density, friction..
        var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0; // how much it bounce back

        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        
        if (offx == undefined) offx = 0;
        if (offy == undefined) offy = 0;
        //top
        var toRect = BoxUtil.topLeftToCeterRect(offx, offy - thickness, width, thickness);
        fixDef.shape.SetAsBox(toRect.w, toRect.h);
        bodyDef.position.Set(toRect.x, toRect.y);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        //bottom
        //toRect = BoxUtil.topLeftToCeterRect(offx, offy + height, width, thickness);
        //fixDef.shape.SetAsBox(toRect.w, toRect.h);
        //bodyDef.position.Set(toRect.x, toRect.y);
        //this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        //left
        toRect = BoxUtil.topLeftToCeterRect(offx-thickness, offy - thickness, thickness, height + (thickness*2) );
        fixDef.shape.SetAsBox(toRect.w, toRect.h);
        bodyDef.position.Set(toRect.x, toRect.y);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        //right
        toRect = BoxUtil.topLeftToCeterRect(offx + width, offy - thickness, thickness, height + (thickness * 2));
        fixDef.shape.SetAsBox(toRect.w, toRect.h);
        bodyDef.position.Set(toRect.x, toRect.y);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

    }

    ns.GameWorld = GameWorld;
}(gamejs || (gamejs = {})));
var gamejs;