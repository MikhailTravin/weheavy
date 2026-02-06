const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout((() => {
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = "";
            }));
            document.body.style.paddingRight = "";
            document.documentElement.classList.remove("lock");
        }), delay);
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
let bodyLock = (delay = 500) => {
    if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement => {
            lockPaddingElement.style.paddingRight = lockPaddingValue;
        }));
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.classList.add("lock");
        bodyLockStatus = false;
        setTimeout((function () {
            bodyLockStatus = true;
        }), delay);
    }
};
function functions_FLS(message) {
    setTimeout((() => {
        if (window.FLS) console.log(message);
    }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout((() => {
            target.hidden = !showmore ? true : false;
            !showmore ? target.style.removeProperty("height") : null;
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            !showmore ? target.style.removeProperty("overflow") : null;
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideUpDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
        target.classList.add("_slide");
        target.hidden = target.hidden ? false : null;
        showmore ? target.style.removeProperty("height") : null;
        let height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        window.setTimeout((() => {
            target.style.removeProperty("height");
            target.style.removeProperty("overflow");
            target.style.removeProperty("transition-duration");
            target.style.removeProperty("transition-property");
            target.classList.remove("_slide");
            document.dispatchEvent(new CustomEvent("slideDownDone", {
                detail: {
                    target
                }
            }));
        }), duration);
    }
};
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
    if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
    const media = Array.from(array).filter(function (item) {
        return item.dataset[dataSetValue];
    });

    if (media.length) {
        const breakpointsArray = media.map(item => {
            const params = item.dataset[dataSetValue];
            const paramsArray = params.split(",");
            return {
                value: paramsArray[0],
                type: paramsArray[1] ? paramsArray[1].trim() : "max",
                item: item
            };
        });

        const mdQueries = uniqArray(
            breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
        );

        const mdQueriesArray = mdQueries.map(breakpoint => {
            const [query, value, type] = breakpoint.split(",");
            const matchMedia = window.matchMedia(query);
            const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
            return { itemsArray, matchMedia };
        });

        return mdQueriesArray;
    }
}

function uniqArray(array) {
    return array.filter(function (item, index, self) {
        return self.indexOf(item) === index;
    });
}

//========================================================================================================================================================

//Попап
class Popup {
    constructor(options) {
        let config = {
            logging: true,
            init: true,
            attributeOpenButton: "data-popup",
            attributeCloseButton: "data-close",
            fixElementSelector: "[data-lp]",
            youtubeAttribute: "data-popup-youtube",
            youtubePlaceAttribute: "data-popup-youtube-place",
            setAutoplayYoutube: true,
            classes: {
                popup: "popup",
                popupContent: "popup__content",
                popupActive: "popup_show",
                bodyActive: "popup-show"
            },
            focusCatch: true,
            closeEsc: true,
            bodyLock: true,
            hashSettings: {
                goHash: true
            },
            on: {
                beforeOpen: function () { },
                afterOpen: function () { },
                beforeClose: function () { },
                afterClose: function () { }
            }
        };
        this.youTubeCode;
        this.isOpen = false;
        this.targetOpen = {
            selector: false,
            element: false
        };
        this.previousOpen = {
            selector: false,
            element: false
        };
        this.lastClosed = {
            selector: false,
            element: false
        };
        this._dataValue = false;
        this.hash = false;
        this._reopen = false;
        this._selectorOpen = false;
        this.lastFocusEl = false;
        this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
        this.options = {
            ...config,
            ...options,
            classes: {
                ...config.classes,
                ...options?.classes
            },
            hashSettings: {
                ...config.hashSettings,
                ...options?.hashSettings
            },
            on: {
                ...config.on,
                ...options?.on
            }
        };
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null;
    }
    initPopups() {
        this.eventsPopup();
    }
    eventsPopup() {
        document.addEventListener("click", function (e) {
            const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
            if (buttonOpen) {
                e.preventDefault();
                this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                if ("error" !== this._dataValue) {
                    if (!this.isOpen) this.lastFocusEl = buttonOpen;
                    this.targetOpen.selector = `${this._dataValue}`;
                    this._selectorOpen = true;
                    this.open();
                    return;
                }
                return;
            }
            const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
            if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
        }.bind(this));
        document.addEventListener("keydown", function (e) {
            if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
                e.preventDefault();
                this.close();
                return;
            }
            if (this.options.focusCatch && 9 == e.which && this.isOpen) {
                this._focusCatch(e);
                return;
            }
        }.bind(this));
        if (this.options.hashSettings.goHash) {
            window.addEventListener("hashchange", function () {
                if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
            }.bind(this));
            window.addEventListener("load", function () {
                if (window.location.hash) this._openToHash();
            }.bind(this));
        }
    }
    open(selectorValue) {
        if (bodyLockStatus) {
            this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
            if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
                this.targetOpen.selector = selectorValue;
                this._selectorOpen = true;
            }
            if (this.isOpen) {
                this._reopen = true;
                this.close();
            }
            if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
            if (!this._reopen) this.previousActiveElement = document.activeElement;
            this.targetOpen.element = document.querySelector(this.targetOpen.selector);
            if (this.targetOpen.element) {
                if (this.youTubeCode) {
                    const codeVideo = this.youTubeCode;
                    const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                    const iframe = document.createElement("iframe");
                    iframe.setAttribute("allowfullscreen", "");
                    const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                    iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                    iframe.setAttribute("src", urlVideo);
                    if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                        this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                    }
                    this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                }
                const videoElement = this.targetOpen.element.querySelector("video");
                if (videoElement) {
                    videoElement.muted = true;
                    videoElement.currentTime = 0;
                    videoElement.play().catch((e => console.error("Autoplay error:", e)));
                }
                if (this.options.hashSettings.location) {
                    this._getHash();
                    this._setHash();
                }
                this.options.on.beforeOpen(this);
                document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
                this.targetOpen.element.classList.add(this.options.classes.popupActive);
                document.documentElement.classList.add(this.options.classes.bodyActive);
                if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                this.targetOpen.element.setAttribute("aria-hidden", "false");
                this.previousOpen.selector = this.targetOpen.selector;
                this.previousOpen.element = this.targetOpen.element;
                this._selectorOpen = false;
                this.isOpen = true;
                this.options.on.afterOpen(this);
                document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                    detail: {
                        popup: this
                    }
                }));
            }
        }
    }
    close(selectorValue) {
        if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
        if (!this.isOpen || !bodyLockStatus) return;
        this.options.on.beforeClose(this);
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
            detail: {
                popup: this
            }
        }));
        if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
        this.previousOpen.element.classList.remove(this.options.classes.popupActive);
        const videoElement = this.previousOpen.element.querySelector("video");
        if (videoElement) videoElement.pause();
        this.previousOpen.element.setAttribute("aria-hidden", "true");
        if (!this._reopen) {
            document.documentElement.classList.remove(this.options.classes.bodyActive);
            !this.bodyLock ? bodyUnlock() : null;
            this.isOpen = false;
        }
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
            detail: {
                popup: this
            }
        }));
    }
    _getHash() {
        if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
    }
    _openToHash() {
        let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
        const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
        if (buttons && classInHash) this.open(classInHash);
    }
    _setHash() {
        history.pushState("", "", this.hash);
    }
    _removeHash() {
        history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);
        if (e.shiftKey && 0 === focusedIndex) {
            focusArray[focusArray.length - 1].focus();
            e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
            focusArray[0].focus();
            e.preventDefault();
        }
    }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
    bodyLock();
    document.documentElement.classList.add("menu-open");
}
function menuClose() {
    bodyUnlock();
    document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
    document.body.addEventListener("focusin", function (e) {
        const targetElement = e.target;
        if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
            if (!targetElement.hasAttribute('data-no-focus-classes')) {
                targetElement.classList.add('_form-focus');
                targetElement.parentElement.classList.add('_form-focus');
            }
            formValidate.removeError(targetElement);
            targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
        }
    });
    document.body.addEventListener("focusout", function (e) {
        const targetElement = e.target;
        if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
            if (!targetElement.hasAttribute('data-no-focus-classes')) {
                targetElement.classList.remove('_form-focus');
                targetElement.parentElement.classList.remove('_form-focus');
            }
            targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;
        }
    });
    if (options.viewPass) {
        document.addEventListener("click", function (e) {
            const targetElement = e.target;
            if (targetElement.closest('.form__viewpass')) {
                const viewpassBlock = targetElement.closest('.form__viewpass');
                const input = viewpassBlock.closest('.form__input').querySelector('input');

                if (input) {
                    const isActive = viewpassBlock.classList.contains('_viewpass-active');
                    input.setAttribute("type", isActive ? "password" : "text");
                    viewpassBlock.classList.toggle('_viewpass-active');
                } else {
                    console.error('Input не найден!');
                }
            }
        });
    }
    if (options.autoHeight) {
        const textareas = document.querySelectorAll('textarea[data-autoheight]');
        if (textareas.length) {
            textareas.forEach(textarea => {
                const startHeight = textarea.hasAttribute('data-autoheight-min') ?
                    Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
                    Number(textarea.dataset.autoheightMax) : Infinity;
                setHeight(textarea, Math.min(startHeight, maxHeight))
                textarea.addEventListener('input', () => {
                    if (textarea.scrollHeight > startHeight) {
                        textarea.style.height = `auto`;
                        setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                    }
                });
            });
            function setHeight(textarea, height) {
                textarea.style.height = `${height}px`;
            }
        }
    }
}
formFieldsInit({
    viewPass: true,
    autoHeight: false
});
let formValidate = {
    getErrors(form) {
        let error = 0;
        let formRequiredItems = form.querySelectorAll('*[data-required]');
        if (formRequiredItems.length) {
            formRequiredItems.forEach(formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
                    error += this.validateInput(formRequiredItem);
                }
            });
        }
        return error;
    },
    validateInput(formRequiredItem) {
        let error = 0;

        if (formRequiredItem.dataset.required === "email") {
            formRequiredItem.value = formRequiredItem.value.replace(" ", "");
            if (this.emailTest(formRequiredItem)) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else {
                this.removeError(formRequiredItem);
                this.addSuccess(formRequiredItem);
            }
        } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
            this.addError(formRequiredItem);
            this.removeSuccess(formRequiredItem);
            error++;
        } else if (formRequiredItem.dataset.validate === "password-confirm") {
            // Проверяем, совпадает ли пароль с полем #password
            const passwordInput = document.getElementById('password');
            if (!passwordInput) return error;

            if (formRequiredItem.value !== passwordInput.value) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else {
                this.removeError(formRequiredItem);
                this.addSuccess(formRequiredItem);
            }
        } else {
            if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                this.removeSuccess(formRequiredItem);
                error++;
            } else {
                this.removeError(formRequiredItem);
                this.addSuccess(formRequiredItem);
            }
        }

        return error;
    },
    addError(formRequiredItem) {
        formRequiredItem.classList.add('_form-error');
        formRequiredItem.parentElement.classList.add('_form-error');
        let inputError = formRequiredItem.parentElement.querySelector('.form__error');
        if (inputError) formRequiredItem.parentElement.removeChild(inputError);
        if (formRequiredItem.dataset.error) {
            formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        }
    },
    removeError(formRequiredItem) {
        formRequiredItem.classList.remove('_form-error');
        formRequiredItem.parentElement.classList.remove('_form-error');
        if (formRequiredItem.parentElement.querySelector('.form__error')) {
            formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
        }
    },
    addSuccess(formRequiredItem) {
        formRequiredItem.classList.add('_form-success');
        formRequiredItem.parentElement.classList.add('_form-success');
    },
    removeSuccess(formRequiredItem) {
        formRequiredItem.classList.remove('_form-success');
        formRequiredItem.parentElement.classList.remove('_form-success');
    },
    formClean(form) {
        form.reset();
        setTimeout(() => {
            let inputs = form.querySelectorAll('input,textarea');
            for (let index = 0; index < inputs.length; index++) {
                const el = inputs[index];
                el.parentElement.classList.remove('_form-focus');
                el.classList.remove('_form-focus');
                formValidate.removeError(el);
            }
            let checkboxes = form.querySelectorAll('.checkbox__input');
            if (checkboxes.length > 0) {
                for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
            }
            if (flsModules.select) {
                let selects = form.querySelectorAll('div.select');
                if (selects.length) {
                    for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector('select');
                        flsModules.select.selectBuild(select);
                    }
                }
            }
        }, 0);
    },
    emailTest(formRequiredItem) {
        return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
    }
};
function formSubmit() {
    const forms = document.forms;
    if (forms.length) {
        for (const form of forms) {
            form.addEventListener('submit', function (e) {
                const form = e.target;
                formSubmitAction(form, e);
            });
            form.addEventListener('reset', function (e) {
                const form = e.target;
                formValidate.formClean(form);
            });
        }
    }
    async function formSubmitAction(form, e) {
        const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
        if (error === 0) {
            const ajax = form.hasAttribute('data-ajax');
            if (ajax) {
                e.preventDefault();
                const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
                const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
                const formData = new FormData(form);

                form.classList.add('_sending');
                const response = await fetch(formAction, {
                    method: formMethod,
                    body: formData
                });
                if (response.ok) {
                    let responseResult = await response.json();
                    form.classList.remove('_sending');
                    formSent(form, responseResult);
                } else {
                    alert("Помилка");
                    form.classList.remove('_sending');
                }
            } else if (form.hasAttribute('data-dev')) {
                e.preventDefault();
                formSent(form);
            }
        } else {
            e.preventDefault();
            if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
                const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
                gotoBlock(formGoToErrorClass, true, 1000);
            }
        }
    }
    function formSent(form, responseResult = ``) {
        document.dispatchEvent(new CustomEvent("formSent", {
            detail: {
                form: form
            }
        }));
        setTimeout(() => {
            if (flsModules.popup) {
                const popup = form.dataset.popupMessage;
                popup ? flsModules.popup.open(popup) : null;
            }
        }, 0);
        formValidate.formClean(form);
        formLogging(`Форма отправлена!`);
    }
    function formLogging(message) {
        FLS(`[Форма]: ${message}`);
    }
}
formSubmit()

