export function isAValidDate(date){
    try{
        const ValidDate=new Date(date)
        if(ValidDate instanceof Date &&isNaN(ValidDate)){
            return false;
        };
        const dateTime=ValidDate.getTime();
        const todayTime=new Date().getTime();
        if(dateTime>todayTime){
            return false
        }
        return true;
    }
    catch(err){
        return false
    }
}