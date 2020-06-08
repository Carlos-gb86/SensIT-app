

export const toogleFileTreeFolder = (event) => {

    const folder = event.target.closest('button.dir');

    if (folder) {

        const branch = folder.nextElementSibling;

        if (!event.target.classList.contains('tree-cb')) {

            folder.children[0].classList.toggle('fa-caret-right');
            folder.children[0].classList.toggle('fa-caret-down');
            folder.children[2].children[0].classList.toggle('fa-folder');
            folder.children[2].children[0].classList.toggle('fa-folder-open');
            branch.classList.toggle('hide-indent');
        }

        if (event.target.classList.contains('tree-cb')) {
            const clickedBox = event.target;
            const childrenBoxes = branch.querySelectorAll('.tree-cb');
            childrenBoxes.forEach(element => {
                if (clickedBox.checked === true) {
                    element.checked = true;
                } else {
                    element.checked = false;
                }

            });
        }

    }


}