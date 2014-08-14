function StatechartExecutionContext() {
    var self = this; //used in the rare occasions we call public functions from inside this class
    //system variable declarations
    var _event = {
        name: undefined,
        data: undefined
    },
        _name = "",
        _sessionid;
    var _x = {
        _event: _event,
        _name: _name,
        _sessionid: _sessionid
    };
    //variable declarations relating to data model
    //send timeout id variables
    var $default_Regexp_N103F4 = /^($default)/,
        init_Regexp_N103F9 = /^(init)/,
        click_on_login_btn_Regexp_N103FE = /^(click_on_login_btn)/,
        click_on_sign_up_btn_Regexp_N10403 = /^(click_on_sign_up_btn)/,
        click_on_language_btn_Regexp_N10408 = /^(click_on_language_btn)/,
        language_choosen_Regexp_N1040D = /^(language_choosen)/,
        click_on_register_btn_Regexp_N10412 = /^(click_on_register_btn)/,
        back_Regexp_N10417 = /^(back)/,
        login_failed_Regexp_N1041C = /^(login_failed)/,
        user_logged_in_Regexp_N10421 = /^(user_logged_in)/,
        click_on_appointment_btn_Regexp_N10426 = /^(click_on_appointment_btn)/,
        click_on_save_appointment_btn_Regexp_N1042B = /^(click_on_save_appointment_btn)/,
        click_on_discard_appointment_btn_Regexp_N10430 = /^(click_on_discard_appointment_btn)/;
    //abstract state
    var AbstractState = new
    function() {
        //triggers are methods
        this.$default = function() {};
        this.init = function() {};
        this.click_on_login_btn = function() {};
        this.click_on_sign_up_btn = function() {};
        this.click_on_language_btn = function() {};
        this.language_choosen = function() {};
        this.click_on_register_btn = function() {};
        this.back = function() {};
        this.login_failed = function() {};
        this.user_logged_in = function() {};
        this.click_on_appointment_btn = function() {};
        this.click_on_save_appointment_btn = function() {};
        this.click_on_discard_appointment_btn = function() {};
        this.$default = function() {};
        this.$dispatchPrefixEvent = function() {};
    }
    //states
    var scxmlRoot = (function() {
        function scxmlRootConstructor() {
            this.parent = AbstractState;
            this.initial = null;
            this.depth = 0;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            false;
            this.toString = function() {
                return "scxmlRoot"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("scxmlRoot");
                }
            }
            this.exitAction = function() {
                for (var N10001_iterator = 0, N10001_hoist = listeners.length;
                N10001_iterator < N10001_hoist;
                N10001_iterator++) {
                    var listener = listeners[N10001_iterator];
                    //from
                    listener.onExit("scxmlRoot");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return AbstractState.$dispatchPrefixEvent(e);
            }
        }
        scxmlRootConstructor.prototype = AbstractState;
        return new scxmlRootConstructor();
    })();
    var scxmlRoot_initial = (function() {
        function scxmlRoot_initialConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                ];
            this.parent.initial = this; //init parent's pointer to initial state
            this.toString = function() {
                return "scxmlRoot_initial"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("scxmlRoot_initial");
                }
            }
            this.exitAction = function() {
                for (var N10009_iterator = 0, N10009_hoist = listeners.length;
                N10009_iterator < N10009_hoist;
                N10009_iterator++) {
                    var listener = listeners[N10009_iterator];
                    //from
                    listener.onExit("scxmlRoot_initial");
                }
            }
            this.$default = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        scxmlRoot_initial.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "start", "scxmlRoot_initial_$default_1");
                        }
                        //enter states
                        start.enterAction();
                        //update configuration
                        currentConfiguration = [
                            start
                            ];
                    }
                }
                return scxmlRoot['$default']();
            }
            this.$dispatchPrefixEvent = function(e) {
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        scxmlRoot_initialConstructor.prototype = scxmlRoot;
        return new scxmlRoot_initialConstructor();
    })();
    var start = (function() {
        function startConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                ];
            this.toString = function() {
                return "start"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("start");
                }
            }
            this.exitAction = function() {
                for (var N1004F_iterator = 0, N1004F_hoist = listeners.length;
                N1004F_iterator < N1004F_hoist;
                N1004F_iterator++) {
                    var listener = listeners[N1004F_iterator];
                    //from
                    listener.onExit("start");
                }
            }
            this.init = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        start.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "main_state", "start_init_2");
                        }
                        //enter states
                        main_state.enterAction();
                        //update configuration
                        currentConfiguration = [
                            main_state
                            ];
                    }
                }
                return scxmlRoot['init']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(init_Regexp_N103F9)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            start.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("start", "main_state", "start_init_2");
                            }
                            //enter states
                            main_state.enterAction();
                            //update configuration
                            currentConfiguration = [
                                main_state
                                ];
                        }
                    }
                }
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        startConstructor.prototype = scxmlRoot;
        return new startConstructor();
    })();
    var main_state = (function() {
        function main_stateConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                ];
            this.toString = function() {
                return "main_state"
            }
            this.enterAction = function() {
                mmir.DialogManager.render('Application', 'login');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("main_state");
                }
            }
            this.exitAction = function() {
                for (var N1009D_iterator = 0, N1009D_hoist = listeners.length;
                N1009D_iterator < N1009D_hoist;
                N1009D_iterator++) {
                    var listener = listeners[N1009D_iterator];
                    //from
                    listener.onExit("main_state");
                }
            }
            this.click_on_login_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        main_state.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "login_user", "main_state_click_on_login_btn_3");
                        }
                        //enter states
                        login_user.enterAction();
                        //update configuration
                        currentConfiguration = [
                            login_user
                            ];
                    }
                }
                return scxmlRoot['click_on_login_btn']();
            }
            this.click_on_sign_up_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        main_state.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "registration_form", "main_state_click_on_sign_up_btn_4");
                        }
                        //enter states
                        registration_form.enterAction();
                        //update configuration
                        currentConfiguration = [
                            registration_form
                            ];
                    }
                }
                return scxmlRoot['click_on_sign_up_btn']();
            }
            this.click_on_language_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //transition action
                        mmir.DialogManager.perform('Application', 'slide_down_language_menu');
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                        }
                    }
                }
                return scxmlRoot['click_on_language_btn']();
            }
            this.language_choosen = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //transition action
                        var isChanged = _event.data && _event.data.changed ? _event.data.changed : false;
                        if (isChanged) {
                            mmir.DialogManager.render('Application', 'login');
                        }
                        else {
                            mmir.DialogManager.perform('Application', 'slide_up_language_menu');
                        }
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                        }
                    }
                }
                return scxmlRoot['language_choosen']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(click_on_login_btn_Regexp_N103FE)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            main_state.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("main_state", "login_user", "main_state_click_on_login_btn_3");
                            }
                            //enter states
                            login_user.enterAction();
                            //update configuration
                            currentConfiguration = [
                                login_user
                                ];
                        }
                    }
                }
                if (e.match(click_on_sign_up_btn_Regexp_N10403)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            main_state.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("main_state", "registration_form", "main_state_click_on_sign_up_btn_4");
                            }
                            //enter states
                            registration_form.enterAction();
                            //update configuration
                            currentConfiguration = [
                                registration_form
                                ];
                        }
                    }
                }
                if (e.match(click_on_language_btn_Regexp_N10408)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //transition action
                            mmir.DialogManager.perform('Application', 'slide_down_language_menu');
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                            }
                        }
                    }
                }
                if (e.match(language_choosen_Regexp_N1040D)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //transition action
                            var isChanged = _event.data && _event.data.changed ? _event.data.changed : false;
                            if (isChanged) {
                                mmir.DialogManager.render('Application', 'login');
                            }
                            else {
                                mmir.DialogManager.perform('Application', 'slide_up_language_menu');
                            }
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                            }
                        }
                    }
                }
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        main_stateConstructor.prototype = scxmlRoot;
        return new main_stateConstructor();
    })();
    var registration_form = (function() {
        function registration_formConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                ];
            this.toString = function() {
                return "registration_form"
            }
            this.enterAction = function() {
                mmir.DialogManager.render('Application', 'registration');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("registration_form");
                }
            }
            this.exitAction = function() {
                for (var N10168_iterator = 0, N10168_hoist = listeners.length;
                N10168_iterator < N10168_hoist;
                N10168_iterator++) {
                    var listener = listeners[N10168_iterator];
                    //from
                    listener.onExit("registration_form");
                }
            }
            this.click_on_register_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        registration_form.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "try_to_register_new_user", "registration_form_click_on_register_btn_5");
                        }
                        //enter states
                        try_to_register_new_user.enterAction();
                        //update configuration
                        currentConfiguration = [
                            try_to_register_new_user
                            ];
                    }
                }
                return scxmlRoot['click_on_register_btn']();
            }
            this.back = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        registration_form.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "main_state", "registration_form_back_6");
                        }
                        //enter states
                        main_state.enterAction();
                        //update configuration
                        currentConfiguration = [
                            main_state
                            ];
                    }
                }
                return scxmlRoot['back']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(click_on_register_btn_Regexp_N10412)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            registration_form.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("registration_form", "try_to_register_new_user", "registration_form_click_on_register_btn_5");
                            }
                            //enter states
                            try_to_register_new_user.enterAction();
                            //update configuration
                            currentConfiguration = [
                                try_to_register_new_user
                                ];
                        }
                    }
                }
                if (e.match(back_Regexp_N10417)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            registration_form.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("registration_form", "main_state", "registration_form_back_6");
                            }
                            //enter states
                            main_state.enterAction();
                            //update configuration
                            currentConfiguration = [
                                main_state
                                ];
                        }
                    }
                }
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        registration_formConstructor.prototype = scxmlRoot;
        return new registration_formConstructor();
    })();
    var try_to_register_new_user = (function() {
        function try_to_register_new_userConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                ];
            this.toString = function() {
                return "try_to_register_new_user"
            }
            this.enterAction = function() {
                mmir.DialogManager.perform('Application', 'register');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("try_to_register_new_user");
                }
            }
            this.exitAction = function() {
                for (var N10203_iterator = 0, N10203_hoist = listeners.length;
                N10203_iterator < N10203_hoist;
                N10203_iterator++) {
                    var listener = listeners[N10203_iterator];
                    //from
                    listener.onExit("try_to_register_new_user");
                }
            }
            this.$default = function() {
                if (mmir.User.getInstance() == null) return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        try_to_register_new_user.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "main_state", "try_to_register_new_user_$default_7");
                        }
                        //enter states
                        main_state.enterAction();
                        //update configuration
                        currentConfiguration = [
                            main_state
                            ];
                    }
                }
                if (mmir.User.getInstance() != null) return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        try_to_register_new_user.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "logged_in", "try_to_register_new_user_$default_8");
                        }
                        //enter states
                        logged_in.enterAction();
                        //update configuration
                        currentConfiguration = [
                            logged_in
                            ];
                    }
                }
                return scxmlRoot['$default']();
            }
            this.$dispatchPrefixEvent = function(e) {
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        try_to_register_new_userConstructor.prototype = scxmlRoot;
        return new try_to_register_new_userConstructor();
    })();
    var login_user = (function() {
        function login_userConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                ];
            this.toString = function() {
                return "login_user"
            }
            this.enterAction = function() {
                mmir.DialogManager.perform('Application', 'login');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("login_user");
                }
            }
            this.exitAction = function() {
                for (var N1029A_iterator = 0, N1029A_hoist = listeners.length;
                N1029A_iterator < N1029A_hoist;
                N1029A_iterator++) {
                    var listener = listeners[N1029A_iterator];
                    //from
                    listener.onExit("login_user");
                }
            }
            this.login_failed = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        login_user.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "main_state", "login_user_login_failed_9");
                        }
                        //enter states
                        main_state.enterAction();
                        //update configuration
                        currentConfiguration = [
                            main_state
                            ];
                    }
                }
                return scxmlRoot['login_failed']();
            }
            this.user_logged_in = function() {
                if (mmir.User.getInstance() != null) return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        login_user.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "logged_in", "login_user_user_logged_in_10");
                        }
                        //enter states
                        logged_in.enterAction();
                        //update configuration
                        currentConfiguration = [
                            logged_in
                            ];
                    }
                }
                if (mmir.User.getInstance() == null) return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        login_user.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "main_state", "login_user_user_logged_in_11");
                        }
                        //enter states
                        main_state.enterAction();
                        //update configuration
                        currentConfiguration = [
                            main_state
                            ];
                    }
                }
                return scxmlRoot['user_logged_in']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(login_failed_Regexp_N1041C)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            login_user.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("login_user", "main_state", "login_user_login_failed_9");
                            }
                            //enter states
                            main_state.enterAction();
                            //update configuration
                            currentConfiguration = [
                                main_state
                                ];
                        }
                    }
                }
                if (e.match(user_logged_in_Regexp_N10421)) {
                    if (mmir.User.getInstance() != null) return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            login_user.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("login_user", "logged_in", "login_user_user_logged_in_10");
                            }
                            //enter states
                            logged_in.enterAction();
                            //update configuration
                            currentConfiguration = [
                                logged_in
                                ];
                        }
                    }
                }
                if (e.match(user_logged_in_Regexp_N10421)) {
                    if (mmir.User.getInstance() == null) return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            login_user.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("login_user", "main_state", "login_user_user_logged_in_11");
                            }
                            //enter states
                            main_state.enterAction();
                            //update configuration
                            currentConfiguration = [
                                main_state
                                ];
                        }
                    }
                }
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        login_userConstructor.prototype = scxmlRoot;
        return new login_userConstructor();
    })();
    var logged_in = (function() {
        function logged_inConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                ];
            this.toString = function() {
                return "logged_in"
            }
            this.enterAction = function() {
                mmir.DialogManager.render('Application', 'welcome');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("logged_in");
                }
            }
            this.exitAction = function() {
                for (var N10376_iterator = 0, N10376_hoist = listeners.length;
                N10376_iterator < N10376_hoist;
                N10376_iterator++) {
                    var listener = listeners[N10376_iterator];
                    //from
                    listener.onExit("logged_in");
                }
            }
            this.back = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        logged_in.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "main_state", "logged_in_back_13");
                        }
                        //enter states
                        main_state.enterAction();
                        //update configuration
                        currentConfiguration = [
                            main_state
                            ];
                    }
                }
                return scxmlRoot['back']();
            }
            this.click_on_appointment_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        logged_in.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "create_appointment_initial", "logged_in_click_on_appointment_btn_12");
                        }
                        //enter states
                        create_appointment.enterAction();
                        create_appointment_initial.enterAction();
                        //update configuration
                        currentConfiguration = [
                            create_appointment_initial
                            ];
                    }
                }
                return scxmlRoot['click_on_appointment_btn']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(click_on_appointment_btn_Regexp_N10426)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            logged_in.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("logged_in", "create_appointment_initial", "logged_in_click_on_appointment_btn_12");
                            }
                            //enter states
                            create_appointment.enterAction();
                            create_appointment_initial.enterAction();
                            //update configuration
                            currentConfiguration = [
                                create_appointment_initial
                                ];
                        }
                    }
                }
                if (e.match(back_Regexp_N10417)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            logged_in.exitAction();
                            //transition action
                            for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                            N10000_iterator < N10000_hoist;
                            N10000_iterator++) {
                                var listener = listeners[N10000_iterator];
                                //transition id
                                listener.onTransition("logged_in", "main_state", "logged_in_back_13");
                            }
                            //enter states
                            main_state.enterAction();
                            //update configuration
                            currentConfiguration = [
                                main_state
                                ];
                        }
                    }
                }
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        logged_inConstructor.prototype = scxmlRoot;
        return new logged_inConstructor();
    })();
    var create_appointment = (function() {
        function create_appointmentConstructor() {
            this.parent = scxmlRoot;
            this.initial = null;
            this.depth = 1;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            false;
            this.toString = function() {
                return "create_appointment"
            }
            this.enterAction = function() {
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("create_appointment");
                }
            }
            this.exitAction = function() {
                for (var N10417_iterator = 0, N10417_hoist = listeners.length;
                N10417_iterator < N10417_hoist;
                N10417_iterator++) {
                    var listener = listeners[N10417_iterator];
                    //from
                    listener.onExit("create_appointment");
                }
            }
            this.back = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        var statesExited = [];
                        var lca = scxmlRoot;
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
                            listener.onTransition("", "logged_in", "create_appointment_back_16");
                        }
                        //enter states
                        logged_in.enterAction();
                        //update configuration
                        currentConfiguration = [
                            logged_in
                            ];
                    }
                }
                return scxmlRoot['back']();
            }
            this.click_on_save_appointment_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        var statesExited = [];
                        var lca = scxmlRoot;
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
                            listener.onTransition("", "save_appointment", "create_appointment_click_on_save_appointment_btn_14");
                        }
                        //enter states
                        create_appointment.enterAction();
                        save_appointment.enterAction();
                        //update configuration
                        currentConfiguration = [
                            save_appointment
                            ];
                    }
                }
                return scxmlRoot['click_on_save_appointment_btn']();
            }
            this.click_on_discard_appointment_btn = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        //exit states
                        var statesExited = [];
                        var lca = scxmlRoot;
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
                            listener.onTransition("", "logged_in", "create_appointment_click_on_discard_appointment_btn_15");
                        }
                        //enter states
                        logged_in.enterAction();
                        //update configuration
                        currentConfiguration = [
                            logged_in
                            ];
                    }
                }
                return scxmlRoot['click_on_discard_appointment_btn']();
            }
            this.$dispatchPrefixEvent = function(e) {
                if (e.match(click_on_save_appointment_btn_Regexp_N1042B)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            var statesExited = [];
                            var lca = scxmlRoot;
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
                                listener.onTransition("create_appointment", "save_appointment", "create_appointment_click_on_save_appointment_btn_14");
                            }
                            //enter states
                            create_appointment.enterAction();
                            save_appointment.enterAction();
                            //update configuration
                            currentConfiguration = [
                                save_appointment
                                ];
                        }
                    }
                }
                if (e.match(click_on_discard_appointment_btn_Regexp_N10430)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            var statesExited = [];
                            var lca = scxmlRoot;
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
                                listener.onTransition("create_appointment", "logged_in", "create_appointment_click_on_discard_appointment_btn_15");
                            }
                            //enter states
                            logged_in.enterAction();
                            //update configuration
                            currentConfiguration = [
                                logged_in
                                ];
                        }
                    }
                }
                if (e.match(back_Regexp_N10417)) {
                    return {
                        preemptedBasicStates: {},
                        action: function() {
                            //exit states
                            var statesExited = [];
                            var lca = scxmlRoot;
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
                                listener.onTransition("create_appointment", "logged_in", "create_appointment_back_16");
                            }
                            //enter states
                            logged_in.enterAction();
                            //update configuration
                            currentConfiguration = [
                                logged_in
                                ];
                        }
                    }
                }
                return scxmlRoot.$dispatchPrefixEvent(e);
            }
        }
        create_appointmentConstructor.prototype = scxmlRoot;
        return new create_appointmentConstructor();
    })();
    var create_appointment_initial = (function() {
        function create_appointment_initialConstructor() {
            this.parent = create_appointment;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                        ,
                    create_appointment
                ];
            this.parent.initial = this; //init parent's pointer to initial state
            this.toString = function() {
                return "create_appointment_initial"
            }
            this.enterAction = function() {
                mmir.DialogManager.render('Calendar', 'create_appointment');
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("create_appointment_initial");
                }
            }
            this.exitAction = function() {
                for (var N1041C_iterator = 0, N1041C_hoist = listeners.length;
                N1041C_iterator < N1041C_hoist;
                N1041C_iterator++) {
                    var listener = listeners[N1041C_iterator];
                    //from
                    listener.onExit("create_appointment_initial");
                }
            }
            this.$dispatchPrefixEvent = function(e) {
                return create_appointment.$dispatchPrefixEvent(e);
            }
        }
        create_appointment_initialConstructor.prototype = create_appointment;
        return new create_appointment_initialConstructor();
    })();
    var save_appointment = (function() {
        function save_appointmentConstructor() {
            this.parent = create_appointment;
            this.initial = null;
            this.depth = 2;
            this.historyState = null;
            //these variables facilitate fast In predicate
            this.isBasic =
            true;
            this.ancestors = [
                scxmlRoot
                        ,
                    create_appointment
                ];
            this.toString = function() {
                return "save_appointment"
            }
            this.enterAction = function() {
                var data = jQuery.parseJSON('{"container_id":"create_appointment"}');
                var result = mmir.DialogManager.perform('Calendar', 'create_appointment', data);
                for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                N10000_iterator < N10000_hoist;
                N10000_iterator++) {
                    var listener = listeners[N10000_iterator];
                    //to
                    listener.onEntry("save_appointment");
                }
            }
            this.exitAction = function() {
                for (var N104A1_iterator = 0, N104A1_hoist = listeners.length;
                N104A1_iterator < N104A1_hoist;
                N104A1_iterator++) {
                    var listener = listeners[N104A1_iterator];
                    //from
                    listener.onExit("save_appointment");
                }
            }
            this.$default = function() {
                return {
                    preemptedBasicStates: {},
                    action: function() {
                        hasTakenDefaultTransition = true;
                        //exit states
                        save_appointment.exitAction();
                        create_appointment.exitAction();
                        //transition action
                        for (var N10000_iterator = 0, N10000_hoist = listeners.length;
                        N10000_iterator < N10000_hoist;
                        N10000_iterator++) {
                            var listener = listeners[N10000_iterator];
                            //transition id
                            listener.onTransition("", "logged_in", "save_appointment_$default_17");
                        }
                        //enter states
                        logged_in.enterAction();
                        //update configuration
                        currentConfiguration = [
                            logged_in
                            ];
                    }
                }
                return create_appointment['$default']();
            }
            this.$dispatchPrefixEvent = function(e) {
                return create_appointment.$dispatchPrefixEvent(e);
            }
        }
        save_appointmentConstructor.prototype = create_appointment;
        return new save_appointmentConstructor();
    })();
    var $basicStateDescendantsOfParallelStates = {}
    //states enum for glass-box unit testing
    this._states = {
        scxmlRoot_initial: scxmlRoot_initial,
        start: start,
        main_state: main_state,
        registration_form: registration_form,
        try_to_register_new_user: try_to_register_new_user,
        login_user: login_user,
        logged_in: logged_in,
        create_appointment_initial: create_appointment_initial,
        save_appointment: save_appointment
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
    this["init"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "init", data, true)
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
    this["click_on_sign_up_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_sign_up_btn", data, true)
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
    this["click_on_register_btn"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "click_on_register_btn", data, true)
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
    this["login_failed"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "login_failed", data, true)
        } else {
            return undefined;
        }
    }
    this["user_logged_in"] = function(data) {
        if (isInStableState && !destroyed) {
            runToCompletion(
            //TODO: conditionally wrap in quotes for enumerated pattern
            "user_logged_in", data, true)
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
    //initialization script
    //initialization method
    this.initialize = function() {
        currentConfiguration = [start];
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
