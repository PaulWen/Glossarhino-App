import {Component} from "@angular/core";
import {Promise} from "es6-promise";
import {IonicPage, NavController, PopoverController} from "ionic-angular";
import {AppModelService} from "../../providers/app-model-service";
import {SuperLoginClientError} from "../../providers/super_login_client/super_login_client_error";
import {HomePageInterface} from "./home-interface";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {

  ////////////////////////////////////////////Properties////////////////////////////////////////////
  // model objects
  private homePageInterface: HomePageInterface;
  private departments: Array<number>;
  private filter: Array<boolean>;
  private language: String;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, appModel: AppModelService) {
    // instantiate model objects
    this.homePageInterface = appModel;
    this.departments = this.homePageInterface.getAllDepartments();
    this.filter = this.homePageInterface.getFilter();
    this.language = this.homePageInterface.getLanguage();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.homePageInterface.isAuthenticated();
  }

  /**
   * Logs the user out and directs him to the Login-Page.
   */
  private logout() {
    this.homePageInterface.logout(() => {
      // successfully loged-out
      this.navCtrl.setRoot("LoginPage");

    }, (error: SuperLoginClientError) => {
      alert(error.getErrorMessage());
    });
  }


  /**
   * navigate to entry list and hand over department
   * @param departmentId
   */
  private pushList(departmentId?: number) {
    this.navCtrl.push("EntryListPage", {
      departmentId: departmentId
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

  /**
   * navigate to entry list and open searchbar
   */
  private pushSearch() {
    this.navCtrl.push("EntryListPage", {
      searchbarFocus: true
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

  /**
   * create and present LanguagePopover to enable changing languages
   * @param event
   */
  private presentLanguagePopover(event: any) {
    let popover = this.popoverCtrl.create("LanguagePopoverPage");
    popover.present({
      ev: event
    }).then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
  }

}
