function clickFunction(event) {
    var tgt = event.target;
    console.log(nextChild(tgt));
    // nextChild(tgt).style.backgroundColor = '#' + Math.random().toString(16).substr(-6);
    $(nextChild(tgt)).fadeIn(300, reset(nextChild(tgt)));
    // $(nextChild(tgt)).fadeIn(300, this.fadeOut(300))
}

function reset(node) {
    $(node).fadeOut(300);
}

function nextChild(node) {
    if (node.children.length > 0) { //has children
        return node.children[0];
    }
    else if (node.nextElementSibling == null) { //no siblings, no children
        node = node.parentElement;
        console.log(node)
        while (node.children.length < 2) {
            node = node.parentElement;
        }
        return node.nextElementSibling;
    }
    else {
        return node.nextElementSibling;
    }
    // var children = node.children;
    // if (children.length > 0) {
    //     return children[0];
    // }
    // else if (node.nextElementSibling != null) {
    //     return node.nextElementSibling;
    // }
    // else if (node.parentElement.nextElementSibling != null) {
    //     return node.parentElement.nextElementSibling;
    // }
    // else {
    //     return node.parentElement.parentElement;
    // }
}
