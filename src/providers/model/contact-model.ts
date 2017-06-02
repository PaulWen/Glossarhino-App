/**
 * Contact class for usage in model and controller. Class specifies contacts
 */
export class Contact {
    ////////////////////////////////////////////Properties/////////////////////////////////////////////
    private name: String;
    private id: number;
    private email: String;

    ////////////////////////////////////////////Constructor////////////////////////////////////////////
    constructor(name: String, id: number, email: String) {
        this.name = name;
        this.id = id;
        this.email = email;
    }
}