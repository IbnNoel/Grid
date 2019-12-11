export class MessageStatus{
    private descriptArray = Array<string>();

    constructor(private messageType: MessageType, private title: string, private description: string | Array<string>){
        this.Description = description;
    }

    set Description(msg : string | Array<string>){
        if(msg instanceof Array){
            this.descriptArray = msg as Array<string>;
        } else{
         this.descriptArray = [msg];
        }
    }
    get Description(){
        return this.descriptArray;
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