import {EntryDataObject} from "../../providers/dataobjects/entry.dataobject";
import {UserLanguageFilterConfigDataObject} from "../../providers/dataobjects/user-language-filter-config.dataobject";
import {UserDataObject} from "../../providers/dataobjects/user.dataobject";
import { LoadingController } from "ionic-angular";

export interface CommentModalModelInterface {

  /**
   *  This method checks if the user is already authenticated.
   *
   * @returns true or false depending on if the user is already authenticated
   */
  isAuthenticated(loadingCtrl: LoadingController): Promise<boolean>;

  getCurrentUser(): Promise<UserDataObject>;
  getSelectedLanguage(): Promise<UserLanguageFilterConfigDataObject>;
  setEntryDataObject(entryDataObject: EntryDataObject, languageId: string): Promise<boolean>;
  isOnline(): boolean;
}
