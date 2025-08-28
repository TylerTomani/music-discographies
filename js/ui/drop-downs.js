const dropDowns = document.querySelectorAll('.drop-down')

dropDowns.forEach(el => {
    el.addEventListener('click', handleDropDowns)
})
function handleDropDowns(e){
    console.log(e)
}