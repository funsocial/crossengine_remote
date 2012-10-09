function SourceInclude() { };

SourceInclude.baseURL = "../";

SourceInclude.includeBase = function () {
    document.write("<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/Class.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/Render.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/Util.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/core/Dispatcher.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/core/Loader.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/core/TouchArea.js'></script>");
}

SourceInclude.includeView = function () {
    //!!!! import 順序由parent至child
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/view/TransformTool.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/view/Display.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/view/MovieClip.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/view/Stage.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/view/Component.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/view/AlignSetting.js'></script>");
}

SourceInclude.includeUI = function () {
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/ui/Button.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/ui/Scroll.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/ui/LoadingCover.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/ui/TopFill.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/ui/ScrollArea.js'></script>");
}
SourceInclude.includeTween = function () {
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/greensock/TweenMax.min.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/greensock/easing/EasePack.min.js'></script>");
}
SourceInclude.includeGameCss = function () {
    document.write("<LINK href='" + SourceInclude.baseURL + "corecss/normalize.css' type='text/css' rel='stylesheet'/> ");
    document.write("<LINK href='" + SourceInclude.baseURL + "corecss/coreGame.css' type='text/css' rel='stylesheet'/> ");
}
SourceInclude.includeMediaCss = function () {
    document.write("<LINK href='" + SourceInclude.baseURL + "corecss/normalize.css' type='text/css' rel='stylesheet'/> ");
    document.write("<LINK href='" + SourceInclude.baseURL + "corecss/coreMedia.css' type='text/css' rel='stylesheet'/> ");
}

SourceInclude.includeBox2d = function () {
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/box2d/Box2d.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/box2d/BoxUtil.js'></script>");
    document.write("<script type='text/javascript' src='" + SourceInclude.baseURL + "corejs/box2d/BoxGame.js'></script>");
}

SourceInclude.includeBox2dClass = function () {
    window.b2Vec2 = Box2D.Common.Math.b2Vec2;
    window.b2AABB = Box2D.Collision.b2AABB;
    window.b2BodyDef = Box2D.Dynamics.b2BodyDef;
    window.b2Body = Box2D.Dynamics.b2Body;
    window.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    window.b2Fixture = Box2D.Dynamics.b2Fixture;
    window.b2World = Box2D.Dynamics.b2World;
    window.b2MassData = Box2D.Collision.Shapes.b2MassData;
    window.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    window.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    window.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    window.b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef;
    window.b2ContactListener = Box2D.Dynamics.b2ContactListener;
}
