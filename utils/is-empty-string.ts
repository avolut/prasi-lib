export const isEmptyString = (data: any) => {
    if(typeof data === 'string'){
        return data.trim() === '' || data === "" || !data
    }
    return typeof data === "undefined"
}