function inputStatechartExecutionContext() {
    var self = this; //used in the rare occasions we call public functions from inside this class
    //system variable declarations
    var _event = {
        name: undefined,
        data: undefined
    },
        _name = "input",
        _sessionid;
    var _x = {
        _event: _event,
        _name: _name,
        _sessionid: _sessionid
    };
    //variable declarations relating to data model
    var data = new Object();
    var command_name = '',
        command = {},
        emma = {
            "Emma": {
                "medium": "acoustic",
                "mode": "voice"
            }
        };
    //send timeout id variables
    var $default_Regexp_N1066F = /^($default)/,
        speech_input_event_Regexp_N10674 = /^(speech_input_event)/,
        touch_input_event_Regexp_N10679 = /^(touch_input_event)/,
        back_Regexp_N1067E = /^(back)/,
        click_on_login_btn_Regexp_N10683 = /^(click_on_login_btn)/,
        click_on_register_btn_Regexp_N10688 = /^(click_on_register_btn)/,
        click_on_sign_up_btn_Regexp_N1068D = /^(click_on_sign_up_btn)/,
        click_on_appointment_btn_Regexp_N10692 = /^(click_on_appointment_btn)/,
        click_on_save_appointment_btn_Regexp_N10697 = /^(click_on_save_appointment_btn)/,
        click_on_discard_appointment_btn_Regexp_N1069C = /^(click_on_discard_appointment_btn)/,
        click_on_language_btn_Regexp_N106A1 = /^(click_on_language_btn)/,
        language_choosen_Regexp_N106A6 = /^(language_choosen)/;
    //abstract state
    var AbstractState = new
    function() {
        //triggers are methods
        this.$default = function() {};
        this.back = function() {};
        this.click_on_login_btn = function() {};
        this.click_on_register_btn = function() {};
        this.click_on_sign_up_btn = function() {};
        this.click_on_appointment_btn = function() {};
        this.click_on_save_appointment_btn = function() {};
        this.click_on_discard_appointment_btn = function() {};
        this.click_on_language_btn = function() {};
        this.language_choosen = function() {};
        this.speech_input_event = function() {};
        this.touch_input_event = function() {};
        this.$default = function() {};
        this.$dispatchPrefixEvent = function() {};
    }
    //states
    var scxml_N10001 = (function() {
        function scxml_N10001Constructor() {
            this.parent = AbstractState;
            this.initial = null;
            this.depth = 0;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            false;
            this.toString = function() {
                return "scxml_N10001"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("scxml_N10001");
                }
            }
            this.exitAction = function() {
                for (var N10001_iterator = 0, N10001_hoist = listeners.length;
                N10001_iterator < N10001_hoist;
                N10001_iterator++) {
                    var listener = listeners[N10001_iterator];
                    //from
                    listener.onExit("scxml_N10001");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return AbstractState.$dispatchPrefixEvent(e);
            }
        }
        scxml_N10001Constructor.prototype = AbstractState;
        return new scxml_N10001Constructor();
    })();
    var _initial = (function() {
        function _initialConstructor() {
            this.parent = scxml_N10001;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                ];
            this.parent.initial = this; //init parent's pointer to initial state
            this.toString = function() {
                return "_initial"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("_initial");
                }
            }
            this.exitAction = function() {
                for (var N10009_iterator = 0, N10009_hoist = listeners.length;
                N10009_iterator < N10009_hoist;
                N10009_iterator++) {
                    var listener = listeners[N10009_iterator];
                    //from
                    listener.onExit("_initial");
                }
            }
            this.$default = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        _initial.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "input_manager_initial_state_initial", "_initial_$default_1");
                        }
                        //enter states
                        input_manager_initial_state.enterAction();
                        input_manager_initial_state_initial.enterAction();
                        //update configuration
                        currentConfiguration = [
                            input_manager_initial_state_initial
                            ];
                    }
                }
                return scxml_N10001['$default']();
            }
            this.$dispatchPrefixEvent = function(e) {
                return scxml_N10001.$dispatchPrefixEvent(e);
            }
        }
        _initialConstructor.prototype = scxml_N10001;
        return new _initialConstructor();
    })();
    var input_manager_initial_state = (function() {
        function input_manager_initial_stateConstructor() {
            this.parent = scxml_N10001;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            false;
            this.toString = function() {
                return "input_manager_initial_state"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("input_manager_initial_state");
                }
            }
            this.exitAction = function() {
                for (var N10055_iterator = 0, N10055_hoist = listeners.length;
                N10055_iterator < N10055_hoist;
                N10055_iterator++) {
                    var listener = listeners[N10055_iterator];
                    //from
                    listener.onExit("input_manager_initial_state");
                }
            }
            this.speech_input_event = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        var statesExited = [];
                        var lca = scxml_N10001;
                        var nonBasicTriggerDispatcherExitBlockIteratorExpression = currentConfiguration;
                        for (var N10000_iterator = 0, N10000_hoist = nonBasicTriggerDispatcherExitBlockIteratorExpression.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var state = nonBasicTriggerDispatcherExitBlockIteratorExpression[N10000_iterator];
                            if (
                            indexOf(state.ancestors, lca) !== -1) {
                                do {
                                    statesExited.push(state);
                                } while ((state = state.parent) && state != lca && indexOf(statesExited, state) == -1)
                            }
                        }
                        //sort by depth
                        statesExited.sort(sortByDepthDeepToShallow);
                        //execute actions for each of these states
                        for (var N10000_iterator = 0, N10000_hoist = statesExited.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var state = statesExited[N10000_iterator];
                            state.exitAction();
                        }
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "speech_input", "input_manager_initial_state_speech_input_event_3");
                        }
                        //enter states
                        input_manager_initial_state.enterAction();
                        speech_input.enterAction();
                        //update configuration
                        currentConfiguration = [
                            speech_input
                            ];
                    }
                }
                return scxml_N10001['speech_input_event']();
            }
            this.touch_input_event = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        var statesExited = [];
                        var lca = scxml_N10001;
                        var nonBasicTriggerDispatcherExitBlockIteratorExpression = currentConfiguration;
                        for (var N10000_iterator = 0, N10000_hoist = nonBasicTriggerDispatcherExitBlockIteratorExpression.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var state = nonBasicTriggerDispatcherExitBlockIteratorExpression[N10000_iterator];
                            if (
                            indexOf(state.ancestors, lca) !== -1) {
                                do {
                                    statesExited.push(state);
                                } while ((state = state.parent) && state != lca && indexOf(statesExited, state) == -1)
                            }
                        }
                        //sort by depth
                        statesExited.sort(sortByDepthDeepToShallow);
                        //execute actions for each of these states
                        for (var N10000_iterator = 0, N10000_hoist = statesExited.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var state = statesExited[N10000_iterator];
                            state.exitAction();
                        }
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "touch_input_initial", "input_manager_initial_state_touch_input_event_4");
                        }
                        //enter states
                        input_manager_initial_state.enterAction();
                        touch_input.enterAction();
                        touch_input_initial.enterAction();
                        //update configuration
                        currentConfiguration = [
                            touch_input_initial
                            ];
                    }
                }
                return scxml_N10001['touch_input_event']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(speech_input_event_Regexp_N10674)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            var statesExited = [];
                            var lca = scxml_N10001;
                            var nonBasicTriggerDispatcherExitBlockIteratorExpression = currentConfiguration;
                            for (var N10000_iterator = 0, N10000_hoist = nonBasicTriggerDispatcherExitBlockIteratorExpression.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var state = nonBasicTriggerDispatcherExitBlockIteratorExpression[N10000_iterator];
                                if (
                                indexOf(state.ancestors, lca) !== -1) {
                                    do {
                                        statesExited.push(state);
                                    } while ((state = state.parent) && state != lca && indexOf(statesExited, state) == -1)
                                }
                            }
                            //sort by depth
                            statesExited.sort(sortByDepthDeepToShallow);
                            //execute actions for each of these states
                            for (var N10000_iterator = 0, N10000_hoist = statesExited.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var state = statesExited[N10000_iterator];
                                state.exitAction();
                            }
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("input_manager_initial_state", "speech_input", "input_manager_initial_state_speech_input_event_3");
                            }
                            //enter states
                            input_manager_initial_state.enterAction();
                            speech_input.enterAction();
                            //update configuration
                            currentConfiguration = [
                                speech_input
                                ];
                        }
                    }
                }
                if (e.match(touch_input_event_Regexp_N10679)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            var statesExited = [];
                            var lca = scxml_N10001;
                            var nonBasicTriggerDispatcherExitBlockIteratorExpression = currentConfiguration;
                            for (var N10000_iterator = 0, N10000_hoist = nonBasicTriggerDispatcherExitBlockIteratorExpression.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var state = nonBasicTriggerDispatcherExitBlockIteratorExpression[N10000_iterator];
                                if (
                                indexOf(state.ancestors, lca) !== -1) {
                                    do {
                                        statesExited.push(state);
                                    } while ((state = state.parent) && state != lca && indexOf(statesExited, state) == -1)
                                }
                            }
                            //sort by depth
                            statesExited.sort(sortByDepthDeepToShallow);
                            //execute actions for each of these states
                            for (var N10000_iterator = 0, N10000_hoist = statesExited.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var state = statesExited[N10000_iterator];
                                state.exitAction();
                            }
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("input_manager_initial_state", "touch_input_initial", "input_manager_initial_state_touch_input_event_4");
                            }
                            //enter states
                            input_manager_initial_state.enterAction();
                            touch_input.enterAction();
                            touch_input_initial.enterAction();
                            //update configuration
                            currentConfiguration = [
                                touch_input_initial
                                ];
                        }
                    }
                }
                return scxml_N10001.$dispatchPrefixEvent(e);
            }
        }
        input_manager_initial_stateConstructor.prototype = scxml_N10001;
        return new input_manager_initial_stateConstructor();
    })();
    var input_manager_initial_state_initial = (function() {
        function input_manager_initial_state_initialConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.parent.initial = this; //init parent's pointer to initial state
            this.toString = function() {
                return "input_manager_initial_state_initial"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("input_manager_initial_state_initial");
                }
            }
            this.exitAction = function() {
                for (var N1005A_iterator = 0, N1005A_hoist = listeners.length;
                N1005A_iterator < N1005A_hoist;
                N1005A_iterator++) {
                    var listener = listeners[N1005A_iterator];
                    //from
                    listener.onExit("input_manager_initial_state_initial");
                }
            }
            this.$default = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        input_manager_initial_state_initial.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "touch_input_initial", "input_manager_initial_state_initial_$default_2");
                        }
                        //enter states
                        touch_input.enterAction();
                        touch_input_initial.enterAction();
                        //update configuration
                        currentConfiguration = [
                            touch_input_initial
                            ];
                    }
                }
                return input_manager_initial_state['$default']();
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        input_manager_initial_state_initialConstructor.prototype = input_manager_initial_state;
        return new input_manager_initial_state_initialConstructor();
    })();
    var speech_input = (function() {
        function speech_inputConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "speech_input"
            }
            this.enterAction = function() {
                var actionName;
                for (name in _event.data) {
                    if (name == 'phrase') {
                        continue;
                    }
                    if (_event.data.hasOwnProperty(name)) {
                        actionName = name;
                        break;
                    }
                }
                console.log('InputManager: setting command_name to "' + actionName + '" for event-data ' + JSON.stringify(_event.data));
                command_name = actionName;
                command = _event.data;
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("speech_input");
                }
            }
            this.exitAction = function() {
                for (var N100FF_iterator = 0, N100FF_hoist = listeners.length;
                N100FF_iterator < N100FF_hoist;
                N100FF_iterator++) {
                    var listener = listeners[N100FF_iterator];
                    //from
                    listener.onExit("speech_input");
                }
            }
            this.$default = function() {
                if (command_name == 'Send') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "send", "speech_input_$default_5");
                        }
                        //enter states
                        send.enterAction();
                        //update configuration
                        currentConfiguration = [
                            send
                            ];
                    }
                }
                if (command_name == 'Play') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "play", "speech_input_$default_6");
                        }
                        //enter states
                        play.enterAction();
                        //update configuration
                        currentConfiguration = [
                            play
                            ];
                    }
                }
                if (command_name == 'Record') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "record", "speech_input_$default_7");
                        }
                        //enter states
                        record.enterAction();
                        //update configuration
                        currentConfiguration = [
                            record
                            ];
                    }
                }
                if (command_name == 'ShowInfo') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "show_info", "speech_input_$default_8");
                        }
                        //enter states
                        show_info.enterAction();
                        //update configuration
                        currentConfiguration = [
                            show_info
                            ];
                    }
                }
                if (command_name == 'Rating') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "rating", "speech_input_$default_9");
                        }
                        //enter states
                        rating.enterAction();
                        //update configuration
                        currentConfiguration = [
                            rating
                            ];
                    }
                }
                if (command_name == 'RadarStart') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "start_radar", "speech_input_$default_10");
                        }
                        //enter states
                        start_radar.enterAction();
                        //update configuration
                        currentConfiguration = [
                            start_radar
                            ];
                    }
                }
                if (command_name == 'ShowPOIs') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "show_pois", "speech_input_$default_11");
                        }
                        //enter states
                        show_pois.enterAction();
                        //update configuration
                        currentConfiguration = [
                            show_pois
                            ];
                    }
                }
                if (command_name == 'ShowAppointments') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "show_appointments", "speech_input_$default_12");
                        }
                        //enter states
                        show_appointments.enterAction();
                        //update configuration
                        currentConfiguration = [
                            show_appointments
                            ];
                    }
                }
                if (command_name == 'CreateAppointment') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "create_appointment", "speech_input_$default_13");
                        }
                        //enter states
                        create_appointment.enterAction();
                        //update configuration
                        currentConfiguration = [
                            create_appointment
                            ];
                    }
                }
                if (command_name == 'RecordMemo') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "record_memo", "speech_input_$default_14");
                        }
                        //enter states
                        record_memo.enterAction();
                        //update configuration
                        currentConfiguration = [
                            record_memo
                            ];
                    }
                }
                if (command_name == 'FindPerson') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "find_person", "speech_input_$default_15");
                        }
                        //enter states
                        find_person.enterAction();
                        //update configuration
                        currentConfiguration = [
                            find_person
                            ];
                    }
                }
                if (command_name == 'NoMatch') return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        speech_input.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "no_match", "speech_input_$default_16");
                        }
                        //enter states
                        no_match.enterAction();
                        //update configuration
                        currentConfiguration = [
                            no_match
                            ];
                    }
                }
                return input_manager_initial_state['$default']();
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        speech_inputConstructor.prototype = input_manager_initial_state;
        return new speech_inputConstructor();
    })();
    var no_match = (function() {
        function no_matchConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "no_match"
            }
            this.enterAction = function() {
                var dm = null; //TODO: mmir.CalendarModel.getInstance().getDiscourseManager();
                if (dm == null) {
                    var msg = mmir.LanguageManager.getInstance().getText('did_not_understand_msg');
                    mmir.MediaManager.textToSpeech(msg);
                } else {
                    dm.getCommand().parse(command);
                }
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("no_match");
                }
            }
            this.exitAction = function() {
                for (var N1043E_iterator = 0, N1043E_hoist = listeners.length;
                N1043E_iterator < N1043E_hoist;
                N1043E_iterator++) {
                    var listener = listeners[N1043E_iterator];
                    //from
                    listener.onExit("no_match");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        no_matchConstructor.prototype = input_manager_initial_state;
        return new no_matchConstructor();
    })();
    var send = (function() {
        function sendConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "send"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                //dummy code:
                console.info('sending ....')
                alert('sending ....');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("send");
                }
            }
            this.exitAction = function() {
                for (var N10450_iterator = 0, N10450_hoist = listeners.length;
                N10450_iterator < N10450_hoist;
                N10450_iterator++) {
                    var listener = listeners[N10450_iterator];
                    //from
                    listener.onExit("send");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        sendConstructor.prototype = input_manager_initial_state;
        return new sendConstructor();
    })();
    var play = (function() {
        function playConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "play"
            }
            this.enterAction = function() {
                //dummy code:
                console.info('play something ...')
                alert('play something ...');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("play");
                }
            }
            this.exitAction = function() {
                for (var N10462_iterator = 0, N10462_hoist = listeners.length;
                N10462_iterator < N10462_hoist;
                N10462_iterator++) {
                    var listener = listeners[N10462_iterator];
                    //from
                    listener.onExit("play");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        playConstructor.prototype = input_manager_initial_state;
        return new playConstructor();
    })();
    var record = (function() {
        function recordConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "record"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.raise('click_on_rec_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("record");
                }
            }
            this.exitAction = function() {
                for (var N10474_iterator = 0, N10474_hoist = listeners.length;
                N10474_iterator < N10474_hoist;
                N10474_iterator++) {
                    var listener = listeners[N10474_iterator];
                    //from
                    listener.onExit("record");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        recordConstructor.prototype = input_manager_initial_state;
        return new recordConstructor();
    })();
    var show_info = (function() {
        function show_infoConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "show_info"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.raise('poi.display_details');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("show_info");
                }
            }
            this.exitAction = function() {
                for (var N10486_iterator = 0, N10486_hoist = listeners.length;
                N10486_iterator < N10486_hoist;
                N10486_iterator++) {
                    var listener = listeners[N10486_iterator];
                    //from
                    listener.onExit("show_info");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        show_infoConstructor.prototype = input_manager_initial_state;
        return new show_infoConstructor();
    })();
    var rating = (function() {
        function ratingConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "rating"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                //dummy code:
                console.info('rating ...')
                alert('rating ....');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("rating");
                }
            }
            this.exitAction = function() {
                for (var N10498_iterator = 0, N10498_hoist = listeners.length;
                N10498_iterator < N10498_hoist;
                N10498_iterator++) {
                    var listener = listeners[N10498_iterator];
                    //from
                    listener.onExit("rating");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        ratingConstructor.prototype = input_manager_initial_state;
        return new ratingConstructor();
    })();
    var start_radar = (function() {
        function start_radarConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "start_radar"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.raise('click_on_radar_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("start_radar");
                }
            }
            this.exitAction = function() {
                for (var N104AA_iterator = 0, N104AA_hoist = listeners.length;
                N104AA_iterator < N104AA_hoist;
                N104AA_iterator++) {
                    var listener = listeners[N104AA_iterator];
                    //from
                    listener.onExit("start_radar");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        start_radarConstructor.prototype = input_manager_initial_state;
        return new start_radarConstructor();
    })();
    var play_radio = (function() {
        function play_radioConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "play_radio"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.raise('click_on_start_radio_btn', emma);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("play_radio");
                }
            }
            this.exitAction = function() {
                for (var N104BC_iterator = 0, N104BC_hoist = listeners.length;
                N104BC_iterator < N104BC_hoist;
                N104BC_iterator++) {
                    var listener = listeners[N104BC_iterator];
                    //from
                    listener.onExit("play_radio");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        play_radioConstructor.prototype = input_manager_initial_state;
        return new play_radioConstructor();
    })();
    var play_audio = (function() {
        function play_audioConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "play_audio"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.raise('click_on_start_audio_btn', emma);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("play_audio");
                }
            }
            this.exitAction = function() {
                for (var N104CE_iterator = 0, N104CE_hoist = listeners.length;
                N104CE_iterator < N104CE_hoist;
                N104CE_iterator++) {
                    var listener = listeners[N104CE_iterator];
                    //from
                    listener.onExit("play_audio");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        play_audioConstructor.prototype = input_manager_initial_state;
        return new play_audioConstructor();
    })();
    var play_voice = (function() {
        function play_voiceConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "play_voice"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.MediaManager.textToSpeech('Sie können zurzeit nur Audio und lokationsbasiertes Radio abspielen.', null, null);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("play_voice");
                }
            }
            this.exitAction = function() {
                for (var N104E0_iterator = 0, N104E0_hoist = listeners.length;
                N104E0_iterator < N104E0_hoist;
                N104E0_iterator++) {
                    var listener = listeners[N104E0_iterator];
                    //from
                    listener.onExit("play_voice");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        play_voiceConstructor.prototype = input_manager_initial_state;
        return new play_voiceConstructor();
    })();
    var show_appointments = (function() {
        function show_appointmentsConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "show_appointments"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.raise('show_appointments_speech', command);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("show_appointments");
                }
            }
            this.exitAction = function() {
                for (var N104F2_iterator = 0, N104F2_hoist = listeners.length;
                N104F2_iterator < N104F2_hoist;
                N104F2_iterator++) {
                    var listener = listeners[N104F2_iterator];
                    //from
                    listener.onExit("show_appointments");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        show_appointmentsConstructor.prototype = input_manager_initial_state;
        return new show_appointmentsConstructor();
    })();
    var create_appointment = (function() {
        function create_appointmentConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "create_appointment"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.raise('create_appointment_speech', command);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("create_appointment");
                }
            }
            this.exitAction = function() {
                for (var N10504_iterator = 0, N10504_hoist = listeners.length;
                N10504_iterator < N10504_hoist;
                N10504_iterator++) {
                    var listener = listeners[N10504_iterator];
                    //from
                    listener.onExit("create_appointment");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        create_appointmentConstructor.prototype = input_manager_initial_state;
        return new create_appointmentConstructor();
    })();
    var record_memo = (function() {
        function record_memoConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "record_memo"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.performHelper('Calendar', 'capture');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("record_memo");
                }
            }
            this.exitAction = function() {
                for (var N10516_iterator = 0, N10516_hoist = listeners.length;
                N10516_iterator < N10516_hoist;
                N10516_iterator++) {
                    var listener = listeners[N10516_iterator];
                    //from
                    listener.onExit("record_memo");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        record_memoConstructor.prototype = input_manager_initial_state;
        return new record_memoConstructor();
    })();
    var find_person = (function() {
        function find_personConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "find_person"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                mmir.DialogManager.perform('Calendar', 'find_person', command);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("find_person");
                }
            }
            this.exitAction = function() {
                for (var N10528_iterator = 0, N10528_hoist = listeners.length;
                N10528_iterator < N10528_hoist;
                N10528_iterator++) {
                    var listener = listeners[N10528_iterator];
                    //from
                    listener.onExit("find_person");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        find_personConstructor.prototype = input_manager_initial_state;
        return new find_personConstructor();
    })();
    var show_pois = (function() {
        function show_poisConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                ];
            this.toString = function() {
                return "show_pois"
            }
            this.enterAction = function() {
                mmir.CalendarModel.getInstance().clearDiscourseManager();
                //dummy code:
                console.info('showing some pois ...')
                alert('showing some pois ...');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("show_pois");
                }
            }
            this.exitAction = function() {
                for (var N1053A_iterator = 0, N1053A_hoist = listeners.length;
                N1053A_iterator < N1053A_hoist;
                N1053A_iterator++) {
                    var listener = listeners[N1053A_iterator];
                    //from
                    listener.onExit("show_pois");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        show_poisConstructor.prototype = input_manager_initial_state;
        return new show_poisConstructor();
    })();
    var touch_input = (function() {
        function touch_inputConstructor() {
            this.parent = input_manager_initial_state;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            false;
            this.toString = function() {
                return "touch_input"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("touch_input");
                }
            }
            this.exitAction = function() {
                for (var N1054C_iterator = 0, N1054C_hoist = listeners.length;
                N1054C_iterator < N1054C_hoist;
                N1054C_iterator++) {
                    var listener = listeners[N1054C_iterator];
                    //from
                    listener.onExit("touch_input");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return input_manager_initial_state.$dispatchPrefixEvent(e);
            }
        }
        touch_inputConstructor.prototype = input_manager_initial_state;
        return new touch_inputConstructor();
    })();
    var touch_input_initial = (function() {
        function touch_input_initialConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.parent.initial = this; //init parent's pointer to initial state
            this.toString = function() {
                return "touch_input_initial"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("touch_input_initial");
                }
            }
            this.exitAction = function() {
                for (var N10551_iterator = 0, N10551_hoist = listeners.length;
                N10551_iterator < N10551_hoist;
                N10551_iterator++) {
                    var listener = listeners[N10551_iterator];
                    //from
                    listener.onExit("touch_input_initial");
                }
            }
            this.$default = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        touch_input_initial.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "start_touch", "touch_input_initial_$default_17");
                        }
                        //enter states
                        start_touch.enterAction();
                        //update configuration
                        currentConfiguration = [
                            start_touch
                            ];
                    }
                }
                return touch_input['$default']();
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        touch_input_initialConstructor.prototype = touch_input;
        return new touch_input_initialConstructor();
    })();
    var start_touch = (function() {
        function start_touchConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "start_touch"
            }
            this.enterAction = function() {
                data = {};
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("start_touch");
                }
            }
            this.exitAction = function() {
                data = _event.data;
                for (var N10598_iterator = 0, N10598_hoist = listeners.length;
                N10598_iterator < N10598_hoist;
                N10598_iterator++) {
                    var listener = listeners[N10598_iterator];
                    //from
                    listener.onExit("start_touch");
                }
            }
            this.back = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "back", "start_touch_back_18");
                        }
                        //enter states
                        back.enterAction();
                        //update configuration
                        currentConfiguration = [
                            back
                            ];
                    }
                }
                return touch_input['back']();
            }
            this.click_on_login_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "login", "start_touch_click_on_login_btn_19");
                        }
                        //enter states
                        login.enterAction();
                        //update configuration
                        currentConfiguration = [
                            login
                            ];
                    }
                }
                return touch_input['click_on_login_btn']();
            }
            this.click_on_register_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "register", "start_touch_click_on_register_btn_20");
                        }
                        //enter states
                        register.enterAction();
                        //update configuration
                        currentConfiguration = [
                            register
                            ];
                    }
                }
                return touch_input['click_on_register_btn']();
            }
            this.click_on_sign_up_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "sign_up", "start_touch_click_on_sign_up_btn_21");
                        }
                        //enter states
                        sign_up.enterAction();
                        //update configuration
                        currentConfiguration = [
                            sign_up
                            ];
                    }
                }
                return touch_input['click_on_sign_up_btn']();
            }
            this.click_on_appointment_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "appointment", "start_touch_click_on_appointment_btn_22");
                        }
                        //enter states
                        appointment.enterAction();
                        //update configuration
                        currentConfiguration = [
                            appointment
                            ];
                    }
                }
                return touch_input['click_on_appointment_btn']();
            }
            this.click_on_save_appointment_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "save_appointment", "start_touch_click_on_save_appointment_btn_23");
                        }
                        //enter states
                        save_appointment.enterAction();
                        //update configuration
                        currentConfiguration = [
                            save_appointment
                            ];
                    }
                }
                return touch_input['click_on_save_appointment_btn']();
            }
            this.click_on_discard_appointment_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "discard_appointment", "start_touch_click_on_discard_appointment_btn_24");
                        }
                        //enter states
                        discard_appointment.enterAction();
                        //update configuration
                        currentConfiguration = [
                            discard_appointment
                            ];
                    }
                }
                return touch_input['click_on_discard_appointment_btn']();
            }
            this.click_on_language_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "language_btn", "start_touch_click_on_language_btn_25");
                        }
                        //enter states
                        language_btn.enterAction();
                        //update configuration
                        currentConfiguration = [
                            language_btn
                            ];
                    }
                }
                return touch_input['click_on_language_btn']();
            }
            this.language_choosen = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start_touch.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "language_chosen", "start_touch_language_choosen_26");
                        }
                        //enter states
                        language_chosen.enterAction();
                        //update configuration
                        currentConfiguration = [
                            language_chosen
                            ];
                    }
                }
                return touch_input['language_choosen']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(back_Regexp_N1067E)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "back", "start_touch_back_18");
                            }
                            //enter states
                            back.enterAction();
                            //update configuration
                            currentConfiguration = [
                                back
                                ];
                        }
                    }
                }
                if (e.match(click_on_login_btn_Regexp_N10683)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "login", "start_touch_click_on_login_btn_19");
                            }
                            //enter states
                            login.enterAction();
                            //update configuration
                            currentConfiguration = [
                                login
                                ];
                        }
                    }
                }
                if (e.match(click_on_register_btn_Regexp_N10688)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "register", "start_touch_click_on_register_btn_20");
                            }
                            //enter states
                            register.enterAction();
                            //update configuration
                            currentConfiguration = [
                                register
                                ];
                        }
                    }
                }
                if (e.match(click_on_sign_up_btn_Regexp_N1068D)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "sign_up", "start_touch_click_on_sign_up_btn_21");
                            }
                            //enter states
                            sign_up.enterAction();
                            //update configuration
                            currentConfiguration = [
                                sign_up
                                ];
                        }
                    }
                }
                if (e.match(click_on_appointment_btn_Regexp_N10692)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "appointment", "start_touch_click_on_appointment_btn_22");
                            }
                            //enter states
                            appointment.enterAction();
                            //update configuration
                            currentConfiguration = [
                                appointment
                                ];
                        }
                    }
                }
                if (e.match(click_on_save_appointment_btn_Regexp_N10697)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "save_appointment", "start_touch_click_on_save_appointment_btn_23");
                            }
                            //enter states
                            save_appointment.enterAction();
                            //update configuration
                            currentConfiguration = [
                                save_appointment
                                ];
                        }
                    }
                }
                if (e.match(click_on_discard_appointment_btn_Regexp_N1069C)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "discard_appointment", "start_touch_click_on_discard_appointment_btn_24");
                            }
                            //enter states
                            discard_appointment.enterAction();
                            //update configuration
                            currentConfiguration = [
                                discard_appointment
                                ];
                        }
                    }
                }
                if (e.match(click_on_language_btn_Regexp_N106A1)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "language_btn", "start_touch_click_on_language_btn_25");
                            }
                            //enter states
                            language_btn.enterAction();
                            //update configuration
                            currentConfiguration = [
                                language_btn
                                ];
                        }
                    }
                }
                if (e.match(language_choosen_Regexp_N106A6)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start_touch.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start_touch", "language_chosen", "start_touch_language_choosen_26");
                            }
                            //enter states
                            language_chosen.enterAction();
                            //update configuration
                            currentConfiguration = [
                                language_chosen
                                ];
                        }
                    }
                }
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        start_touchConstructor.prototype = touch_input;
        return new start_touchConstructor();
    })();
    var back = (function() {
        function backConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "back"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('back');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("back");
                }
            }
            this.exitAction = function() {
                for (var N10809_iterator = 0, N10809_hoist = listeners.length;
                N10809_iterator < N10809_hoist;
                N10809_iterator++) {
                    var listener = listeners[N10809_iterator];
                    //from
                    listener.onExit("back");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        backConstructor.prototype = touch_input;
        return new backConstructor();
    })();
    var login = (function() {
        function loginConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "login"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('click_on_login_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("login");
                }
            }
            this.exitAction = function() {
                for (var N1081B_iterator = 0, N1081B_hoist = listeners.length;
                N1081B_iterator < N1081B_hoist;
                N1081B_iterator++) {
                    var listener = listeners[N1081B_iterator];
                    //from
                    listener.onExit("login");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        loginConstructor.prototype = touch_input;
        return new loginConstructor();
    })();
    var register = (function() {
        function registerConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "register"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('click_on_register_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("register");
                }
            }
            this.exitAction = function() {
                for (var N1082D_iterator = 0, N1082D_hoist = listeners.length;
                N1082D_iterator < N1082D_hoist;
                N1082D_iterator++) {
                    var listener = listeners[N1082D_iterator];
                    //from
                    listener.onExit("register");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        registerConstructor.prototype = touch_input;
        return new registerConstructor();
    })();
    var sign_up = (function() {
        function sign_upConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "sign_up"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('click_on_sign_up_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("sign_up");
                }
            }
            this.exitAction = function() {
                for (var N1083F_iterator = 0, N1083F_hoist = listeners.length;
                N1083F_iterator < N1083F_hoist;
                N1083F_iterator++) {
                    var listener = listeners[N1083F_iterator];
                    //from
                    listener.onExit("sign_up");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        sign_upConstructor.prototype = touch_input;
        return new sign_upConstructor();
    })();
    var appointment = (function() {
        function appointmentConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "appointment"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('click_on_appointment_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("appointment");
                }
            }
            this.exitAction = function() {
                for (var N10851_iterator = 0, N10851_hoist = listeners.length;
                N10851_iterator < N10851_hoist;
                N10851_iterator++) {
                    var listener = listeners[N10851_iterator];
                    //from
                    listener.onExit("appointment");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        appointmentConstructor.prototype = touch_input;
        return new appointmentConstructor();
    })();
    var save_appointment = (function() {
        function save_appointmentConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "save_appointment"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('click_on_save_appointment_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("save_appointment");
                }
            }
            this.exitAction = function() {
                for (var N10863_iterator = 0, N10863_hoist = listeners.length;
                N10863_iterator < N10863_hoist;
                N10863_iterator++) {
                    var listener = listeners[N10863_iterator];
                    //from
                    listener.onExit("save_appointment");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        save_appointmentConstructor.prototype = touch_input;
        return new save_appointmentConstructor();
    })();
    var discard_appointment = (function() {
        function discard_appointmentConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "discard_appointment"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('click_on_discard_appointment_btn');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("discard_appointment");
                }
            }
            this.exitAction = function() {
                for (var N10875_iterator = 0, N10875_hoist = listeners.length;
                N10875_iterator < N10875_hoist;
                N10875_iterator++) {
                    var listener = listeners[N10875_iterator];
                    //from
                    listener.onExit("discard_appointment");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        discard_appointmentConstructor.prototype = touch_input;
        return new discard_appointmentConstructor();
    })();
    var language_btn = (function() {
        function language_btnConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "language_btn"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('click_on_language_btn', data);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("language_btn");
                }
            }
            this.exitAction = function() {
                for (var N10887_iterator = 0, N10887_hoist = listeners.length;
                N10887_iterator < N10887_hoist;
                N10887_iterator++) {
                    var listener = listeners[N10887_iterator];
                    //from
                    listener.onExit("language_btn");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        language_btnConstructor.prototype = touch_input;
        return new language_btnConstructor();
    })();
    var language_chosen = (function() {
        function language_chosenConstructor() {
            this.parent = touch_input;
            this.initial = null;
            this.depth = 3;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxml_N10001
                        ,
                    input_manager_initial_state
                        ,
                    touch_input
                ];
            this.toString = function() {
                return "language_chosen"
            }
            this.enterAction = function() {
                mmir.DialogManager.raise('language_choosen', data);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("language_chosen");
                }
            }
            this.exitAction = function() {
                for (var N10899_iterator = 0, N10899_hoist = listeners.length;
                N10899_iterator < N10899_hoist;
                N10899_iterator++) {
                    var listener = listeners[N10899_iterator];
                    //from
                    listener.onExit("language_chosen");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return touch_input.$dispatchPrefixEvent(e);
            }
        }
        language_chosenConstructor.prototype = touch_input;
        return new language_chosenConstructor();
    })();
    var $basicStateDescendantsOfParallelStates = {}
    //states enum for glass-box unit testing
    this._states = {
        _initial: _initial,
        input_manager_initial_state_initial: input_manager_initial_state_initial,
        speech_input: speech_input,
        no_match: no_match,
        send: send,
        play: play,
        record: record,
        show_info: show_info,
        rating: rating,
        start_radar: start_radar,
        play_radio: play_radio,
        play_audio: play_audio,
        play_voice: play_voice,
        show_appointments: show_appointments,
        create_appointment: create_appointment,
        record_memo: record_memo,
        find_person: find_person,
        show_pois: show_pois,
        touch_input_initial: touch_input_initial,
        start_touch: start_touch,
        back: back,
        login: login,
        register: register,
        sign_up: sign_up,
        appointment: appointment,
        save_appointment: save_appointment,
        discard_appointment: discard_appointment,
        language_btn: language_btn,
        language_chosen: language_chosen
    }
    //trigger methods for synchronous interaction
    this["$default"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "$default", data, true)
        } else {
            return undefined;
        }
    }
    this["speech_input_event"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "speech_input_event", data, true)
        } else {
            return undefined;
        }
    }
    this["touch_input_event"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "touch_input_event", data, true)
        } else {
            return undefined;
        }
    }
    this["back"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "back", data, true)
        } else {
            return undefined;
        }
    }
    this["click_on_login_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_login_btn", data, true)
        } else {
            return undefined;
        }
    }
    this["click_on_register_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_register_btn", data, true)
        } else {
            return undefined;
        }
    }
    this["click_on_sign_up_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_sign_up_btn", data, true)
        } else {
            return undefined;
        }
    }
    this["click_on_appointment_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_appointment_btn", data, true)
        } else {
            return undefined;
        }
    }
    this["click_on_save_appointment_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_save_appointment_btn", data, true)
        } else {
            return undefined;
        }
    }
    this["click_on_discard_appointment_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_discard_appointment_btn", data, true)
        } else {
            return undefined;
        }
    }
    this["click_on_language_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_language_btn", data, true)
        } else {
            return undefined;
        }
    }
    this["language_choosen"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "language_choosen", data, true)
        } else {
            return undefined;
        }
    }
    //initialization script
    //initialization method
    this.initialize = function() {
        currentConfiguration = [input_manager_initial_state_initial];
        runToCompletion();
        mainLoop();
    }
    //internal runtime functions
    function sortByDepthDeepToShallow(a, b) {
        return b.depth - a.depth;
    }
    //start static boilerplate code
    //static private member variables
    var currentConfiguration = []; //current configuration
    var innerEventQueue = []; //inner event queue
    var outerEventQueue = []; //outer event queue
    var isInStableState = true;
    var hasTakenDefaultTransition = false;
    var destroyed = false;
    var mainLoopCallback = null;
    //static private member functions

    function mainLoop() {
        if (!destroyed) {
            //take an event from the current outer event queue
            if (outerEventQueue.length && isInStableState) {
                runToCompletion(outerEventQueue.shift(), outerEventQueue.shift());
            }
            //call back
            mainLoopCallback = window.setTimeout(function() {
                mainLoop(); //FIXME: note that when calling mainloop this way, we won't have access to the "this" object. 
                //I don't think we ever use it though. Everything we need is private in function scope.
            }, 100);
        }
    }
    function runToCompletion(e, data, isEnumeratedEvent) {
        isInStableState = false;
        if (e) {
            innerEventQueue.push(e, data, isEnumeratedEvent);
        }
        do {
            //take any available default transitions
            microstep("$default", null, true);
            if (!hasTakenDefaultTransition) {
                if (!innerEventQueue.length) {
                    //we have no more generated events, and no default transitions fired, so
                    //we are done, and have run to completion
                    break;
                } else {
                    //microstep, then dequeue next event sending in event
                    microstep(innerEventQueue.shift(), innerEventQueue.shift(), innerEventQueue.shift());
                }
            } else {
                //he has taken a default transition, so reset the global variable to false and loop again
                hasTakenDefaultTransition = false;
            }
        } while (true)
        isInStableState = true;
    }
    function microstep(e, data, isEnumeratedEvent) {
        var enabledTransitions = [],
            transition = null,
            preemptedBasicStates = {};
        //we set the event as a global, rather than passing it into the function invocation as a parameter,
        //because in cases of default events, the event object will be populated with previous event's data
        if (e !== "$default") {
            _event.name = isEnumeratedEvent ? e : e;
            _event.data = data;
        }
        if (isEnumeratedEvent) {
            //e does not contain a dot, so dispatch as an enumerated event
            for (var N10000_iterator = 0, N10000_hoist = currentConfiguration.length;
            N10000_iterator < N10000_hoist;
            N10000_iterator++) {
                var state = currentConfiguration[N10000_iterator];
                //check to make sure he is not preempted
                if (!(state in preemptedBasicStates)) {
                    //lookup the transition
                    var transition = state[e]();
                    if (transition) {
                        enabledTransitions.push(transition.action);
                        mixin(transition.preemptedBasicStates, preemptedBasicStates);
                    }
                }
            }
        } else {
            //e contains a dot, so dispatch as a prefix event
            for (var N10000_iterator = 0, N10000_hoist = currentConfiguration.length;
            N10000_iterator < N10000_hoist;
            N10000_iterator++) {
                var state = currentConfiguration[N10000_iterator];
                //check to make sure he is not preempted
                if (!(state in preemptedBasicStates)) {
                    //lookup the transition
                    var transition = state.$dispatchPrefixEvent(e)
                    if (transition) {
                        enabledTransitions.push(transition.action);
                        mixin(transition.preemptedBasicStates, preemptedBasicStates);
                    }
                }
            }
        }
        //invoke selected transitions
        for (var N10000_iterator = 0, N10000_hoist = enabledTransitions.length;
        N10000_iterator < N10000_hoist;
        N10000_iterator++) {
            var t = enabledTransitions[N10000_iterator];
            t();
        }
    }
    function mixin(from, to) {
        for (var prop in from) {
            to[prop] = from[prop]
        }
    }
    this.destroy = function() {
        //right now, this only disables timer and sets global destroyed variable to prevent future callbacks
        window.clearTimeout(mainLoopCallback);
        mainLoopCallback = null;
        destroyed = true;
    }
    //this is for async communication
    this.GEN = function(e, data) {
        outerEventQueue.push(e, data);
    }
    //this may or may not be something we want to expose, but for right now, we at least need it for testing
    this.getCurrentConfiguration = function() {
        //slice it to return a copy of the configuration rather than the conf itself
        //this saves us all kinds of confusion involving references and stuff
        //TODO: refactor this name to be genCurrentConfigurationStatement 
        var currentConfigurationExpression = currentConfiguration.slice();
        return currentConfigurationExpression;
    }
    //public API for In predicate
    this.$in = function(state) {
        return In(state);
    }
    //end static boilerplate code
    function In(state) {
        state = typeof state == "string" ? self._states[state] : state;
        var toReturn;
        if (state.isBasic) {
            toReturn =
            indexOf(currentConfiguration, state) != -1;
        } else {
            var toReturn = false;
            for (var N10000_iterator = 0, N10000_hoist = currentConfiguration.length;
            N10000_iterator < N10000_hoist;
            N10000_iterator++) {
                var s = currentConfiguration[N10000_iterator];
                if (
                indexOf(s.ancestors, state) != -1) {
                    toReturn = true;
                    break;
                }
            }
        }
        return toReturn;
    }
    function indexOf(arr, obj) {
        for (var i = 0, l = arr.length; i < l; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    }
    var listeners = [];
    //TODO:listeners support adding listeners for a particular state
    this.addListener = function(listener) {
        listeners.push(listener);
    }
    this.removeListener = function(listener) {
        listeners.splice(
        indexOf(listeners, listener), 1);
    }
}
