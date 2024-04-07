type HttpStatusCode = number;
class ApiResponse<T>{
    statusCode: HttpStatusCode;
    data: T;
    message: string;
    success: boolean;
    constructor(statusCode:HttpStatusCode, data:T,message:string="Success"){
        this.statusCode = statusCode;
        this.data=data;
        this.message=message;
        this.success=statusCode < 400;
    }
}

export {ApiResponse}