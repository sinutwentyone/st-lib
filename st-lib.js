(function() {    /*- stLib -*/
    var stLib = window.stLib;

    if ( !stLib && typeof stLib !== 'object' || stLib === null ) {
        stLib = {};
    }

    if ( !stLib.isElement ) {
        stLib.isElement = function( element ) {
            return element instanceof Element;
        };
    }

    if ( !stLib.isNotEmptyString ) {
        stLib.isNotEmptyString = function( str ) {
            return Boolean(str) && typeof str === "string";
        };
    }

    if ( !stLib.isObject ) {
        stLib.isObject = function( obj ) {
            return typeof obj === 'object' && obj !== null;
        };
    }

    if ( !stLib.createData ) {
        stLib.createData = function( data ) {
            return stLib.isObject( data ) ? data : {};
        };
    }

    if ( !stLib.mergeObject ) {
        stLib.mergeObject = function() {
            var objects = Array.prototype.slice.call( arguments ),
                resultObject = {};
            
            objects.forEach( function( obj ) {
                var propName, propValue;

                if ( !stLib.isObject(obj) ) {
                    return;
                }

                for ( propName in obj ) {
                    if ( obj.hasOwnProperty(propName) ) {
                        resultObject[ propName ] = obj[ propName ];
                    }
                }
            });

            return resultObject;
        };
    }

    window.stLib = stLib;
})();

/*- stIdentityObject -*/
(function() {
    if ( typeof window.stIdentityObject !== 'function' ) {
        window.stIdentityObject = function( data, containerObj ) {
            var obj = containerObj || {};

            obj._init = function() {
                obj._iOIdentities = [];
                
                return obj;
            };

            obj.iORegister = function( id ) {
                obj._iOIdentities.push( id );
            };

            obj.iOContain = function( id ) {
                return obj._iOIdentities.indexOf( id ) !== -1;
            };

            return obj._init();
        };

        window.stLib.iOContain = function( obj, id ) {
            var iOContain;

            if ( stLib.isObject( obj ) && obj.hasOwnProperty('iOContain') ) {
                iOContain = obj.iOContain;

                if ( typeof iOContain === 'function' ) {
                    return iOContain( id );
                }
            }
        }  
    }
})();

/*- stBasicData -*/
(function() {
    var stIdentityObject = window.stIdentityObject,
        stLib = window.stLib;

    if ( typeof window.stBasicData !== 'function' ) {
        window.stBasicData = function( data, containerObj ) {
            var obj = stIdentityObject( null, containerObj );
        
            obj.iORegister('stBasicData'); 
            obj.data = stLib.createData( data );

            return obj;
        };
    }
})();

(function() {
    var stLib = window.stLib;

    if ( stLib.getChildrenElement !== 'function' ) {
        stLib.getChildrenElement = function( element, selector ) {
            var elements = [],
                elementsChildren;

            if ( element instanceof Element ) {
                elementsChildren = element.querySelectorAll( selector );
                elementsChildren.forEach( function( childElement ) {
                    if ( childElement.parentElement === element ) {
                        elements.push( childElement );
                    }
                });
            }

            return elements;
        };
    }
})();

/* stBasicElement */   
(function() {     
    var stIdentityObject = window.stIdentityObject,
        stLib = window.stLib;

    if ( typeof window.stBasicElement !== 'function' ) {
        window.stBasicElement = function( data, containerObj ) {
            var obj = stIdentityObject( null, containerObj ),
                options = stLib.createData( data );

            obj.iORegister('stBasicElement');
            obj._init = function() {
                obj._addElement( options.element );

                return obj;
            };

            obj._addElement = function( element ) {
                if ( stLib.isElement( element ) ) {
                    obj._element = element;
                }
            };

            obj.haveElement = function() {
                return stLib.isElement( obj._element );
            };

            obj.getElement = function() {
                return obj._element;
            };

            obj.classes = function( classes, mutationType ) {
                var element;

                if ( obj.haveElement() && Array.isArray( classes ) ) {
                    element = obj.getElement();
                    
                    classes.forEach( function( className ) {
                        if ( mutationType === 'remove' ) {
                            element.classList.remove( className );
                        } else {
                            element.classList.add( className );
                        }
                    });
                }
            };

            obj.addClass = function( classes ) {  
                obj.classes( classes );
            };

            obj.removeClass = function( classes ) {
                obj.classes( classes, 'remove' );
            }

            return obj._init();
        }
    }
})();

(function() {
    var stBasicData = window.stBasicData;
    
    if ( typeof window.stElementVisibilityOptions !== 'function' ) {
        window.stElementVisibilityOptions = function( data ) {
            var obj = stBasicData( data );

            obj._init = function() {
                obj._classesToRemoveOnShow = [];
                obj._classesToAddOnShow = [];
                obj._classesToRemoveOnHide = [];
                obj._classesToAddOnHide = [];

                obj._setClassesToRemoveOnShowFromData();
                obj._setClassesToAddOnShowFromData();
                obj._setClassesToRemoveOnHideFromData();
                obj._setClassesToAddOnHideFromData();

                return obj;
            };

            obj._toArray = function( str ) {
                return Array.isArray( str ) ? str : [ str ];
            };

            obj._setClassesToRemoveOnShowFromData = function() {
                var classes = obj.data.classesToRemoveOnShow;

                if ( classes ) {
                    obj._classesToRemoveOnShow = obj._toArray( classes );
                }
            };

            obj._setClassesToAddOnShowFromData = function() {
                var classes = obj.data.classesToAddOnShow;
             
                if ( classes ) {                  
                    obj._classesToAddOnShow = obj._toArray( classes );  
                }
            };

            obj._setClassesToRemoveOnHideFromData = function() {
                var classes = obj.data.classesToRemoveOnHide;

                if ( classes ) {
                    obj._classesToRemoveOnHide = obj._toArray( classes );
                }
            };            

            obj._setClassesToAddOnHideFromData = function() {
                var classes = obj.data.classesToAddOnHide;

                if ( classes ) {
                    obj._classesToAddOnHide = obj._toArray( classes );
                }
            };

            obj.getClassesToRemoveOnShow = function() {
                return obj._classesToRemoveOnShow;
            };

            obj.getClassesToAddOnShow = function() {
                console.log( obj._classesToAddOnShow);
                return obj._classesToAddOnShow;
            };

            return obj._init();
        };
    }
})();


(function() {
    var stBasicElement = window.stBasicElement,
        stElementVisibilityOptions = window.stElementVisibilityOptions;

    if ( typeof window.stElementVisibility !== 'function' ) {
        window.stElementVisibility = function( data, containerObj ) {
            var obj = stBasicElement( data, containerObj );
                options = stElementVisibilityOptions( data );

            obj._init = function() {
                return obj;
            };

            obj.show = function() {
                obj._removeClassesOnShow();
                obj._addClassesOnShow();
            };

            obj._removeClassesOnShow = function() {
                obj.removeClass( options.getClassesToRemoveOnShow() );
            };

            obj._addClassesOnShow = function() {         
                obj.addClass( options.getClassesToAddOnShow() );
            };

            obj.hide = function() {
                obj._removeClassesOnHide();
                obj._addClassesOnHide();
            };

            obj._removeClassesOnHide = function() {
                obj.removeClass( options.getClassesToRemoveOnHide );
            };

            obj._addClassesOnHide = function() {
                obj.addClass( options.getClassesToAddOnHide );
            };

            return obj._init();
        };
    }
})();
