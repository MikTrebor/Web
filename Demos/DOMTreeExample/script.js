function clickFunction() {
    console.log(event);
    var tgt = event.target;
    var children = tgt.childNodes;
    console.log(children);
}
