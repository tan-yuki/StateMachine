(function($, __global__) {
    module('StateMachine');

    test('exists StateMachine class', function() {
        ok(StateMachine);
    });

    test('register some state', function() {
        expect(2);
        var TestStateMachine = new StateMachine();

        var NormalState = TestStateMachine.create();
        var EditState = TestStateMachine.create();

        // register events
        NormalState.on('click', function() {
            ok(true);
        });
        EditState.on('click', function() {
            ok(false);
        });

        // State :-> NormalState
        TestStateMachine.switchTo(NormalState);
        TestStateMachine.fire('click');

        // off events
        NormalState.off('click');
        EditState.off('click');

        TestStateMachine.fire('click');

        // re-register events
        NormalState.on('click', function() {
            ok(false);
        });
        EditState.on('click', function() {
            ok(true);
        });

        // State :-> EditState
        TestStateMachine.switchTo(EditState);
        TestStateMachine.fire('click');
    });

    test('emit events when not set current state', function() {
        var TestStateMachine = new StateMachine();
        TestStateMachine.fire('hogehoge');
        ok(true);
    });

    test('emit events which is not registered', function() {
        var TestStateMachine = new StateMachine();
        var NormalState = TestStateMachine.create();
        NormalState.on('click', function() {
            ok(false);
        });
        TestStateMachine.fire('hogehoge');
        ok(true);
    });

    test('dobule registration of events', function() {
        expect(2);

        var TestStateMachine = new StateMachine();
        var NormalState = TestStateMachine.create();
        NormalState.on('click', function() {
            ok(true, 'once');
        });
        NormalState.on('click', function() {
            ok(true, 'twice');
        });

        TestStateMachine.switchTo(NormalState);
        TestStateMachine.fire('click');
    });

    test('events name space', function() {
        expect(2);
        var TestStateMachine = new StateMachine();
        var NormalState = TestStateMachine.create();
        NormalState.on('click.login', function() {
            ok(true, 'once');
        });
        NormalState.on('click', function() {
            ok(true, 'twice');
        });
        NormalState.on('blur', function() {
            ok(false, 'Should not be called');
        });
        TestStateMachine.switchTo(NormalState);
        TestStateMachine.fire('click');
    });

    test('bind events to specified DOM element', function() {
        expect(1);

        var elem = $('#editable-link input');

        var TestStateMachine = new StateMachine();
        var NormalState = TestStateMachine.create({
            elem: elem
        });

        NormalState.on('click', function() {
            ok(true);
        });

        // If current state, fire registered event
        TestStateMachine.switchTo(NormalState);
        elem.click();

        // If not current state, not fire registered event
        TestStateMachine.switchTo(null);
        elem.click(); // Not fire

    });

    test('pass arguments to emit event function', function() {
        expect(4);

        var elem = $('#editable-link input');

        var TestStateMachine = new StateMachine();

        var State1 = TestStateMachine.create();
        var State2 = TestStateMachine.create({
            elem: elem
        });

        var param1Val = 'hogehoge';
        var param2Val = 'foobar';
        State1.on('argsTest', function(e, param1, param2) {
            equal(param1, param1Val);
            equal(param2, param2Val);
        });

        TestStateMachine.switchTo(State1);
        State1.fire('argsTest', [param1Val, param2Val]);

        State2.on('argsTest', function(e, param1, param2) {
            equal(param1, param2Val);
            equal(param2, param1Val);
        });
        TestStateMachine.switchTo(State2);
        State2.fire('argsTest', [param2Val, param1Val]);
    });


}) (jQuery, window);
