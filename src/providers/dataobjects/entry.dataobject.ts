import { DepartmentEntrySpecificsDataObject } from "./department-entry-description.dataobject";
import { AttachmentDataObject } from "./attachment.dataobject";

/**
 * EntryDataobject class for usage in model and controller. Class defines how entries should be specified
 */
export abstract class EntryDataObject {
  abstract get _id(): string;

  abstract get name(): string;
  abstract set name(name: string);

  abstract get description(): string;
  abstract set description(description: string);

  abstract get contact(): string;
  abstract set contact(contact: string);

  abstract get email(): string;
  abstract set email(email: string);

  abstract get relatedDepartments(): Array<number>;
  abstract set relatedDepartments(relatedDepartments: Array<number>);

  abstract get attachments(): Array<AttachmentDataObject>;

  abstract get departmentSpecifics(): Array<DepartmentEntrySpecificsDataObject>;
  abstract set departmentSpecifics(departmentSpecifics: Array<DepartmentEntrySpecificsDataObject>);

  public static init(): EntryDataObject {
    return {
      "_id": undefined,
      "name": "",
      "description": "",
      "contact": "",
      "email": "",
      "relatedDepartments": [],
      "attachments": [],
      "departmentSpecifics": []
    }
  }
  
}