//========================================================================================================================================================

//Маска телефона
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
    Inputmask({
        "mask": "+7 (999) 999 - 99 - 99",
        "showMaskOnHover": false,
    }).mask(telephone);
}

//========================================================================================================================================================

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 0) {
            header.classList.add('_header-scroll');
        } else {
            header.classList.remove('_header-scroll');
        }
    });
}

//========================================================================================================================================================

if (document.querySelector('.block-quiz__slider')) {
    let swiperQuiz = null;
    let selectedAnswers = [];
    let timerInterval = null;

    function startTimer() {
        const timerElement = document.querySelector('.block-quiz-timer__timer');
        if (!timerElement) return;

        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        const timeData = timerElement.dataset.time;
        let timeLeft;

        if (timeData === '5min') {
            timeLeft = 5 * 60;
        } else if (timeData.includes(':')) {
            const [minutes, seconds] = timeData.split(':').map(Number);
            timeLeft = minutes * 60 + seconds;
        } else {
            timeLeft = parseInt(timeData) || 300;
        }

        function updateTimer() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                return;
            }

            timeLeft--;
        }

        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function resetTimer() {
        const timerElement = document.querySelector('.block-quiz-timer__timer');
        if (!timerElement) return;

        const timeData = timerElement.dataset.time;
        let initialTime;

        if (timeData === '5min') {
            initialTime = '5:00';
        } else if (timeData.includes(':')) {
            initialTime = timeData;
        } else {
            const seconds = parseInt(timeData) || 300;
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            initialTime = `${minutes}:${secs.toString().padStart(2, '0')}`;
        }

        timerElement.textContent = initialTime;
    }

    function updateQuizFraction() {
        if (!swiperQuiz) return;

        const currentSlideIndex = swiperQuiz.activeIndex;
        const totalQuestions = 5;
        const fraction = document.querySelector('.block-quiz__fraction');

        if (fraction) {
            if (currentSlideIndex === 5) {
                fraction.textContent = `${totalQuestions} / ${totalQuestions}`;
            }
            else {
                fraction.textContent = `${currentSlideIndex} / ${totalQuestions}`;
            }
        }
    }

    function updateProgressBar() {
        if (!swiperQuiz) return;

        const currentSlideIndex = swiperQuiz.activeIndex;
        const totalQuestions = 5;
        const progressFill = document.querySelector('.swiper-pagination-progressbar-fill');

        if (progressFill) {
            let widthPercentage;

            if (currentSlideIndex === 0) {
                widthPercentage = 0;
            } else if (currentSlideIndex === 5) {
                widthPercentage = 100;
            } else {
                widthPercentage = (currentSlideIndex / totalQuestions) * 100;
            }

            progressFill.style.width = `${widthPercentage}%`;
            progressFill.style.transform = `translate3d(0px, 0px, 0px) scaleX(1) scaleY(1)`;
        }
    }

    function forceZeroProgressBar() {
        const progressFill = document.querySelector('.swiper-pagination-progressbar-fill');
        if (progressFill) {
            progressFill.style.transition = 'none !important';

            const currentTransform = progressFill.style.transform;
            const currentWidth = progressFill.style.width;

            progressFill.setAttribute('style',
                'transform: translate3d(0px, 0px, 0px) scaleX(0) scaleY(1) !important; ' +
                'width: 0% !important; ' +
                'transition: none !important;'
            );

            void progressFill.offsetWidth;

            progressFill.style.transition = '';
            if (swiperQuiz && swiperQuiz.activeIndex === 0) {
                progressFill.style.transform = 'translate3d(0px, 0px, 0px) scaleX(0) scaleY(1)';
                progressFill.style.width = '0%';
            }
        }
    }

    function restoreSelectedAnswers() {
        if (!swiperQuiz) return;

        const currentSlideIndex = swiperQuiz.activeIndex;
        const slides = document.querySelectorAll('.block-quiz__slide');

        if (currentSlideIndex === 5) {
            return;
        }

        const slide = slides[currentSlideIndex];
        const allOptions = slide.querySelectorAll('.block-quiz__image');
        allOptions.forEach(opt => {
            opt.classList.remove('active');
        });

        if (selectedAnswers[currentSlideIndex]) {
            const savedAnswer = selectedAnswers[currentSlideIndex].answer;

            allOptions.forEach(option => {
                const textElement = option.querySelector('.block-quiz__text');
                if (textElement) {
                    const cloneText = textElement.cloneNode(true);
                    const spanElements = cloneText.querySelectorAll('span');
                    spanElements.forEach(span => span.remove());
                    const optionText = cloneText.textContent.trim();

                    if (optionText === savedAnswer) {
                        option.classList.add('active');
                    }
                }
            });
        }
    }

    function updateLastSlideOptions() {
        const options = document.querySelectorAll('.block-quiz-last__option');

        options.forEach((option, index) => {
            const textElement = option.querySelector('.block-quiz-last__text');

            if (textElement && selectedAnswers[index]) {
                const svgHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="option-card__icon">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.7713 5.71076C16.0691 5.99865 16.0771 6.47345 15.7892 6.77127L8.53924 14.2713C8.39611 14.4193 8.1984 14.502 7.99248 14.5C7.78655 14.4979 7.59054 14.4112 7.45041 14.2603L4.20041 10.7603C3.91856 10.4568 3.93613 9.98226 4.23966 9.7004C4.5432 9.41855 5.01775 9.43613 5.2996 9.73966L8.01095 12.6596L14.7108 5.72873C14.9987 5.43092 15.4735 5.42287 15.7713 5.71076Z" fill="#A33D3D"></path>
                </svg>
            `;

                textElement.innerHTML = svgHTML + ' ' + selectedAnswers[index].answer;

            } else if (textElement && !selectedAnswers[index]) {
                textElement.textContent = '';
            }
        });
    }

    function resetQuiz() {
        if (swiperQuiz) {
            swiperQuiz.slideTo(0, 0);

            selectedAnswers = [];

            stopTimer();
            resetTimer();

            updateQuizFraction();
            forceZeroProgressBar();
            updateLastSlideOptions();

            document.querySelectorAll('.block-quiz__image.active').forEach(el => {
                el.classList.remove('active');
            });

            setTimeout(() => {
                forceZeroProgressBar();
            }, 100);
        }
    }

    swiperQuiz = new Swiper('.block-quiz__slider', {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 10,
        speed: 200,
        allowTouchMove: false,
        simulateTouch: false,
        initialSlide: 0,
        pagination: {
            el: '.block-quiz__pagination',
            type: 'progressbar',
            clickable: false,
        },
        on: {
            slideChange: function () {
                updateQuizFraction();
                restoreSelectedAnswers();
                updateProgressBar();

                if (this.activeIndex === 5) {
                    startTimer();
                } else {
                    stopTimer();
                    resetTimer();
                }
            },
            init: function () {
                updateQuizFraction();
                setTimeout(() => {
                    forceZeroProgressBar();
                }, 100);
            }
        }
    });

    document.querySelector('.block-quiz__back')?.addEventListener('click', function () {
        if (!swiperQuiz) return;

        const currentSlideIndex = swiperQuiz.activeIndex;

        if (currentSlideIndex === 0) {
            document.documentElement.classList.remove('open-quiz');
        }
        else if (currentSlideIndex > 0) {
            swiperQuiz.slidePrev();
        }
    });

    document.querySelectorAll('.block-quiz__image').forEach((imageOption) => {
        imageOption.addEventListener('click', function () {
            if (!swiperQuiz) return;

            const currentSlideIndex = swiperQuiz.activeIndex;
            const slides = document.querySelectorAll('.block-quiz__slide');
            const slide = slides[currentSlideIndex];

            if (currentSlideIndex === 5) {
                return;
            }

            const textElement = this.querySelector('.block-quiz__text');
            let answerText = '';

            if (textElement) {
                const cloneText = textElement.cloneNode(true);
                const spanElements = cloneText.querySelectorAll('span');
                spanElements.forEach(span => span.remove());
                answerText = cloneText.textContent.trim();
            }

            const questionTitle = slide.querySelector('.block-quiz__title')?.textContent || `Вопрос ${currentSlideIndex + 1}`;

            selectedAnswers[currentSlideIndex] = {
                question: questionTitle,
                answer: answerText
            };

            updateLastSlideOptions();

            const allOptions = slide.querySelectorAll('.block-quiz__image');
            allOptions.forEach(opt => {
                opt.classList.remove('active');
            });

            this.classList.add('active');

            if (currentSlideIndex < slides.length - 1) {
                setTimeout(() => {
                    if (swiperQuiz) {
                        swiperQuiz.slideNext();
                    }
                }, 300);
            }
        });
    });

    const chooseBtn = document.querySelector('.choose-btn');
    if (chooseBtn) {
        chooseBtn.addEventListener('click', function (e) {
            e.preventDefault();

            resetQuiz();

            document.documentElement.classList.add('open-quiz');

            setTimeout(() => {
                forceZeroProgressBar();
            }, 150);
        });
    }
}

if (document.querySelector('.block-intro-brands__slider')) {
    const slider = document.querySelector('.block-intro-brands__slider');
    const wrapper = document.querySelector('.block-intro-brands__wrapper');
    const slides = document.querySelectorAll('.block-intro-brands__slide');

    for (let i = 0; i < 6; i++) {
        const clones = [];

        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            clones.push(clone);
        });

        clones.forEach(clone => {
            wrapper.appendChild(clone);
        });
    }

    let position = 0;
    let animationId;
    const speed = 0.5;

    function animate() {
        position -= speed;

        const wrapperWidth = wrapper.scrollWidth / 2;
        if (Math.abs(position) >= wrapperWidth) {
            position = 0;
        }

        wrapper.style.transform = `translateX(${position}px)`;
        animationId = requestAnimationFrame(animate);
    }

    animate();

    slider.addEventListener('mouseenter', () => {
        cancelAnimationFrame(animationId);
    });

    slider.addEventListener('mouseleave', () => {
        animate();
    });
}