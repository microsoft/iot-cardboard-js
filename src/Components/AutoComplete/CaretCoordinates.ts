/* jshint browser: true */

// https://github.com/component/textarea-caret-position

// The properties that we copy into a mirrored div.
// Note that some browsers, such as Firefox,
// do not concatenate properties, i.e. padding-top, bottom etc. -> padding,
// so we have to do every single property specifically.
const properties = [
    'direction', // RTL support
    'boxSizing',
    'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY', // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration', // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing'
];

export function CaretCoordinates(element) {
    this.element = element;

    // mirrored div
    this.div = document.createElement('div');
    // this.div.id = 'input-textarea-caret-position-mirror-div';
    element.parentNode.insertBefore(this.div, element);

    const style = this.div.style;
    this.computed = window.getComputedStyle
        ? getComputedStyle(element)
        : element.currentStyle; // currentStyle for IE < 9

    // default textarea styles
    style.whiteSpace = 'pre-wrap';
    if (element.nodeName !== 'INPUT') {
        style.wordWrap = 'break-word'; // only for textarea-s
    }

    // position off-screen
    style.position = 'absolute'; // required to return coordinates properly
    style.visibility = 'hidden'; // not 'display: none' because we want rendering

    // transfer the element's properties to the div
    for (const prop of properties) {
        style[prop] = this.computed[prop];
    }

    style.overflow = 'hidden'; // for Chrome to not render a scrollbar; IE keeps overflowY = 'scroll'

    this.divText = document.createTextNode('');
    this.div.appendChild(this.divText);
    this.span = document.createElement('span');
    this.spanText = document.createTextNode('');
    this.span.appendChild(this.spanText);
    this.div.appendChild(this.span);
}

CaretCoordinates.prototype.get = function (positionLeft) {
    // , positionRight) {
    // calculate left offset
    this.divText.nodeValue = this.element.value.substring(0, positionLeft);

    // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
    if (this.element.nodeName === 'INPUT') {
        this.divText.nodeValue = this.divText.nodeValue.replace(
            /\s/g,
            '\u00a0'
        );
    }

    // Wrapping must be replicated *exactly*, including when a long word gets
    // onto the next line, with whitespace at the end of the line before (#7).
    // The  *only* reliable way to do that is to copy the *entire* rest of the
    // textarea's content into the <span> created at the caret position.
    // for inputs, just '.' would be enough, but why bother?
    // this.spanText.nodeValue = this.element.value.substring(positionLeft) || '.';  // || because a completely empty faux span doesn't render at all

    const left =
        this.span.offsetLeft + parseInt(this.computed['borderLeftWidth'], 10);

    // *** CALCULATING RIGHT OFFSET MESSES UP TOP CALCULATION FOR SCROLLED TEXT AREAS ***

    // calculate right offset
    // this.divText.nodeValue = this.element.value.substring(0, positionRight);

    // the second special handling for input type="text" vs textarea: spaces need to be replaced with non-breaking spaces - http://stackoverflow.com/a/13402035/1269037
    if (this.element.nodeName === 'INPUT') {
        this.divText.nodeValue = this.divText.nodeValue.replace(
            /\s/g,
            '\u00a0'
        );
    }

    // this.spanText.nodeValue = this.element.value.substring(positionRight) || '.';  // || because a completely empty faux span doesn't render at all
    // var right = this.span.offsetLeft + parseInt(this.computed['borderLeftWidth'], 10);

    // special case where right position is not be calculated correctly (full line selected)
    // if (right <= left) {
    //   right = this.div.offsetWidth + parseInt(this.computed['borderLeftWidth'], 10);
    // }

    const coordinates = {
        top:
            this.span.offsetTop + parseInt(this.computed['borderTopWidth'], 10),
        left: left
        // right: right
    };

    // *** Adjust if text area is scrolling ***
    coordinates.left = coordinates.left - (this.element.scrollLeft || 0);
    coordinates.top = coordinates.top - (this.element.scrollTop || 0);

    return coordinates;
};
