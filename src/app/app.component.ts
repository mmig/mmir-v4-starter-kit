import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';


import { LoginPage } from '../pages/login-page/login-page';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';

declare var mmir;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Login', component: LoginPage },
      { title: 'Welcome', component: Page2 },
      { title: 'Add Appointment', component: Page1 }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    mmir.ready(() => {

    	//FIXME "converting" angular2 components to views
    	mmir.PresentationManager._ionicNavCtrl = this.nav;
	    let loginView = this.createView('login', LoginPage);
	    let welcomeView = this.createView('welcome', Page2);
	    let registrationView = this.createView('registration', Page1);
	    let appointmentView = this.createView('create_appointment', Page2);

	    //FIXME registering views
    	mmir.PresentationManager.addView('Application', loginView);
    	mmir.PresentationManager.addView('Application', registrationView);
    	mmir.PresentationManager.addView('Application', welcomeView);
    	mmir.PresentationManager.addView('Calendar', appointmentView);

    	//FIXME HACK wait until mmir.app has initialized:
    	var doStart = function(){
    		if(mmir.app && mmir.app.initialize){
		    	//start mmir app
		    	mmir.app.initialize.then(function(){
		    		mmir.DialogManager.raise('init');
		    	});
		    } else {
		    	setTimeout(doStart, 50);
		    }
	    };
	    doStart();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  private createView(name: string, page: Component){//FIXME
    return {
      _name: name,
      getName: function(){
        return this._name;
      },
      view: page
    };
  }
}
