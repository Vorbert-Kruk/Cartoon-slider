const sliderInput = document.querySelector('.slider-container > input[type=\'range\']');
const adventureSlider = document.querySelector('.adventure-slider');
const adventureThumb = document.querySelector('.adventure-slider > .thumb');
const changeEvent = new Event('change');
const sliderRange = sliderInput.getAttribute('max') - sliderInput.getAttribute('min') || 100;
const sliderMinValue = sliderInput.getAttribute('min') || 0;
const sliderValueOutput = document.querySelector('h2.adventure-header');

HTMLElement.prototype.setProperty = function(propertyName, propertyValue) {
    this.style.setProperty(propertyName, propertyValue);
};

HTMLElement.prototype.getPropertyValue = function(propertyName) {
    return getComputedStyle(this)[propertyName];
};

String.prototype.withoutPx = function() {
    return Number(this.substring(0, this.indexOf('px')));
};

const adventureThumbOffset = adventureThumb.getPropertyValue('width').withoutPx() * .5;

const getVariableValue = variableName => getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`);

const setVariableValue = (variableName, variableValue) =>  document.documentElement.style.setProperty(`--${variableName}`, variableValue);

const getSliderFullfillness = mousePositionX => 
    100 - ((mousePositionX - adventureSlider.getBoundingClientRect().left) /
    (adventureSlider.getBoundingClientRect().width - adventureThumbOffset) * 100);

const setInputValue = currentFullfillness => {
    sliderInput.value = Math.floor((100 - currentFullfillness) / 100 * sliderRange) + Number(sliderMinValue)
    sliderInput.dispatchEvent(changeEvent);
};
adventureThumb.addEventListener("dragstart", e => {
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
});
adventureThumb.addEventListener('drag', e => {
    e.preventDefault();
    adventureThumb.classList.add('active');
    if(e.clientX <= adventureSlider.getBoundingClientRect().right - adventureThumbOffset && e.clientX >= adventureSlider.getBoundingClientRect().left)
    {
        setVariableValue('overlay-size', `${getSliderFullfillness(e.clientX)}`);
        setInputValue(Math.floor(getSliderFullfillness(e.clientX)));
    }
});
sliderInput.addEventListener('change', e => {
    sliderValueOutput.innerHTML = e.target.value;
});
adventureSlider.addEventListener('dragend', () => 
    adventureThumb.classList.remove('active')
);

setInputValue(100);