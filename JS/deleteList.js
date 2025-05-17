const delButton = document.querySelectorAll(".remove-button");

delButton.forEach(
    value=>{
        value.addEventListener('click',()=>{
            const listId = value.dataset.del;
            fetch(`/PlayList/Delete/${listId}`,{
                method:"DELETE",
            })
        })
    }
)
