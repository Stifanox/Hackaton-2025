const mapObjectToQueryParams = (queryParams:object):string => {

    let query = "?"
    Object.entries(queryParams).forEach(([key, value], index) => {
        if(index === 0){
            query += `${key[0] + key.slice(1)}=${encodeURIComponent(value)}`
            return
        }
        query += `&${key[0] + key.slice(1)}=${encodeURIComponent(value)}`
    })
    return query
}

export {mapObjectToQueryParams}