// Removed storage of whether a view has been initialized or not.
// Each view nows attachEvents. Each view should be attached to a specific container.
// For multiple dom elements, create multiple views.
///*************************
// INFRASTRUCTURE
//*************************

function extend(subClass, superClass) {
    var F = function() {}
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
}

var View = (function() {
    var alreadyAttachedEventsDict = {};

    return function(delegate, prefix, id) {
        this._prefix = prefix;  // Prefix added to the ID to create unique IDs
        this._id = id || "";
        this._delegate = delegate || null; // jQuery object of a DOM element
        this._UIElement = null;     // the container

        this.attachEvents();
        
    }
})();
View.prototype = {
    getId: function() {return this._id}
    ,getPrefix: function() {return this._prefix}
    ,getUniqueId: function() {return this.getPrefix() + "_" + this.getId()}
    ,setDelegate: function(delegate) {this._delegate = delegate}
    ,getDelegate: function() {
        // If no delegate has been set, the delegate is the ui element.
        if (!this._delegate) {
            this._delegate = this.getUIElement();
        }
        return this._delegate;
    }
    ,fireEvent: function(name) {
        var args = [];
        args.push(this);

        // Skipping the first argument - name, which will be sent to trigger naturally
        for (var i=1; i<arguments.length; i++) {args.push(arguments[i])}
        this.getDelegate().trigger(name, args);
    }
    ,getUIElement: function() {return this._UIElement;}
    ,setUIElement: function(elm) {this._UIElement = $(elm);}
    ,bindUIElement: function(elm) {
        this.setUIElement(elm);

        // Setting a reference from the dom element to the object
        this.getUIElement().data('obj',this);
    }
    ,attachEvents: function() {
        // An empty function, to be overrided by the concrete view class
    }
}

function getViewObj(elm) {
    return elm.data('obj');
}

function EventEmitter(id) {
    this._id = id;
    this._elm = $('<div class="event-emitter" id="event-emitter-' + id + '"></div>')
                .appendTo($('body'));
}
EventEmitter.prototype = {
    get: function() {return this._elm}
}
EventEmitter.get = function(id) {
    if ($('#event-emitter-'+id).length == 0) {
        new EventEmitter(id);
    }
    return $('#event-emitter-'+id);
};

function Controller(eventEmitter) {
    this._eventEmitter = eventEmitter || null;
}
Controller.prototype = {
    getEventEmitter: function() {return this._eventEmitter}
    ,setEventEmitter: function(value) {this._eventEmitter = value}
}

var Keyboard = (function() {
    $(document).keydown(function(ev){
        switch (ev.which) {
            case 16:
                Keyboard.shift = true;
            case 18:
                Keyboard.alt = true;
            case 17:
                Keyboard.ctrl = true;
        }
    });
    $(document).keyup(function(ev){
        switch (ev.which) {
            case 16:
                Keyboard.shift = false;
            case 18:
                Keyboard.alt = false;
            case 17:
                Keyboard.ctrl = false;
        }
    })
    return function() {};
})();
Keyboard.shift = false;
Keyboard.alt = false;
Keyboard.ctrl = false;


//**********************
// WINDOW VIEWS
//**********************

// The global window ("view manager")

var Window = function() {}
Window.addView = function(id, view) {
    var theId = id || view.getUniqueId();

    this._views = this._views || {};
    this._views[theId] = view;
}
Window.getView = function(id) {return this._views[id]}


/*********************************
 * VIEW TEMPLATE
 *********************************/
/*

var XXXView = (function(){

    // *** Private helper functions ***

    // *** Class-wide initializations ***
    // NOTE: Do not put any functions that rely on DOM elements. These should be put
    // in attachEvents instead

    // *** Constructor ***
    // NOTE: If only one object is istantiated from this view class, the id can be ommitted
    // NOTE2: If the view is drawable, the bindUIElement should be called in the draw() ethod
    return function(delegate, id) {
        XXXView.superclass.constructor.call(this, delegate, 'XXXView', id);
        this.bindUIElement($('#ui-elemet-id'));
    }
})();
extend(XXXFormView, View);
$.extend(XXXView.prototype, {
    // *** Accessor Methods ***

    // *** UI Layer Methods ***
    //,attachEvents: function() {
        // Todo: Put class wide event bindings here
    //}

    // *** Business Logic Layer Methods ***

    // *** Events ***

    // *** Private Helper methods ***
});

*/

/*********************************
 * CONTROLLER TEMPLATE
 *********************************/
/*

var XXXController = function(eventEmitter){
    // *** Initialization ***
    XXXController.superclass.constructor.call(this, eventEmitter);

    // *** Event Binding ***
}
extend(XXXController, Controller);

*/
