import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { UserSettingsPageModelInterface } from "./user-settings.model-interface";
import { AppModelService } from "../../providers/app-model-service";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../../providers/dataobjects/user-department-filter-config.dataobject";
import { Logger } from "../../app/logger";

@IonicPage()
@Component({
  selector: 'page-user-settings',
  templateUrl: 'user-settings.html',
})
export class UserSettingsPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private popoverCtrl: PopoverController;

  // model object
  private userSettingsPageModelInterface: UserSettingsPageModelInterface;

  // data objects
  private globalDepartmentConfigDataObject: GlobalDepartmentConfigDataObject | any;
  private userDepartmentFilterConfigDataObject: UserDepartmentFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, popoverCtrl: PopoverController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.popoverCtrl = popoverCtrl;

    // instantiate model object
    this.userSettingsPageModelInterface = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  /**
   * IONIC LIFECYCLE METHODS
   */
  private ionViewCanEnter(): Promise<boolean> | boolean {
    this.userDepartmentFilterConfigDataObject.selectedDepartments = this.selectedDepartmentIds
    return this.userSettingsPageModelInterface.isAuthenticated();
  };

  ionViewDidLoad() {
    // load data
    this.loadData();
  };

  /**
   * PAGE METHODS
   */
  private loadData() {
    // load global department config
    this.globalDepartmentConfigDataObject = this.userSettingsPageModelInterface.getGlobalDepartmentConfigDataObject();

    // load user department preferences
    this.userSettingsPageModelInterface.getUserDepartmentFilterConfigDataObject().then((data) => {
      this.userDepartmentFilterConfigDataObject = data;

      // put global config and user config together to fit to form
      

    }, (error) => {
      Logger.log("Loading user department preferences failed (Class: UserSettingsPage, Method: loadData()");
      Logger.error(error);
    });
  };

  /**
   * transform globalDepartmentConfigDataObject to array of numbers to set it in model afterwards
   */
  get selectedDepartmentIds() {
    if (this.globalDepartmentConfigDataObject) {
      return this.globalDepartmentConfigDataObject.departments.filter(department => department.checked).map(department => department.departmentId);
    };
  };

  /**
   * Update model to reflect new UserDepartmentFilterConfigDataObject
   * @param selectedDepartmentIds 
   */
  private updateModel(selectedDepartmentIds: Array<number>) {
    // update array to reflect new settings
    this.userDepartmentFilterConfigDataObject.selectedDepartments = this.selectedDepartmentIds;
    
    // update model
    this.userSettingsPageModelInterface.setUserDepartmentFilterConfigDataObject(this.userDepartmentFilterConfigDataObject).then((data) => {
      Logger.log("Successfully set UserDepartmentFilterConfigDataObject (Class: UserSettingsPage, Method: updateModel()");
      Logger.log(data);
    }, (error) => {
      Logger.log("Setting UserDepartmentFilterConfigDataObject not successfull (Class: UserSettingsPage, Method: updateModel()");
      Logger.error(error);
    });
  };

  /**
   * NAVIGATION METHODS
   */

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
  };

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
  };
}