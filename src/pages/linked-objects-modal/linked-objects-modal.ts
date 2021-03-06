import { Component } from "@angular/core";
import { AlertController, IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController } from "ionic-angular";
import { AppModelService } from "../../providers/app-model-service";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { LinkedObjectsModalModelInterface } from "./linked-objects-modal.model-interface";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { Logger } from "../../app/logger";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Rx";

@IonicPage()
@Component({
  selector: "page-linked-objects-modal",
  templateUrl: "linked-objects-modal.html"
})
export class LinkedObjectsModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;
  private alertCtrl: AlertController;
  private modalCtrl: ModalController;
  private loadingCtrl: LoadingController;

  // navParams
  private relatedDepartments: Array<string>;
  private relatedEntriesIds: Array<string>;
  private synonyms: Array<string>;
  private acronyms: Array<string>;
  private isEditMode: boolean;

  // model object
  private appModelService: LinkedObjectsModalModelInterface;

  // data objects
  private globalDepartmentConfigDataObject: GlobalDepartmentConfigDataObject;
  private selectedLanguageDataObject: UserLanguageFilterConfigDataObject;
  private relatedEntries: Promise<Array<EntryDataObject>>;

  // temp input objects
  private synonym: string;
  private acronym: string;

  // other
  private translateService: TranslateService;

  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, alertCtrl: AlertController, modalCtrl: ModalController, loadingCtrl: LoadingController, appModelService: AppModelService, translateService: TranslateService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;
    this.alertCtrl = alertCtrl;
    this.modalCtrl = modalCtrl;
    this.loadingCtrl = loadingCtrl;

    // get navParams
    this.relatedDepartments = this.navParams.get("relatedDepartments");
    this.relatedEntriesIds = this.navParams.get("relatedEntries");
    this.synonyms = this.navParams.get("synonyms");
    this.acronyms = this.navParams.get("acronyms");
    this.isEditMode = this.navParams.get("isEditMode") ? this.navParams.get("isEditMode") : false;

    // instantiate model
    this.appModelService = appModelService;

    // other
    this.translateService = translateService;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewDidLoad() {
    this.loadData();

  }

  private ionViewCanEnter(): Promise<boolean> {
    return this.appModelService.isAuthenticated(this.loadingCtrl);
  }

  //////////////////////////////////////////
  //            Page Functions            //
  //////////////////////////////////////////

  private loadData() {
    this.globalDepartmentConfigDataObject = this.appModelService.getGlobalDepartmentConfigDataObject();

    // get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguageDataObject = data;

      // load relatedEntries
      this.relatedEntries = this.loadEntries(this.relatedEntriesIds);
    }, (error) => {
      Logger.log("Loading selected language failed (Class: LinkedObjectsModalPage, Method: loadData()");
      Logger.error(error);
    });
  }

  private loadEntries(relatedEntriesIds: Array<string>): Promise<Array<EntryDataObject>> {
    return new Promise((resolve, reject) => {
      let relatedEntries = []; // instantiate array

      if (relatedEntriesIds != undefined) {

        relatedEntriesIds.forEach(entryId => {
          // get entry and push to relatedEntries array
          this.appModelService.getEntryDataObjectToShow(entryId, this.selectedLanguageDataObject.selectedLanguage).then((data) => {
            relatedEntries.push(data);
          }, (error) => {
            reject(error);
          });
        });

        resolve(relatedEntries);

      }
    });
  }

  private addRelatedDepartment(newRelatedDepartmentId: string) {
    // check if already initialized, if not do so
    this.relatedDepartments = this.relatedDepartments ? this.relatedDepartments : [];

    this.relatedDepartments.push(newRelatedDepartmentId);
    this.relatedDepartments.sort((a, b) => {
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      return 0;
    });
  }

  private removeRelatedDepartment(relatedDepartmentIdToRemove: string) {
    let index: number = this.relatedDepartments.findIndex(relatedDepartmentId => relatedDepartmentId == relatedDepartmentIdToRemove);
    if (index > -1) {
      this.relatedDepartments.splice(index, 1);
    }
    if (this.relatedDepartments.length == 0) {
      this.relatedDepartments = undefined;
    }
  }

  private addRelatedEntry(newRelatedEntryDocumentId: string) {
    // check if already initialized, if not do so
    this.relatedEntriesIds = this.relatedEntriesIds ? this.relatedEntriesIds : [];

    this.relatedEntriesIds.push(newRelatedEntryDocumentId);
    this.relatedEntriesIds.sort();

    // reload page
    this.loadData();
  }

  private removeRelatedEntry(relatedEntryToRemoveDocumentId: string) {
    let index: number = this.relatedEntriesIds.findIndex(relatedDepartmentDocumentId => relatedDepartmentDocumentId == relatedEntryToRemoveDocumentId);
    if (index > -1) {
      this.relatedEntriesIds.splice(index, 1);
    }

    if (this.relatedEntriesIds.length == 0) {
      this.relatedEntriesIds = undefined;
    }

    // reload page
    this.loadData();
  }

  private addSynonym() {
    // check if already initialized, if not do so
    this.synonyms = this.synonyms ? this.synonyms : [];

    this.synonyms.push(this.synonym);
    this.synonyms.sort();

    this.synonym = undefined;
  }

  private removeSynonym(synonymToRemove: string) {
    let index: number = this.synonyms.findIndex(synonym => synonym == synonymToRemove);
    if (index > -1) {
      this.synonyms.splice(index, 1);
    }
    if (this.synonyms.length == 0) {
      this.synonyms = undefined;
    }
  }

  private addAcronym() {
    // check if already initialized, if not do so
    this.acronyms = this.acronyms ? this.acronyms : [];

    this.acronyms.push(this.acronym);
    this.acronyms.sort();

    this.acronym = undefined;
  }

  private removeAcronym(acronymToRemove: string) {
    let index: number = this.acronyms.findIndex(acronym => acronym == acronymToRemove);
    if (index > -1) {
      this.acronyms.splice(index, 1);
    }
    if (this.acronyms.length == 0) {
      this.acronyms = undefined;
    }
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeLinkedObjectsModal() {
    this.viewCtrl.dismiss({
      relatedDepartments: this.relatedDepartments,
      relatedEntries: this.relatedEntriesIds,
      synonyms: this.synonyms,
      acronyms: this.acronyms
    });
  }

  private showRelatedDepartmentsCheckboxAlert() {
    Observable.zip(
      this.translateService.get("SELECT_RELATED_DEPARTMENTS"),
      this.translateService.get("CANCEL"),
      this.translateService.get("OK"),
      (selectRelatedDepartments: string, cancel: string, ok: string) => {
        let relatedDepartmentCheckboxAlert = this.alertCtrl.create();
        relatedDepartmentCheckboxAlert.setTitle(selectRelatedDepartments);

    this.globalDepartmentConfigDataObject.departments.forEach(department => {
      if (this.relatedDepartments == undefined) {
        relatedDepartmentCheckboxAlert.addInput({
          type: "radio",
          label: department.departmentName,
          value: department.departmentId.toString()
        });
      } else {
        if (this.relatedDepartments.find(departmentId => departmentId == department.departmentId) == undefined) {
          relatedDepartmentCheckboxAlert.addInput({
            type: "radio",
            label: department.departmentName,
            value: department.departmentId.toString()
          });
        }
      }
    });

        relatedDepartmentCheckboxAlert.addButton(cancel);
        relatedDepartmentCheckboxAlert.addButton({
          text: ok,
          handler: data => {
            this.addRelatedDepartment(data);
          }
        });

        return relatedDepartmentCheckboxAlert;
      }
    ).subscribe((alert)=>{
      alert.present();
    });
  }

  /**
   * Method allows user to search for entry to add as related entry.
   */
  private openEntryListModal() {
    let entryListModal = this.modalCtrl.create("EntryListPage", {
      seachbarFocus: false,
      pushToEdit: true
    });
    entryListModal.present().then((canEnterView) => {
      if (!canEnterView) {
        // in the case that the view can not be entered redirect the user to the login page
        this.navCtrl.setRoot("LoginPage");
      }
    });
    entryListModal.onDidDismiss((data) => {
      if (data) {
        this.addRelatedEntry(data.entryDocumentId);
      }
    })
  }
}
