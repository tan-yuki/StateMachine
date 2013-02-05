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

    test('fire events when not set current state', function() {
        var TestStateMachine = new StateMachine();
        TestStateMachine.fire('hogehoge');
        ok(true);
    });

    test('fire not register events', function() {
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


}) (jQuery, window);
