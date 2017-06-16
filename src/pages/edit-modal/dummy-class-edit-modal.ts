import { EditModalInterface } from "./edit-modal-interface";
import { Entry } from "../../providers/model/entry-model";
import { Department } from "../../providers/model/department-model";
import { AppConfig } from "../../app/app-config";
import { Attachment } from "../../providers/model/attachment-model";

/**
 * This is a dummy class for testing purposes. Will implement the SingleEntryInterface
 */
export class DummyEditModal implements EditModalInterface {
    public getDepartments(): Array<number> {
        let departments: Array<number> = [0, 1, 2, 3];
        return departments;
    };
    public setEntry(entry: Entry) {};
}