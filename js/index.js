
function getTopicsContainer(parent){
    if(parent.classList.contains('.topics-container') || parent.classList.contains('.items-container')){
        return parent
    } else if (parent.parentElement){
        return getTopicsContainer(parent.parentElement)
    } else {
        return null
    }
}