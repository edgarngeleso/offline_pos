/**
 * 
 * @param {*} needle item to be searched
 * @param {*} haystack collection/array of items
 * @returns an array with true and index values eg [true,0] if found else false
 */
export const inArray = (needle,haystack)=>{
    for (let index = 0; index < haystack.length; index++) {
        if(needle == haystack[index]){
            return [true,index];
        }
        
    }
    return false;
}