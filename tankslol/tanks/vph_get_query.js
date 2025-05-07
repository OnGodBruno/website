function get_query(name) {
    const urlParams = new URLSearchParams(window.location.search)
    const value = urlParams.get(name)


    // Return null if id is invalid or not present
    if (value === null || value == ""){
        return "noroom"
    }

    return value
}
