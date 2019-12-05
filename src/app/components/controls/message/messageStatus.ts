export class MessageStatus{
    constructor(private messageType: MessageType, private title: string, private description: string){}

    set Description(msg){
        this.description = msg;
    }
    get Description(){
        return this.description;
    }
    set Title(title){
        this.title = title;
    }
    get Title(){
        return this.title;
    }
    set MessageType(msgType){
        this.messageType = msgType;
    }
    get MessageType(){
        return this.messageType;
    }
}

export enum MessageType {
    Success = 0,
    Error = 1,
    Alert = 2
}