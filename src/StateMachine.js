(function($, __global__) {


    /**
     * StateMachine
     *
     */
    var StateMachine = function() {};

    StateMachine.prototype = {


        /**
         * Current state
         */
        curretState: null,

        /**
         * Execute current state events
         *
         * @param {String} event name.
         */
        fire: function(ev) {
            this.curretState && this.curretState.fire(ev);
        },

        /**
         * Switch to this state.
         *
         * @param {Object} State instance
         */
        switchTo: function(state) {
            this.curretState = state;
        },

        /**
         * Create State instance
         */
        create: function(options) {
            options = $.extend(true, {
                elem: null
            }, options);

            // Create new state instance
            var State = function(options) {
                this.options = options;
            };

            State.prototype = {
                parents: this,

                obj: options.elem || $({}),

                on: function(name, func) {
                    var that = this;
                    this.obj.bind(name, function() {
                        that.isActive() && func.apply(this, arguments);
                    });
                },

                off: function(name) {
                    this.obj.unbind(name);
                },

                fire: function(name) {
                    this.obj.trigger(name);
                },

                isActive: function() {
                    return this.parents.curretState === this;
                }
            };

            return new State(options);
        }
    };

    __global__.StateMachine = StateMachine;
}) (this.jQuery, this);
