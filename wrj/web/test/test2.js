import {
    NavigationPredictor,
    PageCallbackRouter,
    PageHandler,
    SelectionLineState,
    SideType
} from "chrome://resources/cr_components/omnibox/omnibox.mojom-webui.js";
import {
    $ as $$,
    a as assertNotReached,
    A as Action,
    b as assert,
    B as BrowserCommandProxy,
    c as skColorToRgba,
    C as Command,
    d as decodeString16$1,
    E as EventTracker,
    e as strictQuery,
    F as FocusOutlineManager,
    f as recordVoiceAction,
    g as getFaviconForPageURL,
    h as hasKeyModifiers,
    H as HelpBubbleMixin,
    i as recordLoadDuration,
    j as hexColorToSkColor,
    k as CustomizeDialogPage,
    m as mojoString16,
    N as NewTabPageProxy,
    r as recordDuration,
    s as sanitizeInnerHtml,
    W as WindowProxy
} from "./shared.rollup.js";
import {html, PolymerElement} from "chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js";
import {loadTimeData} from "chrome://resources/js/load_time_data.js";
import {mojo} from "chrome://resources/mojo/mojo/public/js/bindings.js";
import {TimeDeltaSpec} from "chrome://resources/mojo/mojo/public/mojom/base/time.mojom-webui.js";
import "./strings.m.js";
import {
    CustomizeChromeSection,
    DoodleImageType,
    DoodleShareChannel,
    IphFeature,
    NtpBackgroundImageSource
} from "./new_tab_page.mojom-webui.js";
import {
    PageCallbackRouter as PageCallbackRouter$1,
    PageHandler as PageHandler$1
} from "chrome://resources/cr_components/color_change_listener/color_change_listener.mojom-webui.js";

export {
    l as CrAutoImgElement,
    I as IframeElement,
    x as VoiceError,
    q as checkTransparency,
    w as createScrollBorders,
    t as isBMP,
    u as isPNG,
    v as isWebP,
    p as processFile,
    n as recordOccurence,
    o as recordPerdecage
} from "./shared.rollup.js";

export {DomIf} from "chrome://resources/polymer/v3_0/polymer/polymer_bundled.min.js";
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let instance$4 = null;

class RealboxBrowserProxy {
    constructor() {
        this.handler = PageHandler.getRemote();
        this.callbackRouter = new PageCallbackRouter;
        this.handler.setPage(this.callbackRouter.$.bindNewPipeAndPassRemote())
    }

    static getInstance() {
        return instance$4 || (instance$4 = new RealboxBrowserProxy)
    }

    static setInstance(newInstance) {
        instance$4 = newInstance
    }
}

function getTemplate$7() {
    return html`<!--_html_template_start_-->
    <style>:host {
        align-items: center;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        width: 32px
    }

    #container {
        align-items: center;
        aspect-ratio: 1/1;
        border-radius: var(--cr-realbox-icon-border-radius, 8px);
        display: flex;
        justify-content: center;
        overflow: hidden;
        position: relative;
        width: 100%
    }

    :host-context(cr-realbox-match[has-image]) #container {
        background-color: var(--cr-realbox-icon-container-bg-color, var(--container-bg-color))
    }

    :host-context(cr-realbox-match[is-rich-suggestion]:not([has-image])) #container {
        background-color: var(--google-blue-600);
        border-radius: 50%;
        height: 24px;
        width: 24px
    }

    #image {
        display: none;
        height: 100%;
        object-fit: contain;
        width: 100%
    }

    :host-context(cr-realbox-match[has-image]) #image {
        display: initial
    }

    :host([is-answer]) #image {
        max-height: 24px;
        max-width: 24px
    }

    #imageOverlay {
        display: none
    }

    :host-context(cr-realbox-match[is-entity-suggestion][has-image]) #imageOverlay {
        background: #000;
        display: block;
        inset: 0;
        opacity: .05;
        position: absolute
    }

    #icon {
        -webkit-mask-position: center;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 16px;
        background-color: var(--color-realbox-search-icon-background);
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 16px;
        height: 24px;
        width: 24px
    }

    :host-context(cr-realbox-match[has-image]) #icon {
        display: none
    }

    :host-context(cr-realbox-match[is-rich-suggestion]) #icon {
        background-color: #fff
    }

    :host([in-searchbox][background-image*='//resources/cr_components/omnibox/icons/google_g.svg']) #icon {
        background-size: 24px
    }

    :host([in-searchbox][mask-image*='//resources/images/icon_search.svg']) #icon {
        -webkit-mask-size: 20px
    }</style>
    <div id="container" style="--container-bg-color:[[containerBgColor_(match.imageDominantColor, imageLoading_) ]]">
        <img id="image" src="[[imageSrc_]]" on-load="onImageLoad_">
        <div id="imageOverlay"></div>

        <div id="icon" style$="[[iconStyle_]]"></div>
    </div>
    <!--_html_template_end_-->`
}

// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const DOCUMENT_MATCH_TYPE = "document";
const HISTORY_CLUSTER_MATCH_TYPE = "history-cluster";
const PEDAL = "pedal";

class RealboxIconElement extends PolymerElement {
    static get is() {
        return "cr-realbox-icon"
    }

    static get template() {
        return getTemplate$7()
    }

    static get properties() {
        return {
            backgroundImage: {type: String, computed: `computeBackgroundImage_(match.*)`, reflectToAttribute: true},
            defaultIcon: {type: String, value: ""},
            inSearchbox: {type: Boolean, value: false, reflectToAttribute: true},
            isAnswer: {type: Boolean, computed: `computeIsAnswer_(match)`, reflectToAttribute: true},
            maskImage: {type: String, computed: `computeMaskImage_(match)`, reflectToAttribute: true},
            match: {type: Object},
            iconStyle_: {type: String, computed: `computeIconStyle_(backgroundImage, maskImage)`},
            imageSrc_: {
                type: String,
                computed: `computeImageSrc_(match.imageUrl, match)`,
                observer: "onImageSrcChanged_"
            },
            imageLoading_: {type: Boolean, value: false}
        }
    }

    computeBackgroundImage_() {
        if (this.match && !this.match.isSearchType) {
            if (this.match.type !== DOCUMENT_MATCH_TYPE && this.match.type !== HISTORY_CLUSTER_MATCH_TYPE && this.match.type !== PEDAL) {
                return getFaviconForPageURL(this.match.destinationUrl.url, false, "", 16, true)
            }
            if (this.match.type === DOCUMENT_MATCH_TYPE || this.match.type === PEDAL) {
                return `url(${this.match.iconUrl})`
            }
        }
        if (this.defaultIcon === "//resources/cr_components/omnibox/icons/google_g.svg") {
            return `url(${this.defaultIcon})`
        }
        return ""
    }

    computeIsAnswer_() {
        return this.match && !!this.match.answer
    }

    computeMaskImage_() {
        if (this.match && (!this.match.isRichSuggestion || !this.inSearchbox)) {
            return `url(${this.match.iconUrl})`
        } else {
            return `url(${this.defaultIcon})`
        }
    }

    computeIconStyle_() {
        if (this.backgroundImage) {
            return `background-image: ${this.backgroundImage};` + `background-color: transparent;`
        } else {
            return `-webkit-mask-image: ${this.maskImage};`
        }
    }

    computeImageSrc_() {
        const imageUrl = this.match?.imageUrl;
        if (!imageUrl) {
            return ""
        }
        if (imageUrl.startsWith("data:image/")) {
            return imageUrl
        }
        return `//image?staticEncode=true&encodeType=webp&url=${imageUrl}`
    }

    containerBgColor_(imageDominantColor, imageLoading) {
        return imageLoading && imageDominantColor ? `${imageDominantColor}40` : "transparent"
    }

    onImageSrcChanged_() {
        this.imageLoading_ = !!this.imageSrc_
    }

    onImageLoad_() {
        this.imageLoading_ = false
    }
}

customElements.define(RealboxIconElement.is, RealboxIconElement);

function getTemplate$6() {
    return html`<!--_html_template_start_-->
    <style import="cr-shared-style">:host {
        --action-height: 32px;
        border: solid 1px var(--google-grey-400);
        border-radius: calc(var(--action-height) / 2);
        display: flex;
        height: var(--action-height);
        min-width: 0;
        outline: 0;
        padding-inline-end: 16px;
        padding-inline-start: 12px
    }

    .contents {
        align-items: center;
        display: flex;
        min-width: 0
    }

    #action-icon {
        flex-shrink: 0;
        height: var(--cr-icon-size);
        width: var(--cr-icon-size)
    }

    #text {
        overflow: hidden;
        padding-inline-start: 8px;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    :host(:hover) {
        background-color: var(--action-bg-hovered, rgba(var(--google-grey-900-rgb), .1))
    }

    :host-context(.focus-outline-visible):host(:focus) {
        border: solid 1px transparent;
        box-shadow: inset 0 0 0 2px var(--google-blue-600)
    }</style>
    <div class="contents" title="[[tooltip_]]" on-click="onActionClick_" on-keydown="onActionKeyDown_">
        <img id="action-icon" src$="[[action.iconUrl]]">
        <div id="text" inner-h-t-m-l="[[hintHtml_]]"></div>
    </div>

    <!--_html_template_end_-->`
}

// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function decodeString16(str) {
    return str ? str.data.map((ch => String.fromCodePoint(ch))).join("") : ""
}

function mojoTimeTicks(timeTicks) {
    return {internalValue: BigInt(Math.floor(timeTicks * 1e3))}
}

function sideTypeToClass(sideType) {
    switch (sideType) {
        case SideType.kDefaultPrimary:
            return "primary-side";
        case SideType.kSecondary:
            return "secondary-side";
        default:
            assertNotReached("Unexpected side type")
    }
}

// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class RealboxActionElement extends PolymerElement {
    static get is() {
        return "cr-realbox-action"
    }

    static get template() {
        return getTemplate$6()
    }

    static get properties() {
        return {
            action: {type: Object},
            actionIndex: {type: Number, value: -1},
            matchIndex: {type: Number, value: -1},
            ariaLabel: {type: String, computed: `computeAriaLabel_(action)`, reflectToAttribute: true},
            hintHtml_: {type: String, computed: `computeHintHtml_(action)`},
            tooltip_: {type: String, computed: `computeTooltip_(action)`}
        }
    }

    onActionClick_(e) {
        this.dispatchEvent(new CustomEvent("execute-action", {
            bubbles: true,
            composed: true,
            detail: {event: e, actionIndex: this.actionIndex}
        }));
        e.preventDefault();
        e.stopPropagation()
    }

    onActionKeyDown_(e) {
        if (e.key && (e.key === "Enter" || e.key === " ")) {
            this.onActionClick_(e)
        }
    }

    computeAriaLabel_() {
        if (this.action.a11yLabel) {
            return decodeString16(this.action.a11yLabel)
        }
        return ""
    }

    computeHintHtml_() {
        if (this.action.hint) {
            return sanitizeInnerHtml(decodeString16(this.action.hint))
        }
        return window.trustedTypes.emptyHTML
    }

    computeTooltip_() {
        if (this.action.suggestionContents) {
            return decodeString16(this.action.suggestionContents)
        }
        return ""
    }
}

customElements.define(RealboxActionElement.is, RealboxActionElement);
const styleMod = document.createElement("dom-module");
styleMod.appendChild(html`
    <template>
        <style>
            .action-icon {
                --cr-icon-button-active-background-color: var(--color-new-tab-page-active-background);
                --cr-icon-button-fill-color: var(--color-realbox-results-icon);
                --cr-icon-button-focus-outline-color: var(--color-realbox-results-icon-focused-outline);
                --cr-icon-button-hover-background-color: var(--color-realbox-results-control-background-hovered);
                --cr-icon-button-icon-size: 16px;
                --cr-icon-button-margin-end: 0;
                --cr-icon-button-margin-start: 0;
                --cr-icon-button-size: 24px
            }
        </style>
    </template>
`.content);
styleMod.register("realbox-dropdown-shared-style");

function getTemplate$5() {
    return html`<!--_html_template_start_-->
    <style include="cr-hidden-style cr-icons realbox-dropdown-shared-style">:host {
        display: block;
        outline: 0
    }

    #action {
        margin-inline-end: 8px
    }

    .container {
        align-items: center;
        cursor: default;
        display: flex;
        overflow: hidden;
        padding-bottom: 6px;
        padding-inline-end: 16px;
        padding-inline-start: 12px;
        padding-top: 6px;
        position: relative
    }

    .container + .container {
        flex-direction: row;
        margin-inline-start: 40px;
        padding-top: 0;
        padding-bottom: 12px
    }

    .actions.inlined {
        flex-grow: 1;
        align-self: center;
        padding-top: 0;
        padding-bottom: 0
    }

    #contents, #description {
        overflow: hidden;
        text-overflow: ellipsis
    }

    #ellipsis {
        inset-inline-end: 0;
        position: absolute
    }

    #focus-indicator {
        background-color: var(--google-blue-600);
        border-radius: 3px;
        display: none;
        height: 100%;
        margin-inline-start: -15px;
        position: absolute;
        width: 6px
    }

    :host(:is(:focus-visible,[selected]:not(:focus-within)):not([side-type-class_=secondary-side])) #focus-indicator {
        display: block
    }

    #prefix {
        opacity: 0
    }

    #separator {
        white-space: pre
    }

    #tail-suggest-prefix {
        position: relative
    }

    #text-container {
        align-items: center;
        display: flex;
        flex-grow: 1;
        overflow: hidden;
        padding-inline-end: 8px;
        padding-inline-start: 8px;
        white-space: nowrap
    }

    #text-container.simplified {
        flex-grow: 0
    }

    :host([is-rich-suggestion]) #text-container {
        align-items: flex-start;
        flex-direction: column
    }

    :host([is-rich-suggestion]) #separator {
        display: none
    }

    :host([is-rich-suggestion]) #contents, :host([is-rich-suggestion]) #description {
        width: 100%
    }

    :host([is-entity-suggestion][has-image]) #description {
        font-size: .875em
    }

    .match {
        font-weight: 600
    }

    .dim, :host([is-entity-suggestion]) #description {
        color: var(--color-realbox-results-foreground-dimmed)
    }

    :host-context(cr-realbox-match:-webkit-any(:focus-within,[selected])) .dim, :host-context(cr-realbox-match:-webkit-any(:focus-within,[selected])):host([is-entity-suggestion]) #description {
        color: var(--color-realbox-results-dim-selected)
    }

    .url {
        color: var(--color-realbox-results-url)
    }

    :host-context(cr-realbox-match:-webkit-any(:focus-within,[selected])) .url {
        color: var(--color-realbox-results-url-selected)
    }

    #remove {
        margin-inline-end: 1px;
        opacity: 0
    }

    :host-context(cr-realbox-match:hover) #remove {
        opacity: 1
    }

    :host-context(cr-realbox-match:-webkit-any(:focus-within,[selected])) #remove {
        --cr-icon-button-fill-color: var(--color-realbox-results-icon-selected);
        opacity: 1
    }

    .selected {
        box-shadow: inset 0 0 0 2px var(--color-realbox-results-icon-focused-outline)
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) {
        border-radius: 16px
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) .container {
        box-sizing: border-box;
        flex-direction: column;
        padding: 6px;
        padding-block-end: 16px;
        width: 102px
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) .focus-indicator {
        display: none
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) #icon {
        --cr-realbox-icon-border-radius: 12px;
        --cr-realbox-icon-container-bg-color: transparent;
        height: 90px;
        margin-block-end: 8px;
        width: 90px
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) #text-container {
        padding: 0;
        white-space: normal;
        width: 100%
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) #contents, :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) #description {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        font-weight: 400;
        overflow: hidden
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) #contents {
        font-size: 13px;
        line-height: 20px;
        margin-block-end: 4px
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) #description {
        font-size: 12px;
        line-height: 16px
    }

    :host([side-type-class_=secondary-side][is-entity-suggestion][has-image]) #remove {
        display: none
    }</style>
    <div class="container" aria-hidden="true">
        <div id="focus-indicator"></div>
        <cr-realbox-icon id="icon" match="[[match]]"></cr-realbox-icon>
        <div id="text-container" class$="[[simplifiedClass_]]">
    <span id="tail-suggest-prefix" hidden$="[[!tailSuggestPrefix_]]">
      <span id="prefix">[[tailSuggestPrefix_]]</span>
      
      <span id="ellipsis">...&nbsp</span>
    </span>
            <span id="contents" inner-h-t-m-l="[[contentsHtml_]]"></span>
            <span id="separator" class="dim">[[separatorText_]]</span>
            <span id="description" inner-h-t-m-l="[[descriptionHtml_]]"></span>
        </div>
        <div class="actions container inlined" aria-hidden="true" hidden="[[!showActionsInlined_()]]">
            <template is="dom-repeat" items="[[match.actions]]">
                <cr-realbox-action id="action" action="[[item]]" action-index="[[actionIndex_(item)]]"
                                   on-execute-action="onExecuteAction_" tabindex="1">
                </cr-realbox-action>
            </template>
        </div>
        <cr-icon-button id="remove" class="action-icon icon-clear" aria-label="[[removeButtonAriaLabel_]]"
                        on-click="onRemoveButtonClick_" on-mousedown="onRemoveButtonMouseDown_"
                        title="[[removeButtonTitle_]]" hidden$="[[!match.supportsDeletion]]" tabindex="2">
        </cr-icon-button>
    </div>
    <div class="actions container underneath" aria-hidden="true" hidden="[[!showActionsUnderneath_(match)]]">
        <template is="dom-repeat" items="[[match.actions]]">
            <cr-realbox-action id="action" action="[[item]]" action-index="[[actionIndex_(item)]]"
                               on-execute-action="onExecuteAction_" tabindex="1">
            </cr-realbox-action>
        </template>
    </div>
    <!--_html_template_end_-->`
}

// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var AcMatchClassificationStyle;
(function (AcMatchClassificationStyle) {
    AcMatchClassificationStyle[AcMatchClassificationStyle["NONE"] = 0] = "NONE";
    AcMatchClassificationStyle[AcMatchClassificationStyle["URL"] = 1] = "URL";
    AcMatchClassificationStyle[AcMatchClassificationStyle["MATCH"] = 2] = "MATCH";
    AcMatchClassificationStyle[AcMatchClassificationStyle["DIM"] = 4] = "DIM"
})(AcMatchClassificationStyle || (AcMatchClassificationStyle = {}));
const ENTITY_MATCH_TYPE = "search-suggest-entity";

class RealboxMatchElement extends PolymerElement {
    constructor() {
        super();
        this.pageHandler_ = RealboxBrowserProxy.getInstance().handler
    }

    static get is() {
        return "cr-realbox-match"
    }

    static get template() {
        return getTemplate$5()
    }

    static get properties() {
        return {
            ariaLabel: {type: String, computed: `computeAriaLabel_(match.a11yLabel)`, reflectToAttribute: true},
            hasImage: {type: Boolean, computed: `computeHasImage_(match)`, reflectToAttribute: true},
            isEntitySuggestion: {
                type: Boolean,
                computed: `computeIsEntitySuggestion_(match)`,
                reflectToAttribute: true
            },
            isRichSuggestion: {type: Boolean, computed: `computeIsRichSuggestion_(match)`, reflectToAttribute: true},
            match: Object,
            matchIndex: {type: Number, value: -1},
            sideType: Number,
            sideTypeClass_: {type: String, computed: "computeSideTypeClass_(sideType)", reflectToAttribute: true},
            contentsHtml_: {type: String, computed: `computeContentsHtml_(match)`},
            descriptionHtml_: {type: String, computed: `computeDescriptionHtml_(match)`},
            removeButtonAriaLabel_: {
                type: String,
                computed: `computeRemoveButtonAriaLabel_(match.removeButtonA11yLabel)`
            },
            removeButtonTitle_: {type: String, value: () => loadTimeData.getString("removeSuggestion")},
            separatorText_: {type: String, computed: `computeSeparatorText_(match)`},
            tailSuggestPrefix_: {type: String, computed: `computeTailSuggestPrefix_(match)`},
            simplifiedClass_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("omniboxActionsUISimplification") ? "simplified" : ""
            }
        }
    }

    ready() {
        super.ready();
        this.addEventListener("click", (event => this.onMatchClick_(event)));
        this.addEventListener("focusin", (() => this.onMatchFocusin_()));
        this.addEventListener("mousedown", (() => this.onMatchMouseDown_()))
    }

    onExecuteAction_(e) {
        const event = e.detail.event;
        this.pageHandler_.executeAction(this.matchIndex, e.detail.actionIndex, this.match.destinationUrl, mojoTimeTicks(Date.now()), event.button || 0, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey)
    }

    onMatchClick_(e) {
        if (e.button > 1) {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        this.pageHandler_.openAutocompleteMatch(this.matchIndex, this.match.destinationUrl, true, e.button || 0, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey)
    }

    onMatchFocusin_() {
        this.dispatchEvent(new CustomEvent("match-focusin", {bubbles: true, composed: true, detail: this.matchIndex}))
    }

    onMatchMouseDown_() {
        this.pageHandler_.onNavigationLikely(this.matchIndex, this.match.destinationUrl, NavigationPredictor.kMouseDown)
    }

    onRemoveButtonClick_(e) {
        if (e.button !== 0) {
            return
        }
        e.preventDefault();
        e.stopPropagation();
        this.pageHandler_.deleteAutocompleteMatch(this.matchIndex, this.match.destinationUrl)
    }

    onRemoveButtonMouseDown_(e) {
        e.preventDefault()
    }

    actionIndex_(action) {
        return this.match?.actions?.indexOf(action) ?? -1
    }

    computeAriaLabel_() {
        if (!this.match) {
            return ""
        }
        return decodeString16(this.match.a11yLabel)
    }

    sanitizeInnerHtml_(html) {
        return sanitizeInnerHtml(html, {attrs: ["class"]})
    }

    computeContentsHtml_() {
        if (!this.match) {
            return window.trustedTypes.emptyHTML
        }
        const match = this.match;
        const matchContents = match.answer ? match.answer.firstLine : match.contents;
        return match.swapContentsAndDescription ? this.sanitizeInnerHtml_(this.renderTextWithClassifications_(decodeString16(match.description), match.descriptionClass).innerHTML) : this.sanitizeInnerHtml_(this.renderTextWithClassifications_(decodeString16(matchContents), match.contentsClass).innerHTML)
    }

    computeDescriptionHtml_() {
        if (!this.match) {
            return window.trustedTypes.emptyHTML
        }
        const match = this.match;
        if (match.answer) {
            return this.sanitizeInnerHtml_(decodeString16(match.answer.secondLine))
        }
        return match.swapContentsAndDescription ? this.sanitizeInnerHtml_(this.renderTextWithClassifications_(decodeString16(match.contents), match.contentsClass).innerHTML) : this.sanitizeInnerHtml_(this.renderTextWithClassifications_(decodeString16(match.description), match.descriptionClass).innerHTML)
    }

    computeTailSuggestPrefix_() {
        if (!this.match || !this.match.tailSuggestCommonPrefix) {
            return ""
        }
        const prefix = decodeString16(this.match.tailSuggestCommonPrefix);
        if (prefix.slice(-1) === " ") {
            return prefix.slice(0, -1) + "聽"
        }
        return prefix
    }

    computeHasImage_() {
        return this.match && !!this.match.imageUrl
    }

    computeIsEntitySuggestion_() {
        return this.match && this.match.type === ENTITY_MATCH_TYPE
    }

    computeIsRichSuggestion_() {
        return this.match && this.match.isRichSuggestion
    }

    computeRemoveButtonAriaLabel_() {
        if (!this.match) {
            return ""
        }
        return decodeString16(this.match.removeButtonA11yLabel)
    }

    computeSeparatorText_() {
        return this.match && decodeString16(this.match.description) ? loadTimeData.getString("realboxSeparator") : ""
    }

    computeSideTypeClass_() {
        return sideTypeToClass(this.sideType)
    }

    showActionsInlined_() {
        return loadTimeData.getBoolean("omniboxActionsUISimplification")
    }

    showActionsUnderneath_(match) {
        return match.actions.length > 0 && !loadTimeData.getBoolean("omniboxActionsUISimplification")
    }

    convertClassificationStyleToCssClasses_(style) {
        const classes = [];
        if (style & AcMatchClassificationStyle.DIM) {
            classes.push("dim")
        }
        if (style & AcMatchClassificationStyle.MATCH) {
            classes.push("match")
        }
        if (style & AcMatchClassificationStyle.URL) {
            classes.push("url")
        }
        return classes
    }

    createSpanWithClasses_(text, classes) {
        const span = document.createElement("span");
        if (classes.length) {
            span.classList.add(...classes)
        }
        span.textContent = text;
        return span
    }

    renderTextWithClassifications_(text, classifications) {
        return classifications.map((({offset: offset, style: style}, index) => {
            const next = classifications[index + 1] || {offset: text.length};
            const subText = text.substring(offset, next.offset);
            const classes = this.convertClassificationStyleToCssClasses_(style);
            return this.createSpanWithClasses_(subText, classes)
        })).reduce(((container, currentElement) => {
            container.appendChild(currentElement);
            return container
        }), document.createElement("span"))
    }

    updateSelection(selection) {
        this.$.remove.classList.toggle("selected", selection.state === SelectionLineState.kFocusedButtonRemoveSuggestion);
        const actions = Array.from(this.shadowRoot.querySelectorAll("cr-realbox-action"));
        actions.forEach(((action, index) => {
            action.classList.toggle("selected", selection.state === SelectionLineState.kFocusedButtonAction && selection.actionIndex === index)
        }))
    }
}

customElements.define(RealboxMatchElement.is, RealboxMatchElement);
// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class PageMetricsHostPendingReceiver {
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }

    bindInBrowser(scope = "context") {
        mojo.internal.interfaceSupport.bind(this.handle, "metrics_reporter.mojom.PageMetricsHost", scope)
    }
}

class PageMetricsHostRemote {
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(PageMetricsHostPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }

    onPageRemoteCreated(page) {
        this.proxy.sendMessage(1142189702, PageMetricsHost_OnPageRemoteCreated_ParamsSpec.$, null, [page])
    }

    onGetMark(name) {
        return this.proxy.sendMessage(105310932, PageMetricsHost_OnGetMark_ParamsSpec.$, PageMetricsHost_OnGetMark_ResponseParamsSpec.$, [name])
    }

    onClearMark(name) {
        this.proxy.sendMessage(1529832583, PageMetricsHost_OnClearMark_ParamsSpec.$, null, [name])
    }

    onUmaReportTime(name, time) {
        this.proxy.sendMessage(1048386654, PageMetricsHost_OnUmaReportTime_ParamsSpec.$, null, [name, time])
    }
}

class PageMetricsHost {
    static get $interfaceName() {
        return "metrics_reporter.mojom.PageMetricsHost"
    }

    static getRemote() {
        let remote = new PageMetricsHostRemote;
        remote.$.bindNewPipeAndPassReceiver().bindInBrowser();
        return remote
    }
}

class PageMetricsPendingReceiver {
    constructor(handle) {
        this.handle = mojo.internal.interfaceSupport.getEndpointForReceiver(handle)
    }

    bindInBrowser(scope = "context") {
        mojo.internal.interfaceSupport.bind(this.handle, "metrics_reporter.mojom.PageMetrics", scope)
    }
}

class PageMetricsRemote {
    constructor(handle) {
        this.proxy = new mojo.internal.interfaceSupport.InterfaceRemoteBase(PageMetricsPendingReceiver, handle);
        this.$ = new mojo.internal.interfaceSupport.InterfaceRemoteBaseWrapper(this.proxy);
        this.onConnectionError = this.proxy.getConnectionErrorEventRouter()
    }

    onGetMark(name) {
        return this.proxy.sendMessage(75056935, PageMetrics_OnGetMark_ParamsSpec.$, PageMetrics_OnGetMark_ResponseParamsSpec.$, [name])
    }

    onClearMark(name) {
        this.proxy.sendMessage(1328370725, PageMetrics_OnClearMark_ParamsSpec.$, null, [name])
    }
}

class PageMetricsCallbackRouter {
    constructor() {
        this.helper_internal_ = new mojo.internal.interfaceSupport.InterfaceReceiverHelperInternal(PageMetricsRemote);
        this.$ = new mojo.internal.interfaceSupport.InterfaceReceiverHelper(this.helper_internal_);
        this.router_ = new mojo.internal.interfaceSupport.CallbackRouter;
        this.onGetMark = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(75056935, PageMetrics_OnGetMark_ParamsSpec.$, PageMetrics_OnGetMark_ResponseParamsSpec.$, this.onGetMark.createReceiverHandler(true));
        this.onClearMark = new mojo.internal.interfaceSupport.InterfaceCallbackReceiver(this.router_);
        this.helper_internal_.registerHandler(1328370725, PageMetrics_OnClearMark_ParamsSpec.$, null, this.onClearMark.createReceiverHandler(false));
        this.onConnectionError = this.helper_internal_.getConnectionErrorEventRouter()
    }

    removeListener(id) {
        return this.router_.removeListener(id)
    }
}

const PageMetricsHost_OnPageRemoteCreated_ParamsSpec = {$: {}};
const PageMetricsHost_OnGetMark_ParamsSpec = {$: {}};
const PageMetricsHost_OnGetMark_ResponseParamsSpec = {$: {}};
const PageMetricsHost_OnClearMark_ParamsSpec = {$: {}};
const PageMetricsHost_OnUmaReportTime_ParamsSpec = {$: {}};
const PageMetrics_OnGetMark_ParamsSpec = {$: {}};
const PageMetrics_OnGetMark_ResponseParamsSpec = {$: {}};
const PageMetrics_OnClearMark_ParamsSpec = {$: {}};
mojo.internal.Struct(PageMetricsHost_OnPageRemoteCreated_ParamsSpec.$, "PageMetricsHost_OnPageRemoteCreated_Params", [mojo.internal.StructField("page", 0, 0, mojo.internal.InterfaceProxy(PageMetricsRemote), null, false, 0)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnGetMark_ParamsSpec.$, "PageMetricsHost_OnGetMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnGetMark_ResponseParamsSpec.$, "PageMetricsHost_OnGetMark_ResponseParams", [mojo.internal.StructField("markedTime", 0, 0, TimeDeltaSpec.$, null, true, 0)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnClearMark_ParamsSpec.$, "PageMetricsHost_OnClearMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0)], [[0, 16]]);
mojo.internal.Struct(PageMetricsHost_OnUmaReportTime_ParamsSpec.$, "PageMetricsHost_OnUmaReportTime_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0), mojo.internal.StructField("time", 8, 0, TimeDeltaSpec.$, null, false, 0)], [[0, 24]]);
mojo.internal.Struct(PageMetrics_OnGetMark_ParamsSpec.$, "PageMetrics_OnGetMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0)], [[0, 16]]);
mojo.internal.Struct(PageMetrics_OnGetMark_ResponseParamsSpec.$, "PageMetrics_OnGetMark_ResponseParams", [mojo.internal.StructField("markedTime", 0, 0, TimeDeltaSpec.$, null, true, 0)], [[0, 16]]);
mojo.internal.Struct(PageMetrics_OnClearMark_ParamsSpec.$, "PageMetrics_OnClearMark_Params", [mojo.internal.StructField("name", 0, 0, mojo.internal.String, null, false, 0)], [[0, 16]]);
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class BrowserProxyImpl {
    constructor() {
        this.callbackRouter = new PageMetricsCallbackRouter;
        this.host = PageMetricsHost.getRemote();
        this.host.onPageRemoteCreated(this.callbackRouter.$.bindNewPipeAndPassRemote())
    }

    static getInstance() {
        return instance$3 || (instance$3 = new BrowserProxyImpl)
    }

    static setInstance(obj) {
        instance$3 = obj
    }

    getMark(name) {
        return this.host.onGetMark(name)
    }

    clearMark(name) {
        this.host.onClearMark(name)
    }

    umaReportTime(name, time) {
        this.host.onUmaReportTime(name, time)
    }

    now() {
        return chrome.timeTicks.nowInMicroseconds()
    }

    getCallbackRouter() {
        return this.callbackRouter
    }
}

let instance$3 = null;
// Copyright 2022 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function timeFromMojo(delta) {
    return delta.microseconds
}

function timeToMojo(mark) {
    return {microseconds: mark}
}

class MetricsReporterImpl {
    constructor() {
        this.marks_ = new Map;
        this.browserProxy_ = BrowserProxyImpl.getInstance();
        const callbackRouter = this.browserProxy_.getCallbackRouter();
        callbackRouter.onGetMark.addListener((name => ({markedTime: this.marks_.has(name) ? timeToMojo(this.marks_.get(name)) : null})));
        callbackRouter.onClearMark.addListener((name => this.marks_.delete(name)))
    }

    static getInstance() {
        return instance$2 || (instance$2 = new MetricsReporterImpl)
    }

    static setInstanceForTest(newInstance) {
        instance$2 = newInstance
    }

    mark(name) {
        this.marks_.set(name, this.browserProxy_.now())
    }

    async measure(startMark, endMark) {
        let endTime;
        if (endMark) {
            const entry = this.marks_.get(endMark);
            assert(entry, `Mark "${endMark}" does not exist locally.`);
            endTime = entry
        } else {
            endTime = this.browserProxy_.now()
        }
        let startTime;
        if (this.marks_.has(startMark)) {
            startTime = this.marks_.get(startMark)
        } else {
            const remoteStartTime = await this.browserProxy_.getMark(startMark);
            assert(remoteStartTime.markedTime, `Mark "${startMark}" does not exist locally or remotely.`);
            startTime = timeFromMojo(remoteStartTime.markedTime)
        }
        return endTime - startTime
    }

    async hasMark(name) {
        if (this.marks_.has(name)) {
            return true
        }
        const remoteMark = await this.browserProxy_.getMark(name);
        return remoteMark !== null && remoteMark.markedTime !== null
    }

    hasLocalMark(name) {
        return this.marks_.has(name)
    }

    clearMark(name) {
        this.marks_.delete(name);
        this.browserProxy_.clearMark(name)
    }

    umaReportTime(histogram, time) {
        this.browserProxy_.umaReportTime(histogram, timeToMojo(time))
    }
}

let instance$2 = null;
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
function isValidArray(arr) {
    if (arr instanceof Array && Object.isFrozen(arr)) {
        return true
    }
    return false
}

function getStaticString(literal) {
    const isStaticString = isValidArray(literal) && !!literal.raw && isValidArray(literal.raw) && literal.length === literal.raw.length && literal.length === 1;
    assert(isStaticString, "static_types.js only allows static strings");
    return literal.join("")
}

function createTypes(_ignore, literal) {
    return getStaticString(literal)
}

const rules = {createHTML: createTypes, createScript: createTypes, createScriptURL: createTypes};
let staticPolicy;
if (window.trustedTypes) {
    staticPolicy = window.trustedTypes.createPolicy("static-types", rules)
} else {
    staticPolicy = rules
}

function getTrustedHTML(literal) {
    return staticPolicy.createHTML("", literal)
}

function getTrustedScriptURL(literal) {
    return staticPolicy.createScriptURL("", literal)
}

function getTemplate$4() {
    return html`<!--_html_template_start_-->
    <style include="cr-icons realbox-dropdown-shared-style">:host {
        user-select: none
    }

    #content {
        background-color: var(--color-realbox-results-background);
        border-radius: calc(.5 * var(--cr-realbox-height));
        box-shadow: var(--cr-realbox-shadow);
        display: flex;
        gap: 16px;
        margin-bottom: 8px;
        overflow: hidden;
        padding-bottom: 18px;
        padding-top: var(--cr-realbox-height)
    }

    @media (forced-colors: active) {
        #content {
            border: 1px solid ActiveBorder
        }
    }

    .matches {
        display: contents
    }

    cr-realbox-match {
        color: var(--color-realbox-results-foreground)
    }

    .header {
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        display: flex;
        font-size: inherit;
        font-weight: inherit;
        height: 44px;
        margin-block-end: 0;
        margin-block-start: 0;
        outline: 0;
        padding-bottom: 6px;
        padding-inline-end: 16px;
        padding-inline-start: 12px;
        padding-top: 6px
    }

    .header .text {
        color: var(--color-realbox-results-foreground-dimmed);
        font-size: .875em;
        font-weight: 500;
        overflow: hidden;
        padding-inline-end: 6px;
        padding-inline-start: 6px;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    .header:focus-within:not(:focus) cr-icon-button {
        --cr-icon-button-fill-color: var(--color-realbox-results-icon-selected)
    }

    cr-realbox-match:-webkit-any(:hover,:focus-within,[selected]) {
        background-color: var(--color-realbox-results-background-hovered)
    }

    @media (forced-colors: active) {
        cr-realbox-match:-webkit-any(:hover,:focus-within,[selected]) {
            background-color: Highlight
        }
    }

    .primary-side {
        flex: 1;
        min-width: 0
    }

    .secondary-side {
        display: var(--cr-realbox-secondary-side-display, none);
        min-width: 0;
        padding-block-end: 8px;
        padding-inline-end: 16px;
        width: 314px
    }

    .secondary-side .header {
        padding-inline-end: 0;
        padding-inline-start: 0
    }

    .secondary-side .matches {
        display: flex;
        gap: 4px
    }</style>
    <div id="content">
        <template is="dom-repeat" items="[[sideTypes_(showSecondarySide_)]]" as="side">
            <div class$="[[classForSide_(side)]]">
                <template is="dom-repeat" items="[[groupIdsForSide_(side, result.matches.*)]]" as="groupId">
                    <template is="dom-if" if="[[hasHeaderForGroup_(groupId)]]">

                        <h3 class="header" data-id$="[[groupId]]" tabindex="-1" on-focusin="onHeaderFocusin_"
                            on-click="onHeaderClick_" on-mousedown="onHeaderMousedown_" aria-hidden="true">
                            <span class="text">[[headerForGroup_(groupId)]]</span>
                            <cr-icon-button
                                    class$="action-icon [[toggleButtonIconForGroup_(groupId, hiddenGroupIds_.*)]]"
                                    title="[[toggleButtonTitleForGroup_(groupId, hiddenGroupIds_.*)]]"
                                    aria-label$="[[toggleButtonA11yLabelForGroup_(groupId, hiddenGroupIds_.*)]]">
                            </cr-icon-button>
                        </h3>
                    </template>
                    <div class="matches">
                        <template is="dom-repeat"
                                  items="[[matchesForGroup_(groupId, result.matches.*, hiddenGroupIds_.*)]]" as="match"
                                  on-dom-change="onResultRepaint_">
                            <cr-realbox-match tabindex="0" role="option" match="[[match]]"
                                              match-index="[[matchIndex_(match)]]" side-type="[[side]]"
                                              selected$="[[isSelected_(match, selectedMatchIndex)]]">
                            </cr-realbox-match>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </div>
    <!--_html_template_end_-->`
}

// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const remainder = (lhs, rhs) => (lhs % rhs + rhs) % rhs;
const CHAR_TYPED_TO_PAINT = "Realbox.CharTypedToRepaintLatency.ToPaint";
const RESULT_CHANGED_TO_PAINT = "Realbox.ResultChangedToRepaintLatency.ToPaint";

class RealboxDropdownElement extends PolymerElement {
    constructor() {
        super();
        this.resizeObserver_ = null;
        this.pageHandler_ = RealboxBrowserProxy.getInstance().handler
    }

    static get is() {
        return "cr-realbox-dropdown"
    }

    static get template() {
        return getTemplate$4()
    }

    static get properties() {
        return {
            canShowSecondarySide: {type: Boolean, value: false},
            hadSecondarySide: {type: Boolean, value: false, notify: true},
            hasSecondarySide: {type: Boolean, computed: `computeHasSecondarySide_(result)`, notify: true},
            result: {type: Object},
            selectedMatchIndex: {type: Number, value: -1, notify: true},
            showSecondarySide_: {
                type: Boolean,
                value: false,
                computed: "computeShowSecondarySide_(" + "canShowSecondarySide, result.matches.*, hiddenGroupIds_.*)"
            },
            hiddenGroupIds_: {type: Array, computed: `computeHiddenGroupIds_(result)`},
            selectableMatchElements_: {type: Array, value: () => []}
        }
    }

    get selectableMatchElements() {
        return this.selectableMatchElements_.filter((matchEl => matchEl.sideType === SideType.kDefaultPrimary || this.showSecondarySide_))
    }

    connectedCallback() {
        super.connectedCallback();
        this.resizeObserver_ = new ResizeObserver((entries => this.pageHandler_.popupElementSizeChanged({
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height
        })));
        this.resizeObserver_.observe(this.$.content)
    }

    disconnectedCallback() {
        if (this.resizeObserver_) {
            this.resizeObserver_.disconnect()
        }
        super.disconnectedCallback()
    }

    unselect() {
        this.selectedMatchIndex = -1
    }

    focusSelected() {
        this.selectableMatchElements[this.selectedMatchIndex]?.focus()
    }

    selectFirst() {
        this.selectedMatchIndex = 0
    }

    selectIndex(index) {
        this.selectedMatchIndex = index
    }

    updateSelection(selection) {
        if (selection.state === SelectionLineState.kFocusedButtonHeader) {
            this.unselect();
            return
        }
        this.selectIndex(selection.line);
        this.selectableMatchElements[this.selectedMatchIndex]?.updateSelection(selection)
    }

    selectPrevious() {
        const previous = Math.max(this.selectedMatchIndex, 0) - 1;
        this.selectedMatchIndex = remainder(previous, this.selectableMatchElements.length)
    }

    selectLast() {
        this.selectedMatchIndex = this.selectableMatchElements.length - 1
    }

    selectNext() {
        const next = this.selectedMatchIndex + 1;
        this.selectedMatchIndex = remainder(next, this.selectableMatchElements.length)
    }

    onHeaderClick_(e) {
        const groupId = Number.parseInt(e.currentTarget.dataset["id"], 10);
        this.pageHandler_.toggleSuggestionGroupIdVisibility(groupId);
        const index = this.hiddenGroupIds_.indexOf(groupId);
        if (index === -1) {
            this.push("hiddenGroupIds_", groupId)
        } else {
            this.splice("hiddenGroupIds_", index, 1)
        }
    }

    onHeaderFocusin_() {
        this.dispatchEvent(new CustomEvent("header-focusin", {bubbles: true, composed: true}))
    }

    onHeaderMousedown_(e) {
        e.preventDefault()
    }

    onResultRepaint_() {
        const metricsReporter = MetricsReporterImpl.getInstance();
        metricsReporter.measure("CharTyped").then((duration => {
            metricsReporter.umaReportTime(CHAR_TYPED_TO_PAINT, duration)
        })).then((() => {
            metricsReporter.clearMark("CharTyped")
        })).catch((() => {
        }));
        metricsReporter.measure("ResultChanged").then((duration => {
            metricsReporter.umaReportTime(RESULT_CHANGED_TO_PAINT, duration)
        })).then((() => {
            metricsReporter.clearMark("ResultChanged")
        })).catch((() => {
        }));
        this.selectableMatchElements_ = [...this.shadowRoot.querySelectorAll("cr-realbox-match")]
    }

    classForSide_(side) {
        return sideTypeToClass(side)
    }

    computeHasSecondarySide_() {
        const hasSecondarySide = !!this.groupIdsForSide_(SideType.kSecondary).length;
        if (!this.hadSecondarySide) {
            this.hadSecondarySide = hasSecondarySide
        }
        return hasSecondarySide
    }

    computeHiddenGroupIds_() {
        return Object.keys(this.result?.suggestionGroupsMap ?? {}).map((groupId => Number.parseInt(groupId, 10))).filter((groupId => this.result.suggestionGroupsMap[groupId].hidden))
    }

    isSelected_(match) {
        return this.matchIndex_(match) === this.selectedMatchIndex
    }

    groupIdsForSide_(side) {
        return [...new Set(this.result?.matches?.map((match => match.suggestionGroupId)).filter((groupId => this.sideTypeForGroup_(groupId) === side)))]
    }

    groupIsHidden_(groupId) {
        return this.hiddenGroupIds_.indexOf(groupId) !== -1
    }

    hasHeaderForGroup_(groupId) {
        return !!this.headerForGroup_(groupId)
    }

    headerForGroup_(groupId) {
        return this.result?.suggestionGroupsMap[groupId] ? decodeString16(this.result.suggestionGroupsMap[groupId].header) : ""
    }

    matchIndex_(match) {
        return this.result?.matches?.indexOf(match) ?? -1
    }

    matchesForGroup_(groupId) {
        return this.groupIsHidden_(groupId) ? [] : (this.result?.matches ?? []).filter((match => match.suggestionGroupId === groupId))
    }

    sideTypes_() {
        return this.showSecondarySide_ ? [SideType.kDefaultPrimary, SideType.kSecondary] : [SideType.kDefaultPrimary]
    }

    sideTypeForGroup_(groupId) {
        return this.result?.suggestionGroupsMap[groupId]?.sideType ?? SideType.kDefaultPrimary
    }

    toggleButtonA11yLabelForGroup_(groupId) {
        if (!this.hasHeaderForGroup_(groupId)) {
            return ""
        }
        return !this.groupIsHidden_(groupId) ? decodeString16(this.result.suggestionGroupsMap[groupId].hideGroupA11yLabel) : decodeString16(this.result.suggestionGroupsMap[groupId].showGroupA11yLabel)
    }

    toggleButtonIconForGroup_(groupId) {
        return this.groupIsHidden_(groupId) ? "icon-expand-more" : "icon-expand-less"
    }

    toggleButtonTitleForGroup_(groupId) {
        return loadTimeData.getString(this.groupIsHidden_(groupId) ? "showSuggestions" : "hideSuggestions")
    }

    computeShowSecondarySide_() {
        if (!this.canShowSecondarySide) {
            return false
        }
        if (!this.hiddenGroupIds_) {
            return true
        }
        const primaryGroupIds = this.groupIdsForSide_(SideType.kDefaultPrimary);
        return primaryGroupIds.some((groupId => this.matchesForGroup_(groupId).length > 0))
    }
}

customElements.define(RealboxDropdownElement.is, RealboxDropdownElement);

function getTemplate$3() {
    return html`<!--_html_template_start_-->
    <style include="cr-icons">:host {
        --cr-realbox-height: 44px;
        --cr-realbox-min-width: var(--ntp-search-box-width);
        --cr-realbox-shadow: 0 1px 6px 0 var(--color-realbox-shadow);
        --cr-realbox-width: var(--cr-realbox-min-width);
        --ntp-realbox-border-radius: calc(0.5 * var(--cr-realbox-height));
        --ntp-realbox-icon-width: 26px;
        --ntp-realbox-inner-icon-margin: 8px;
        --ntp-realbox-voice-icon-offset: 16px;
        border-radius: var(--ntp-realbox-border-radius);
        box-shadow: var(--cr-realbox-shadow);
        font-size: 16px;
        height: var(--cr-realbox-height);
        width: var(--cr-realbox-width)
    }

    :host([can-show-secondary-side][had-secondary-side]), :host([can-show-secondary-side][width-behavior_=wide]) {
        --cr-realbox-width: 746px
    }

    :host([can-show-secondary-side][width-behavior_=revert]:not([dropdown-is-visible])) {
        --cr-realbox-width: var(--cr-realbox-min-width)
    }

    :host([is-tall_]) {
        --cr-realbox-height: 48px
    }

    :host([can-show-secondary-side][has-secondary-side]) {
        --cr-realbox-secondary-side-display: block
    }

    :host([is-dark]) {
        --cr-realbox-shadow: 0 2px 6px 0 var(--color-realbox-shadow)
    }

    :host([realbox-lens-search-enabled_]) {
        --ntp-realbox-voice-icon-offset: 53px
    }

    @media (forced-colors: active) {
        :host {
            border: 1px solid ActiveBorder
        }
    }

    :host([dropdown-is-visible]) {
        box-shadow: none
    }

    :host([match-searchbox]) {
        box-shadow: none
    }

    :host([match-searchbox]:not([dropdown-is-visible]):hover) {
        border: 1px solid transparent;
        box-shadow: var(--cr-realbox-shadow)
    }

    :host([match-searchbox]:not([is-dark]):not([dropdown-is-visible]):not(:hover)) {
        border: 1px solid var(--color-realbox-border)
    }

    #inputWrapper {
        height: 100%;
        position: relative
    }

    input {
        background-color: var(--color-realbox-background);
        border: none;
        border-radius: var(--ntp-realbox-border-radius);
        color: var(--color-realbox-foreground);
        font-family: inherit;
        font-size: inherit;
        height: 100%;
        outline: 0;
        padding-inline-end: calc(var(--ntp-realbox-voice-icon-offset) + var(--ntp-realbox-icon-width) + var(--ntp-realbox-inner-icon-margin));
        padding-inline-start: 52px;
        position: relative;
        width: 100%
    }

    input::-webkit-search-decoration, input::-webkit-search-results-button, input::-webkit-search-results-decoration {
        display: none
    }

    input::-webkit-search-cancel-button {
        appearance: none;
        margin: 0
    }

    input::placeholder {
        color: var(--color-realbox-placeholder)
    }

    input:focus::placeholder {
        visibility: hidden
    }

    :host([dropdown-is-visible]) input, input:focus {
        background-color: var(--color-realbox-results-background)
    }

    input:hover {
        background-color: var(--color-realbox-background-hovered)
    }

    cr-realbox-icon {
        height: 100%;
        left: 12px;
        position: absolute;
        top: 0
    }

    :host-context([dir=rtl]) cr-realbox-icon {
        left: unset;
        right: 12px
    }

    .realbox-icon-button {
        background-color: transparent;
        background-position: center;
        background-repeat: no-repeat;
        background-size: 21px 21px;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        height: 100%;
        outline: 0;
        padding: 0;
        pointer-events: auto;
        position: absolute;
        right: 16px;
        width: var(--ntp-realbox-icon-width)
    }

    :host([single-colored-icons]) #lensSearchButton, :host([single-colored-icons]) #voiceSearchButton {
        -webkit-mask-position: center;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 21px 21px;
        background-color: var(--color-new-tab-page-primary-foreground)
    }

    :host([single-colored-icons]) #voiceSearchButton {
        -webkit-mask-image: url(icons/googlemic_clr_24px.svg)
    }

    :host(:not([single-colored-icons])) #voiceSearchButton {
        background-image: url(icons/googlemic_clr_24px.svg)
    }

    :host([single-colored-icons]) #lensSearchButton {
        -webkit-mask-image: url(chrome://new-tab-page/icons/lens_icon.svg)
    }

    :host(:not([single-colored-icons])) #lensSearchButton {
        background-image: url(chrome://new-tab-page/icons/lens_icon.svg)
    }

    :host([realbox-lens-search-enabled_]):host-context([dir=rtl]) #voiceSearchButton {
        left: var(--ntp-realbox-voice-icon-offset);
        right: unset
    }

    :host([realbox-lens-search-enabled_]) #voiceSearchButton {
        right: var(--ntp-realbox-voice-icon-offset)
    }

    :host-context([dir=rtl]) .realbox-icon-button {
        left: 16px;
        right: unset
    }

    :host-context(.focus-outline-visible) .realbox-icon-button:focus {
        box-shadow: var(--ntp-focus-shadow)
    }

    :-webkit-any(input,cr-realbox-icon,.realbox-icon-button) {
        z-index: 100
    }

    cr-realbox-dropdown {
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 99
    }

    .truncate {
        overflow: hidden;
        text-overflow: ellipsis
    }</style>
    <div id="inputWrapper" on-focusout="onInputWrapperFocusout_" on-keydown="onInputWrapperKeydown_">
        <input id="input" class="truncate" type="search" autocomplete="off" spellcheck="false"
               aria-live="[[inputAriaLive_]]" role="combobox" aria-expanded="[[dropdownIsVisible]]"
               aria-controls="matches" placeholder="鍦� Google 涓悳绱紝鎴栬緭鍏ョ綉鍧€" on-copy="onInputCutCopy_"
               on-cut="onInputCutCopy_" on-focus="onInputFocus_" on-input="onInputInput_" on-keydown="onInputKeydown_"
               on-keyup="onInputKeyup_" on-mousedown="onInputMouseDown_" on-paste="onInputPaste_">
        <cr-realbox-icon id="icon" match="[[selectedMatch_]]" default-icon="[[realboxIcon_]]" in-searchbox>
        </cr-realbox-icon>
        <button id="voiceSearchButton" class="realbox-icon-button" on-click="onVoiceSearchClick_" title="璇煶鎼滅储">
        </button>
        <template is="dom-if" if="[[realboxLensSearchEnabled_]]">
            <button id="lensSearchButton" class="realbox-icon-button" on-click="onLensSearchClick_"
                    title="鎸夊浘鎼滅储">
            </button>
        </template>
        <cr-realbox-dropdown id="matches" role="listbox" result="[[result_]]"
                             selected-match-index="{{selectedMatchIndex_}}"
                             can-show-secondary-side="[[canShowSecondarySide]]"
                             had-secondary-side="{{hadSecondarySide}}" has-secondary-side="{{hasSecondarySide}}"
                             on-match-focusin="onMatchFocusin_" on-header-focusin="onHeaderFocusin_"
                             hidden$="[[!dropdownIsVisible]]">
        </cr-realbox-dropdown>
    </div>
    <!--_html_template_end_-->`
}

// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const canShowSecondarySideMediaQueryList = window.matchMedia("(min-width: 900px)");

class RealboxElement extends PolymerElement {
    constructor() {
        performance.mark("realbox-creation-start");
        super();
        this.autocompleteResultChangedListenerId_ = null;
        this.pageHandler_ = RealboxBrowserProxy.getInstance().handler;
        this.callbackRouter_ = RealboxBrowserProxy.getInstance().callbackRouter
    }

    static get is() {
        return "ntp-realbox"
    }

    static get template() {
        return getTemplate$3()
    }

    static get properties() {
        return {
            canShowSecondarySide: {
                type: Boolean,
                value: () => canShowSecondarySideMediaQueryList.matches,
                reflectToAttribute: true
            },
            dropdownIsVisible: {type: Boolean, value: false, reflectToAttribute: true},
            hadSecondarySide: {type: Boolean, reflectToAttribute: true},
            hasSecondarySide: {type: Boolean, reflectToAttribute: true},
            isDark: {type: Boolean, reflectToAttribute: true},
            matchSearchbox: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("realboxMatchSearchboxTheme"),
                reflectToAttribute: true
            },
            realboxLensSearchEnabled: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("realboxLensSearch"),
                reflectToAttribute: true
            },
            singleColoredIcons: {type: Boolean, value: false, reflectToAttribute: true},
            isDeletingInput_: {type: Boolean, value: false},
            lastIgnoredEnterEvent_: {type: Object, value: null},
            lastInput_: {type: Object, value: {text: "", inline: ""}},
            lastQueriedInput_: {type: String, value: null},
            pastedInInput_: {type: Boolean, value: false},
            realboxIcon_: {type: String, value: () => loadTimeData.getString("realboxDefaultIcon")},
            realboxLensSearchEnabled_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("realboxLensSearch"),
                reflectToAttribute: true
            },
            result_: {type: Object},
            selectedMatch_: {type: Object, computed: `computeSelectedMatch_(result_, selectedMatchIndex_)`},
            selectedMatchIndex_: {type: Number, value: -1},
            inputAriaLive_: {type: String, computed: `computeInputAriaLive_(selectedMatch_)`},
            widthBehavior_: {
                type: String,
                value: loadTimeData.getString("realboxWidthBehavior"),
                reflectToAttribute: true
            },
            isTall_: {type: Boolean, value: loadTimeData.getBoolean("realboxIsTall"), reflectToAttribute: true}
        }
    }

    computeInputAriaLive_() {
        return this.selectedMatch_ ? "off" : "polite"
    }

    connectedCallback() {
        super.connectedCallback();
        this.autocompleteResultChangedListenerId_ = this.callbackRouter_.autocompleteResultChanged.addListener(this.onAutocompleteResultChanged_.bind(this));
        canShowSecondarySideMediaQueryList.addEventListener("change", this.onCanShowSecondarySideChanged_.bind(this))
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        assert(this.autocompleteResultChangedListenerId_);
        this.callbackRouter_.removeListener(this.autocompleteResultChangedListenerId_);
        canShowSecondarySideMediaQueryList.removeEventListener("change", this.onCanShowSecondarySideChanged_.bind(this))
    }

    ready() {
        super.ready();
        performance.measure("realbox-creation", "realbox-creation-start")
    }

    onAutocompleteResultChanged_(result) {
        if (this.lastQueriedInput_ === null || this.lastQueriedInput_.trimStart() !== decodeString16$1(result.input)) {
            return
        }
        this.result_ = result;
        const hasMatches = result?.matches?.length > 0;
        const hasPrimaryMatches = result?.matches?.some((match => {
            const sideType = result.suggestionGroupsMap[match.suggestionGroupId]?.sideType || SideType.kDefaultPrimary;
            return sideType === SideType.kDefaultPrimary
        }));
        this.dropdownIsVisible = hasPrimaryMatches;
        this.$.input.focus();
        const firstMatch = hasMatches ? this.result_.matches[0] : null;
        if (firstMatch && firstMatch.allowedToBeDefaultMatch) {
            this.$.matches.selectFirst();
            this.updateInput_({
                text: this.lastQueriedInput_,
                inline: decodeString16$1(firstMatch.inlineAutocompletion) || ""
            });
            if (this.lastIgnoredEnterEvent_) {
                this.navigateToMatch_(0, this.lastIgnoredEnterEvent_);
                this.lastIgnoredEnterEvent_ = null
            }
        } else if (hasMatches && this.selectedMatchIndex_ !== -1 && this.selectedMatchIndex_ < this.result_.matches.length) {
            this.$.matches.selectIndex(this.selectedMatchIndex_);
            this.updateInput_({
                text: decodeString16$1(this.selectedMatch_.fillIntoEdit),
                inline: "",
                moveCursorToEnd: true
            })
        } else {
            this.$.matches.unselect();
            this.updateInput_({inline: ""})
        }
    }

    onCanShowSecondarySideChanged_(e) {
        this.canShowSecondarySide = e.matches
    }

    onHeaderFocusin_() {
        assert(this.lastQueriedInput_ === "");
        this.$.matches.unselect();
        this.updateInput_({text: "", inline: ""})
    }

    onInputCutCopy_(e) {
        if (!this.$.input.value || this.$.input.selectionStart !== 0 || this.$.input.selectionEnd !== this.$.input.value.length || !this.result_ || this.result_.matches.length === 0) {
            return
        }
        if (this.selectedMatch_ && !this.selectedMatch_.isSearchType) {
            e.clipboardData.setData("text/plain", this.selectedMatch_.destinationUrl.url);
            e.preventDefault();
            if (e.type === "cut") {
                this.updateInput_({text: "", inline: ""});
                this.clearAutocompleteMatches_()
            }
        }
    }

    onInputFocus_() {
        this.pageHandler_.onFocusChanged(true)
    }

    onInputInput_(e) {
        const inputValue = this.$.input.value;
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        if (lastInputValue === inputValue) {
            return
        }
        this.updateInput_({text: inputValue, inline: ""});
        const charTyped = !this.isDeletingInput_ && !!inputValue.trim();
        const metricsReporter = MetricsReporterImpl.getInstance();
        if (charTyped) {
            if (!metricsReporter.hasLocalMark("CharTyped")) {
                metricsReporter.mark("CharTyped")
            }
        } else {
            metricsReporter.clearMark("CharTyped")
        }
        if (inputValue.trim()) {
            this.queryAutocomplete_(inputValue, e.isComposing)
        } else {
            this.clearAutocompleteMatches_()
        }
        this.pastedInInput_ = false
    }

    onInputKeydown_(e) {
        if (!this.lastInput_.inline) {
            return
        }
        const inputValue = this.$.input.value;
        const inputSelection = inputValue.substring(this.$.input.selectionStart, this.$.input.selectionEnd);
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        if (inputSelection === this.lastInput_.inline && inputValue === lastInputValue && this.lastInput_.inline[0].toLocaleLowerCase() === e.key.toLocaleLowerCase()) {
            const text = this.lastInput_.text + e.key;
            assert(text);
            this.updateInput_({text: text, inline: this.lastInput_.inline.substr(1)});
            const metricsReporter = MetricsReporterImpl.getInstance();
            if (!metricsReporter.hasLocalMark("CharTyped")) {
                metricsReporter.mark("CharTyped")
            }
            this.queryAutocomplete_(this.lastInput_.text);
            e.preventDefault()
        }
    }

    onInputKeyup_(e) {
        if (e.key !== "Tab") {
            return
        }
        if (!this.$.input.value && !this.dropdownIsVisible) {
            this.queryAutocomplete_("")
        }
    }

    onInputMouseDown_(e) {
        if (e.button !== 0) {
            return
        }
        if (!this.$.input.value && !this.dropdownIsVisible) {
            this.queryAutocomplete_("")
        }
    }

    onInputPaste_() {
        this.pastedInInput_ = true
    }

    onInputWrapperFocusout_(e) {
        if (!this.$.inputWrapper.contains(e.relatedTarget)) {
            if (this.lastQueriedInput_ === "") {
                this.updateInput_({text: "", inline: ""});
                this.clearAutocompleteMatches_()
            } else {
                this.dropdownIsVisible = false;
                this.pageHandler_.stopAutocomplete(false)
            }
            this.pageHandler_.onFocusChanged(false)
        }
    }

    onInputWrapperKeydown_(e) {
        const KEYDOWN_HANDLED_KEYS = ["ArrowDown", "ArrowUp", "Delete", "Enter", "Escape", "PageDown", "PageUp"];
        if (!KEYDOWN_HANDLED_KEYS.includes(e.key)) {
            return
        }
        if (e.defaultPrevented) {
            return
        }
        if (!this.dropdownIsVisible) {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                const inputValue = this.$.input.value;
                if (inputValue.trim() || !inputValue) {
                    this.queryAutocomplete_(inputValue)
                }
                e.preventDefault();
                return
            }
        }
        if (!this.result_ || this.result_.matches.length === 0) {
            return
        }
        if (e.key === "Delete") {
            if (e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
                if (this.selectedMatch_ && this.selectedMatch_.supportsDeletion) {
                    this.pageHandler_.deleteAutocompleteMatch(this.selectedMatchIndex_, this.selectedMatch_.destinationUrl);
                    e.preventDefault()
                }
            }
            return
        }
        if (e.isComposing) {
            return
        }
        if (e.key === "Enter") {
            const array = [this.$.matches, this.$.input];
            if (array.includes(e.target)) {
                if (this.lastQueriedInput_ !== null && this.lastQueriedInput_.trimStart() === decodeString16$1(this.result_.input)) {
                    if (this.selectedMatch_) {
                        this.navigateToMatch_(this.selectedMatchIndex_, e)
                    }
                } else {
                    this.lastIgnoredEnterEvent_ = e;
                    e.preventDefault()
                }
            }
            return
        }
        if (hasKeyModifiers(e)) {
            return
        }
        if (e.key === "Escape" && this.selectedMatchIndex_ <= 0) {
            this.updateInput_({text: "", inline: ""});
            this.clearAutocompleteMatches_();
            e.preventDefault();
            return
        }
        if (e.key === "ArrowDown") {
            this.$.matches.selectNext();
            this.pageHandler_.onNavigationLikely(this.selectedMatchIndex_, this.selectedMatch_.destinationUrl, NavigationPredictor.kUpOrDownArrowButton)
        } else if (e.key === "ArrowUp") {
            this.$.matches.selectPrevious();
            this.pageHandler_.onNavigationLikely(this.selectedMatchIndex_, this.selectedMatch_.destinationUrl, NavigationPredictor.kUpOrDownArrowButton)
        } else if (e.key === "Escape" || e.key === "PageUp") {
            this.$.matches.selectFirst()
        } else if (e.key === "PageDown") {
            this.$.matches.selectLast()
        }
        e.preventDefault();
        if (this.shadowRoot.activeElement === this.$.matches) {
            this.$.matches.focusSelected()
        }
        const newFill = decodeString16$1(this.selectedMatch_.fillIntoEdit);
        const newInline = this.selectedMatchIndex_ === 0 && this.selectedMatch_.allowedToBeDefaultMatch ? decodeString16$1(this.selectedMatch_.inlineAutocompletion) : "";
        const newFillEnd = newFill.length - newInline.length;
        const text = newFill.substr(0, newFillEnd);
        assert(text);
        this.updateInput_({text: text, inline: newInline, moveCursorToEnd: newInline.length === 0})
    }

    onMatchFocusin_(e) {
        this.$.matches.selectIndex(e.detail);
        this.updateInput_({text: decodeString16$1(this.selectedMatch_.fillIntoEdit), inline: "", moveCursorToEnd: true})
    }

    onVoiceSearchClick_() {
        this.dispatchEvent(new Event("open-voice-search"))
    }

    onLensSearchClick_() {
        this.dropdownIsVisible = false;
        this.dispatchEvent(new Event("open-lens-search"))
    }

    computeSelectedMatch_() {
        if (!this.result_ || !this.result_.matches) {
            return null
        }
        return this.result_.matches[this.selectedMatchIndex_] || null
    }

    clearAutocompleteMatches_() {
        this.dropdownIsVisible = false;
        this.result_ = null;
        this.$.matches.unselect();
        this.pageHandler_.stopAutocomplete(true);
        this.lastQueriedInput_ = null
    }

    navigateToMatch_(matchIndex, e) {
        assert(matchIndex >= 0);
        const match = this.result_.matches[matchIndex];
        assert(match);
        this.pageHandler_.openAutocompleteMatch(matchIndex, match.destinationUrl, this.dropdownIsVisible, e.button || 0, e.altKey, e.ctrlKey, e.metaKey, e.shiftKey);
        e.preventDefault()
    }

    queryAutocomplete_(input, preventInlineAutocomplete = false) {
        this.lastQueriedInput_ = input;
        const caretNotAtEnd = this.$.input.selectionStart !== input.length;
        preventInlineAutocomplete = preventInlineAutocomplete || this.isDeletingInput_ || this.pastedInInput_ || caretNotAtEnd;
        this.pageHandler_.queryAutocomplete(mojoString16(input), preventInlineAutocomplete)
    }

    updateInput_(update) {
        const newInput = Object.assign({}, this.lastInput_, update);
        const newInputValue = newInput.text + newInput.inline;
        const lastInputValue = this.lastInput_.text + this.lastInput_.inline;
        const inlineDiffers = newInput.inline !== this.lastInput_.inline;
        const preserveSelection = !inlineDiffers && !update.moveCursorToEnd;
        let needsSelectionUpdate = !preserveSelection;
        const oldSelectionStart = this.$.input.selectionStart;
        const oldSelectionEnd = this.$.input.selectionEnd;
        if (newInputValue !== this.$.input.value) {
            this.$.input.value = newInputValue;
            needsSelectionUpdate = true
        }
        if (newInputValue.trim() && needsSelectionUpdate) {
            this.$.input.selectionStart = preserveSelection ? oldSelectionStart : update.moveCursorToEnd ? newInputValue.length : newInput.text.length;
            this.$.input.selectionEnd = preserveSelection ? oldSelectionEnd : newInputValue.length
        }
        this.isDeletingInput_ = lastInputValue.length > newInputValue.length && lastInputValue.startsWith(newInputValue);
        this.lastInput_ = newInput
    }
}

customElements.define(RealboxElement.is, RealboxElement);

function getTemplate$2() {
    return html`<!--_html_template_start_-->
    <style>#dialog::part(dialog) {
        max-width: 300px
    }

    #buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 28px;
        margin-top: 20px
    }

    #buttons cr-button {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border: none;
        height: 48px;
        min-width: 48px;
        width: 48px
    }

    #buttons cr-button:hover {
        opacity: .8
    }

    #buttons > :not(:last-child) {
        margin-inline-end: 12px
    }

    #facebookButton {
        background-image: url(icons/facebook.svg)
    }

    #twitterButton {
        background-image: url(icons/twitter.svg)
    }

    #emailButton {
        background-image: url(icons/mail.svg)
    }

    #url {
        --cr-input-error-display: none
    }

    #copyButton {
        --cr-icon-image: url(icons/copy.svg);
        margin-inline-start: 2px
    }</style>
    <cr-dialog id="dialog" show-on-attach>
        <div id="title" slot="title">
            [[title]]
        </div>
        <div slot="body">
            <div id="buttons">
                <cr-button id="facebookButton" title="Facebook" on-click="onFacebookClick_">
                </cr-button>
                <cr-button id="twitterButton" title="Twitter" on-click="onTwitterClick_">
                </cr-button>
                <cr-button id="emailButton" title="鐢靛瓙閭欢" on-click="onEmailClick_">
                </cr-button>
            </div>
            <cr-input readonly="readonly" label="娑傞甫閾炬帴" id="url" value="[[url.url]]">
                <cr-icon-button id="copyButton" slot="suffix" title="澶嶅埗閾炬帴" on-click="onCopyClick_">
                </cr-icon-button>
            </cr-input>
        </div>
        <div slot="button-container">
            <cr-button id="doneButton" class="action-button" on-click="onCloseClick_">
                瀹屾垚
            </cr-button>
        </div>
    </cr-dialog>
    <!--_html_template_end_-->`
}

// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const FACEBOOK_APP_ID = 738026486351791;

class DoodleShareDialogElement extends PolymerElement {
    static get is() {
        return "ntp-doodle-share-dialog"
    }

    static get template() {
        return getTemplate$2()
    }

    static get properties() {
        return {title: String, url: Object}
    }

    onFacebookClick_() {
        const url = "https://www.facebook.com/dialog/share" + `?app_id=${FACEBOOK_APP_ID}` + `&href=${encodeURIComponent(this.url.url)}` + `&hashtag=${encodeURIComponent("#GoogleDoodle")}`;
        WindowProxy.getInstance().open(url);
        this.notifyShare_(DoodleShareChannel.kFacebook)
    }

    onTwitterClick_() {
        const url = "https://twitter.com/intent/tweet" + `?text=${encodeURIComponent(`${this.title}\n${this.url.url}`)}`;
        WindowProxy.getInstance().open(url);
        this.notifyShare_(DoodleShareChannel.kTwitter)
    }

    onEmailClick_() {
        const url = `mailto:?subject=${encodeURIComponent(this.title)}` + `&body=${encodeURIComponent(this.url.url)}`;
        WindowProxy.getInstance().navigate(url);
        this.notifyShare_(DoodleShareChannel.kEmail)
    }

    onCopyClick_() {
        this.$.url.select();
        navigator.clipboard.writeText(this.url.url);
        this.notifyShare_(DoodleShareChannel.kLinkCopy)
    }

    onCloseClick_() {
        this.$.dialog.close()
    }

    notifyShare_(channel) {
        this.dispatchEvent(new CustomEvent("share", {detail: channel}))
    }
}

customElements.define(DoodleShareDialogElement.is, DoodleShareDialogElement);

function getTemplate$1() {
    return html`<!--_html_template_start_-->
    <style include="cr-hidden-style">:host {
        --ntp-logo-height: 200px;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        justify-content: flex-end;
        min-height: var(--ntp-logo-height)
    }

    :host([reduced-logo-space-enabled_]) {
        --ntp-logo-height: 168px
    }

    :host([doodle-boxed_]) {
        justify-content: flex-end
    }

    #logo {
        forced-color-adjust: none;
        height: 92px;
        width: 272px
    }

    :host([single-colored]) #logo {
        -webkit-mask-image: url(icons/google_logo.svg);
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 100%;
        background-color: var(--ntp-logo-color)
    }

    :host(:not([single-colored])) #logo {
        background-image: url(icons/google_logo.svg)
    }

    #imageDoodle {
        cursor: pointer;
        outline: 0
    }

    #imageDoodle[tabindex='-1'] {
        cursor: auto
    }

    :host([doodle-boxed_]) #imageDoodle {
        background-color: var(--ntp-logo-box-color);
        border-radius: 20px;
        padding: 16px 24px
    }

    :host-context(.focus-outline-visible) #imageDoodle:focus {
        box-shadow: 0 0 0 2px rgba(var(--google-blue-600-rgb), .4)
    }

    #imageContainer {
        display: flex;
        height: fit-content;
        position: relative;
        width: fit-content
    }

    #image {
        max-height: var(--ntp-logo-height);
        max-width: 100%
    }

    :host([doodle-boxed_]) #image {
        max-height: 160px
    }

    :host([doodle-boxed_][reduced-logo-space-enabled_]) #image {
        max-height: 128px
    }

    #animation {
        height: 100%;
        pointer-events: none;
        position: absolute;
        width: 100%
    }

    #shareButton {
        background-color: var(--ntp-logo-share-button-background-color, none);
        border: none;
        height: var(--ntp-logo-share-button-height, 0);
        left: var(--ntp-logo-share-button-x, 0);
        min-width: var(--ntp-logo-share-button-width, 0);
        opacity: .8;
        outline: initial;
        padding: 2px;
        position: absolute;
        top: var(--ntp-logo-share-button-y, 0);
        width: var(--ntp-logo-share-button-width, 0)
    }

    #shareButton:hover {
        opacity: 1
    }

    #shareButton img {
        height: 100%;
        width: 100%
    }

    #iframe {
        border: none;
        height: var(--height, var(--ntp-logo-height));
        transition-duration: var(--duration, 100ms);
        transition-property: height, width;
        width: var(--width, 100%)
    }

    #iframe:not([expanded]) {
        max-height: var(--ntp-logo-height)
    }</style>

    <template is="dom-if" if="[[showLogo_]]" restamp>
        <div id="logo"></div>
    </template>
    <template is="dom-if" if="[[showDoodle_]]" restamp>
        <div id="doodle" title="[[doodle_.description]]">
            <div id="imageDoodle" hidden="[[!imageDoodle_]]" tabindex$="[[imageDoodleTabIndex_]]"
                 on-click="onImageClick_" on-keydown="onImageKeydown_">
                <div id="imageContainer">

                    <img id="image" src="[[imageUrl_]]" on-load="onImageLoad_">
                    <ntp-iframe id="animation" src="[[animationUrl_]]" hidden="[[!showAnimation_]]">
                    </ntp-iframe>
                    <cr-button id="shareButton" title="鍒嗕韩娑傞甫" on-click="onShareButtonClick_"
                               hidden="[[!imageDoodle_.shareButton]]">
                        <img id="shareButtonImage" src="[[imageDoodle_.shareButton.iconUrl.url]]">

                    </cr-button>
                </div>
            </div>
            <template is="dom-if" if="[[iframeUrl_]]" restamp>
                <ntp-iframe id="iframe" src="[[iframeUrl_]]" expanded$="[[expanded_]]"
                            allow="autoplay; clipboard-write">
                </ntp-iframe>
            </template>
        </div>
    </template>
    <template is="dom-if" if="[[showShareDialog_]]" restamp>
        <ntp-doodle-share-dialog title="[[doodle_.description]]" url="[[doodle_.image.shareUrl]]"
                                 on-close="onShareDialogClose_" on-share="onShare_">
        </ntp-doodle-share-dialog>
    </template>
    <!--_html_template_end_-->`
}

// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const SHARE_BUTTON_SIZE_PX = 26;

class LogoElement extends PolymerElement {
    constructor() {
        performance.mark("logo-creation-start");
        super();
        this.eventTracker_ = new EventTracker;
        this.imageClickParams_ = null;
        this.interactionLogUrl_ = null;
        this.shareId_ = null;
        this.pageHandler_ = NewTabPageProxy.getInstance().handler;
        this.pageHandler_.getDoodle().then((({doodle: doodle}) => {
            this.doodle_ = doodle;
            this.loaded_ = true;
            if (this.doodle_ && this.doodle_.interactive) {
                this.width_ = `${this.doodle_.interactive.width}px`;
                this.height_ = `${this.doodle_.interactive.height}px`
            }
        }))
    }

    static get is() {
        return "ntp-logo"
    }

    static get template() {
        return getTemplate$1()
    }

    static get properties() {
        return {
            singleColored: {reflectToAttribute: true, type: Boolean, value: false},
            dark: {observer: "onDarkChange_", type: Boolean},
            backgroundColor: Object,
            loaded_: Boolean,
            doodle_: Object,
            imageDoodle_: {
                observer: "onImageDoodleChange_",
                computed: "computeImageDoodle_(dark, doodle_)",
                type: Object
            },
            showLogo_: {computed: "computeShowLogo_(loaded_, showDoodle_)", type: Boolean},
            showDoodle_: {computed: "computeShowDoodle_(doodle_, imageDoodle_)", type: Boolean},
            doodleBoxed_: {
                reflectToAttribute: true,
                type: Boolean,
                computed: "computeDoodleBoxed_(backgroundColor, imageDoodle_)"
            },
            imageUrl_: {computed: "computeImageUrl_(imageDoodle_)", type: String},
            showAnimation_: {type: Boolean, value: false},
            animationUrl_: {computed: "computeAnimationUrl_(imageDoodle_)", type: String},
            iframeUrl_: {computed: "computeIframeUrl_(doodle_)", type: String},
            duration_: {observer: "onDurationHeightWidthChange_", type: String},
            height_: {observer: "onDurationHeightWidthChange_", type: String},
            width_: {observer: "onDurationHeightWidthChange_", type: String},
            expanded_: Boolean,
            showShareDialog_: Boolean,
            imageDoodleTabIndex_: {type: Number, computed: "computeImageDoodleTabIndex_(doodle_, showAnimation_)"},
            reducedLogoSpaceEnabled_: {
                type: Boolean,
                reflectToAttribute: true,
                value: () => loadTimeData.getBoolean("reducedLogoSpaceEnabled")
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.eventTracker_.add(window, "message", (({data: data}) => {
            if (data["cmd"] === "resizeDoodle") {
                assert(data.duration);
                this.duration_ = data.duration;
                assert(data.height);
                this.height_ = data.height;
                assert(data.width);
                this.width_ = data.width;
                this.expanded_ = true
            } else if (data["cmd"] === "sendMode") {
                this.sendMode_()
            }
        }));
        this.sendMode_()
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.eventTracker_.removeAll()
    }

    ready() {
        super.ready();
        performance.measure("logo-creation", "logo-creation-start")
    }

    onImageDoodleChange_() {
        const shareButton = this.imageDoodle_ && this.imageDoodle_.shareButton;
        if (shareButton) {
            const height = this.imageDoodle_.height;
            const width = this.imageDoodle_.width;
            this.updateStyles({
                "--ntp-logo-share-button-background-color": skColorToRgba(shareButton.backgroundColor),
                "--ntp-logo-share-button-height": `${SHARE_BUTTON_SIZE_PX / height * 100}%`,
                "--ntp-logo-share-button-width": `${SHARE_BUTTON_SIZE_PX / width * 100}%`,
                "--ntp-logo-share-button-x": `${shareButton.x / width * 100}%`,
                "--ntp-logo-share-button-y": `${shareButton.y / height * 100}%`
            })
        } else {
            this.updateStyles({
                "--ntp-logo-share-button-background-color": null,
                "--ntp-logo-share-button-height": null,
                "--ntp-logo-share-button-width": null,
                "--ntp-logo-share-button-x": null,
                "--ntp-logo-share-button-y": null
            })
        }
        if (this.imageDoodle_) {
            this.updateStyles({"--ntp-logo-box-color": skColorToRgba(this.imageDoodle_.backgroundColor)})
        } else {
            this.updateStyles({"--ntp-logo-box-color": null})
        }
        this.showAnimation_ = false;
        this.imageClickParams_ = null;
        this.interactionLogUrl_ = null;
        this.shareId_ = null
    }

    computeImageDoodle_() {
        return this.doodle_ && this.doodle_.image && (this.dark ? this.doodle_.image.dark : this.doodle_.image.light) || null
    }

    computeShowLogo_() {
        return !!this.loaded_ && !this.showDoodle_
    }

    computeShowDoodle_() {
        return !!this.imageDoodle_ || !!this.doodle_ && !!this.doodle_.interactive && window.navigator.onLine
    }

    computeDoodleBoxed_() {
        return !this.backgroundColor || !!this.imageDoodle_ && this.imageDoodle_.backgroundColor.value !== this.backgroundColor.value
    }

    onImageClick_() {
        if ($$(this, "#imageDoodle").tabIndex < 0) {
            return
        }
        if (this.isCtaImageShown_()) {
            this.showAnimation_ = true;
            this.pageHandler_.onDoodleImageClicked(DoodleImageType.kCta, this.interactionLogUrl_);
            this.logImageRendered_(DoodleImageType.kAnimation, this.imageDoodle_.animationImpressionLogUrl);
            if (!this.doodle_.image.onClickUrl) {
                $$(this, "#imageDoodle").blur()
            }
            return
        }
        assert(this.doodle_.image.onClickUrl);
        this.pageHandler_.onDoodleImageClicked(this.showAnimation_ ? DoodleImageType.kAnimation : DoodleImageType.kStatic, null);
        const onClickUrl = new URL(this.doodle_.image.onClickUrl.url);
        if (this.imageClickParams_) {
            for (const param of new URLSearchParams(this.imageClickParams_)) {
                onClickUrl.searchParams.append(param[0], param[1])
            }
        }
        WindowProxy.getInstance().open(onClickUrl.toString())
    }

    onImageLoad_() {
        this.logImageRendered_(this.isCtaImageShown_() ? DoodleImageType.kCta : DoodleImageType.kStatic, this.imageDoodle_.imageImpressionLogUrl)
    }

    async logImageRendered_(type, logUrl) {
        const {
            imageClickParams: imageClickParams,
            interactionLogUrl: interactionLogUrl,
            shareId: shareId
        } = await this.pageHandler_.onDoodleImageRendered(type, WindowProxy.getInstance().now(), logUrl);
        this.imageClickParams_ = imageClickParams;
        this.interactionLogUrl_ = interactionLogUrl;
        this.shareId_ = shareId
    }

    onImageKeydown_(e) {
        if ([" ", "Enter"].includes(e.key)) {
            this.onImageClick_()
        }
    }

    onShare_(e) {
        const doodleId = new URL(this.doodle_.image.onClickUrl.url).searchParams.get("ct");
        if (!doodleId) {
            return
        }
        this.pageHandler_.onDoodleShared(e.detail, doodleId, this.shareId_)
    }

    isCtaImageShown_() {
        return !this.showAnimation_ && !!this.imageDoodle_ && !!this.imageDoodle_.animationUrl
    }

    sendMode_() {
        const iframe = $$(this, "#iframe");
        if (this.dark === undefined || !iframe) {
            return
        }
        iframe.postMessage({cmd: "changeMode", dark: this.dark})
    }

    onDarkChange_() {
        this.sendMode_()
    }

    computeImageUrl_() {
        return this.imageDoodle_ ? this.imageDoodle_.imageUrl.url : ""
    }

    computeAnimationUrl_() {
        return this.imageDoodle_ && this.imageDoodle_.animationUrl ? `chrome-untrusted://new-tab-page/image?${this.imageDoodle_.animationUrl.url}` : ""
    }

    computeIframeUrl_() {
        if (this.doodle_ && this.doodle_.interactive) {
            const url = new URL(this.doodle_.interactive.url.url);
            url.searchParams.append("theme_messages", "0");
            return url.href
        } else {
            return ""
        }
    }

    onShareButtonClick_(e) {
        e.stopPropagation();
        this.showShareDialog_ = true
    }

    onShareDialogClose_() {
        this.showShareDialog_ = false
    }

    onDurationHeightWidthChange_() {
        this.updateStyles({"--duration": this.duration_, "--height": this.height_, "--width": this.width_})
    }

    computeImageDoodleTabIndex_() {
        return this.doodle_ && this.doodle_.image && (this.isCtaImageShown_() || this.doodle_.image.onClickUrl) ? 0 : -1
    }
}

customElements.define(LogoElement.is, LogoElement);
// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let instance$1 = null;

class BrowserProxy {
    constructor() {
        this.callbackRouter = new PageCallbackRouter$1;
        const pageHandlerRemote = PageHandler$1.getRemote();
        pageHandlerRemote.setPage(this.callbackRouter.$.bindNewPipeAndPassRemote())
    }

    static getInstance() {
        return instance$1 || (instance$1 = new BrowserProxy)
    }

    static setInstance(newInstance) {
        instance$1 = newInstance
    }
}

// Copyright 2021 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const COLORS_CSS_SELECTOR = "link[href*='//theme/colors.css']";
let documentInstance = null;

class ColorChangeUpdater {
    constructor(root) {
        this.listenerId_ = null;
        assert(documentInstance === null || root !== document);
        this.root_ = root
    }

    static forDocument() {
        return documentInstance || (documentInstance = new ColorChangeUpdater(document))
    }

    start() {
        if (this.listenerId_ !== null) {
            return
        }
        this.listenerId_ = BrowserProxy.getInstance().callbackRouter.onColorProviderChanged.addListener(this.onColorProviderChanged.bind(this))
    }

    async onColorProviderChanged() {
        await this.refreshColorsCss()
    }

    async refreshColorsCss() {
        const colorCssNode = this.root_.querySelector(COLORS_CSS_SELECTOR);
        if (!colorCssNode) {
            return false
        }
        const href = colorCssNode.getAttribute("href");
        if (!href) {
            return false
        }
        const hrefURL = new URL(href, location.href);
        const params = new URLSearchParams(hrefURL.search);
        params.set("version", (new Date).getTime().toString());
        const newHref = `${hrefURL.origin}${hrefURL.pathname}?${params.toString()}`;
        const newColorsCssLink = document.createElement("link");
        newColorsCssLink.setAttribute("href", newHref);
        newColorsCssLink.rel = "stylesheet";
        newColorsCssLink.type = "text/css";
        const newColorsLoaded = new Promise((resolve => {
            newColorsCssLink.onload = resolve
        }));
        if (this.root_ === document) {
            document.getElementsByTagName("body")[0].appendChild(newColorsCssLink)
        } else {
            this.root_.appendChild(newColorsCssLink)
        }
        await newColorsLoaded;
        const oldColorCssNode = document.querySelector(COLORS_CSS_SELECTOR);
        if (oldColorCssNode) {
            oldColorCssNode.remove()
        }
        return true
    }
}

function getTemplate() {
    return html`<!--_html_template_start_-->
    <style include="cr-shared-style">:host {
        --cr-focus-outline-color: var(--color-new-tab-page-focus-ring);
        --ntp-theme-text-shadow: none;
        --ntp-one-google-bar-height: 56px;
        --ntp-search-box-width: 337px;
        --ntp-menu-shadow: var(--color-new-tab-page-menu-inner-shadow) 0 1px 2px 0, var(--color-new-tab-page-menu-outer-shadow) 0 2px 6px 2px;
        --ntp-module-width: var(--ntp-search-box-width);
        --ntp-module-layout-width: var(--ntp-search-box-width);
        --ntp-module-border-radius: 5px;
        --ntp-protected-icon-background-color: transparent;
        --ntp-protected-icon-background-color-hovered: rgba(255, 255, 255, .1)
    }

    @media (min-width: 560px) {
        :host {
            --ntp-search-box-width: 449px
        }
    }

    @media (min-width: 672px) {
        :host {
            --ntp-search-box-width: 561px
        }
    }

    @media (min-width: 804px) {
        :host([wide-modules-enabled_]) {
            --ntp-module-layout-width: 768px;
            --ntp-module-width: 768px
        }
    }

    :host-context([chrome-refresh-2023]) cr-most-visited {
        --add-shortcut-background-color: var(--color-new-tab-page-add-shortcut-background);
        --add-shortcut-foreground-color: var(--color-new-tab-page-add-shortcut-foreground)
    }

    :host([modules-redesigned-enabled_]) {
        --ntp-module-border-radius: 16px;
        --ntp-module-item-border-radius: 12px;
        --ntp-module-layout-width: 360px;
        --ntp-module-width: 360px
    }

    :host([show-background-image_]) {
        --ntp-theme-text-shadow: 0.5px 0.5px 1px rgba(0, 0, 0, 0.5), 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 0px 10px rgba(0, 0, 0, 0.1);
        --ntp-protected-icon-background-color: rgba(0, 0, 0, .6);
        --ntp-protected-icon-background-color-hovered: rgba(0, 0, 0, .7)
    }

    #oneGoogleBarScrim {
        background: linear-gradient(rgba(0, 0, 0, .25) 0, rgba(0, 0, 0, .12) 45%, rgba(0, 0, 0, .05) 65%, transparent 100%);
        height: 80px;
        position: absolute;
        top: 0;
        width: 100%
    }

    #oneGoogleBarScrim[fixed] {
        position: fixed
    }

    #oneGoogleBar {
        height: 100%;
        position: absolute;
        top: 0;
        width: 100%
    }

    #content {
        align-items: center;
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--ntp-one-google-bar-height));
        min-width: fit-content;
        padding-top: var(--ntp-one-google-bar-height);
        position: relative;
        z-index: 1
    }

    #logo {
        margin-bottom: 38px;
        z-index: 1
    }

    #realboxContainer {
        display: inherit;
        margin-bottom: 16px;
        position: relative
    }

    ntp-modules {
        flex-shrink: 0;
        width: var(--ntp-module-layout-width)
    }

    #modules:not([hidden]) {
        animation: .3s ease-in-out fade-in-animation
    }

    @keyframes fade-in-animation {
        0% {
            opacity: 0
        }
        100% {
            opacity: 1
        }
    }

    ntp-middle-slot-promo {
        max-width: var(--ntp-search-box-width)
    }

    ntp-realbox {
        visibility: hidden
    }

    ntp-realbox[shown] {
        visibility: visible
    }

    cr-most-visited {
        --cr-menu-shadow: var(--ntp-menu-shadow);
        --most-visited-focus-shadow: var(--ntp-focus-shadow);
        --most-visited-text-color: var(--color-new-tab-page-most-visited-foreground);
        --most-visited-text-shadow: var(--ntp-theme-text-shadow)
    }

    ntp-middle-slot-promo:not([hidden]) ~ #modules {
        margin-top: 16px
    }

    #customizeButtonContainer {
        background-color: var(--color-new-tab-page-button-background);
        border-radius: calc(.5 * var(--cr-button-height));
        bottom: 16px;
        position: fixed
    }

    #customizeButtonContainer:has(help-bubble) {
        z-index: 1001
    }

    :host-context([dir=ltr]) #customizeButtonContainer {
        right: 16px
    }

    :host-context([dir=rtl]) #customizeButtonContainer {
        left: 16px
    }

    :host([show-background-image_]) #customizeButtonContainer {
        background-color: var(--ntp-protected-icon-background-color)
    }

    :host([show-background-image_]) #customizeButtonContainer:hover {
        background-color: var(--ntp-protected-icon-background-color-hovered)
    }

    #customizeButton {
        --hover-bg-color: var(--color-new-tab-page-button-background-hovered);
        --text-color: var(--color-new-tab-page-button-foreground);
        border: none;
        border-radius: calc(.5 * var(--cr-button-height));
        box-shadow: 0 3px 6px rgba(0, 0, 0, .16), 0 1px 2px rgba(0, 0, 0, .23);
        font-weight: 400;
        min-width: 32px;
        padding-inline-start: 16px;
        padding-inline-end: 16px
    }

    :host([show-background-image_]) #customizeButton {
        box-shadow: none;
        padding: 0
    }

    :host-context([chrome-refresh-2023]):host([show-background-image_]) #customizeButton {
        padding-inline-start: 8px
    }

    :host-context(.focus-outline-visible) #customizeButton:focus {
        box-shadow: var(--ntp-focus-shadow)
    }

    #customizeIcon {
        -webkit-mask-image: url(icons/icon_pencil.svg);
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 100%;
        background-color: var(--text-color);
        height: 16px;
        width: 16px
    }

    @media (forced-colors: active) {
        #customizeIcon {
            background-color: ButtonText
        }
    }

    :host-context([chrome-refresh-2023]) #customizeButton {
        --cr-button-height: 32px
    }

    @media (forced-colors: none) {
        :host([show-background-image_]) #customizeIcon {
            background-color: #fff
        }
    }

    :host([show-background-image_]) #customizeIcon {
        margin: 0
    }

    @media (max-width: 550px) {
        :host-context([chrome-refresh-2023]) #customizeButton {
            padding-inline-start: 8px
        }

        #customizeButton {
            padding-inline-start: 0;
            padding-inline-end: 0
        }

        #customizeText {
            display: none
        }
    }

    @media (max-width: 1110px) {
        :host-context([chrome-refresh-2023]):host([modules-redesigned-enabled_][modules-shown-to-user]) #customizeButton {
            padding-inline-start: 8px
        }

        :host([modules-redesigned-enabled_][modules-shown-to-user]) #customizeText {
            display: none
        }

        :host([modules-redesigned-enabled_][modules-shown-to-user]) #customizeButton {
            padding-inline-start: 0;
            padding-inline-end: 0
        }
    }

    @media (max-width: 970px) {
        :host-context([chrome-refresh-2023]):host([modules-shown-to-user]) #customizeButton {
            padding-inline-start: 8px
        }

        :host([modules-shown-to-user]) #customizeButton {
            padding-inline-start: 0;
            padding-inline-end: 0
        }

        :host([modules-shown-to-user]) #customizeText {
            display: none
        }
    }

    @media (max-width: 1020px) {
        :host-context([chrome-refresh-2023]):host([modules-fre-shown]) #customizeButton {
            padding-inline-start: 8px
        }

        :host([modules-fre-shown]) #customizeButton {
            padding-inline-start: 0;
            padding-inline-end: 0
        }

        :host([modules-fre-shown]) #customizeText {
            display: none
        }
    }

    #themeAttribution {
        align-self: flex-start;
        bottom: 16px;
        color: var(--color-new-tab-page-secondary-foreground);
        margin-inline-start: 16px;
        position: fixed
    }

    #backgroundImageAttribution {
        border-radius: 8px;
        bottom: 16px;
        color: var(--color-new-tab-page-attribution-foreground);
        line-height: 20px;
        max-width: 50vw;
        padding: 8px;
        position: fixed;
        z-index: -1;
        background-color: var(--ntp-protected-icon-background-color);
        text-shadow: none
    }

    #backgroundImageAttribution:hover {
        background-color: var(--ntp-protected-icon-background-color-hovered);
        background: rgba(var(--google-grey-900-rgb), .1)
    }

    :host-context([dir=ltr]) #backgroundImageAttribution {
        left: 16px
    }

    :host-context([dir=rtl]) #backgroundImageAttribution {
        right: 16px
    }

    #backgroundImageAttribution1Container {
        align-items: center;
        display: flex;
        flex-direction: row
    }

    #linkIcon {
        -webkit-mask-image: url(icons/link.svg);
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: 100%;
        background-color: var(--color-new-tab-page-attribution-foreground);
        height: 16px;
        margin-inline-end: 8px;
        width: 16px
    }

    #backgroundImageAttribution1, #backgroundImageAttribution2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    #backgroundImageAttribution1 {
        font-size: .875rem
    }

    #backgroundImageAttribution2 {
        font-size: .75rem
    }

    #contentBottomSpacer {
        flex-shrink: 0;
        height: 32px;
        width: 1px
    }

    svg {
        position: fixed
    }

    ntp-lens-upload-dialog {
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 101
    }

    #webstoreToast {
        padding: 16px
    }</style>
    <div id="content"
         style="--color-new-tab-page-attribution-foreground:[[rgbaOrInherit_(theme_.textColor) ]];--color-new-tab-page-most-visited-foreground:[[rgbaOrInherit_(theme_.textColor) ]];--ntp-logo-color:[[rgbaOrInherit_(logoColor_) ]]">
        <template is="dom-if" if="[[lazyRender_]]">
            <template is="dom-if" if="[[oneGoogleBarEnabled_]]">
                <div id="oneGoogleBarScrim" hidden$="[[!showBackgroundImage_]]" fixed$="[[scrolledToTop_]]"></div>
                <ntp-iframe id="oneGoogleBar" src="[[oneGoogleBarIframePath_]]" hidden$="[[!oneGoogleBarLoaded_]]"
                            allow="camera [[oneGoogleBarIframeOrigin_]]; display-capture [[oneGoogleBarIframeOrigin_]]">
                </ntp-iframe>
            </template>
        </template>

        <ntp-logo id="logo" single-colored$="[[singleColoredLogo_]]" dark="[[theme_.isDark]]"
                  background-color="[[backgroundColor_]]" hidden$="[[!logoEnabled_]]">
        </ntp-logo>
        <div id="realboxContainer">
            <ntp-realbox id="realbox" is-dark="[[theme_.isDark]]" single-colored-icons="[[theme_.themeRealboxIcons]]"
                         on-open-lens-search="onOpenLensSearch_" on-open-voice-search="onOpenVoiceSearch_"
                         shown$="[[realboxShown_]]">
            </ntp-realbox>
            <template is="dom-if" if="[[showLensUploadDialog_]]" restamp>
                <ntp-lens-upload-dialog id="lensUploadDialog" on-close-lens-search="onCloseLensSearch_">
                </ntp-lens-upload-dialog>
            </template>
        </div>
        <template is="dom-if" if="[[lazyRender_]]">
            <cr-toast id="webstoreToast" duration="10000" hidden>
                <div>鎮ㄥ彲鍦� Chrome 搴旂敤鍟嗗簵涓壘鍒拌緝鏃х殑鑹插僵</div>
                <cr-button on-click="onWebstoreToastButtonClick_">
                    鏌ユ壘涓婚
                </cr-button>
            </cr-toast>
        </template>
        <dom-if if="[[lazyRender_]]" on-dom-change="onLazyRendered_">
            <template>
                <template is="dom-if" if="[[shortcutsEnabled_]]">
                    <cr-most-visited id="mostVisited" theme="[[theme_.mostVisited]]"
                                     single-row="[[singleRowShortcutsEnabled_]]"
                                     reflow-on-overflow="[[mostVisitedReflowOnOverflowEnabled_]]">
                    </cr-most-visited>
                </template>
                <template is="dom-if" if="[[middleSlotPromoEnabled_]]">
                    <ntp-middle-slot-promo on-ntp-middle-slot-promo-loaded="onMiddleSlotPromoLoaded_"
                                           hidden="[[!promoAndModulesLoaded_]]">
                    </ntp-middle-slot-promo>
                </template>
                <template is="dom-if" if="[[modulesEnabled_]]">
                    <template is="dom-if" if="[[!modulesRedesignedEnabled_]]">
                        <ntp-modules id="modules" modules-fre-shown="{{modulesFreShown}}"
                                     modules-shown-to-user="{{modulesShownToUser}}"
                                     on-customize-module="onCustomizeModule_" on-modules-loaded="onModulesLoaded_"
                                     hidden="[[!promoAndModulesLoaded_]]">
                        </ntp-modules>
                    </template>
                    <template is="dom-if" if="[[modulesRedesignedEnabled_]]">
                        <ntp-modules-v2 id="modules" modules-shown-to-user="{{modulesShownToUser}}"
                                        on-customize-module="onCustomizeModule_" on-modules-loaded="onModulesLoaded_"
                                        hidden="[[!promoAndModulesLoaded_]]">
                        </ntp-modules-v2>
                    </template>
                </template>
                <a id="backgroundImageAttribution" href="[[backgroundImageAttributionUrl_]]"
                   hidden="[[!backgroundImageAttribution1_]]">
                    <div id="backgroundImageAttribution1Container">
                        <div id="linkIcon" hidden="[[!backgroundImageAttributionUrl_]]"></div>
                        <div id="backgroundImageAttribution1">
                            [[backgroundImageAttribution1_]]
                        </div>
                    </div>
                    <div id="backgroundImageAttribution2" hidden="[[!backgroundImageAttribution2_]]">
                        [[backgroundImageAttribution2_]]
                    </div>
                </a>

                <div id="customizeButtonContainer">
                    <cr-button id="customizeButton" on-click="onCustomizeClick_" title="鑷畾涔夋椤�"
                               aria-pressed="[[showCustomize_]]">
                        <div id="customizeIcon" slot="prefix-icon"></div>
                        <div id="customizeText" hidden$="[[showBackgroundImage_]]">
                            鑷畾涔� Chrome
                        </div>
                    </cr-button>
                </div>
                <div id="themeAttribution" hidden$="[[!theme_.backgroundImage.attributionUrl]]">
                    <div>涓婚鑳屾櫙鍒涘缓鑰咃細</div>
                    <img src="[[theme_.backgroundImage.attributionUrl.url]]"><img>
                </div>
            </template>
        </dom-if>
        <div id="contentBottomSpacer"></div>
    </div>
    <dom-if if="[[showVoiceSearchOverlay_]]" restamp>
        <template>
            <ntp-voice-search-overlay on-close="onVoiceSearchOverlayClose_">
            </ntp-voice-search-overlay>
        </template>
    </dom-if>
    <template id="customizeDialogIf" is="dom-if" if="[[showCustomizeDialog_]]" restamp>
        <ntp-customize-dialog on-close="onCustomizeDialogClose_" theme="[[theme_]]"
                              background-selection="{{backgroundSelection_}}"
                              selected-page="[[selectedCustomizeDialogPage_]]">
        </ntp-customize-dialog>
    </template>
    <svg>
        <defs>
            <clipPath id="oneGoogleBarClipPath">

                <rect x="0" y="0" width="1" height="1"></rect>
            </clipPath>
        </defs>
    </svg>
    <!--_html_template_end_-->`
}

// Copyright 2016 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class PromiseResolver {
    constructor() {
        this.resolve_ = () => {
        };
        this.reject_ = () => {
        };
        this.isFulfilled_ = false;
        this.promise_ = new Promise(((resolve, reject) => {
            this.resolve_ = resolution => {
                resolve(resolution);
                this.isFulfilled_ = true
            };
            this.reject_ = reason => {
                reject(reason);
                this.isFulfilled_ = true
            }
        }))
    }

    get isFulfilled() {
        return this.isFulfilled_
    }

    get promise() {
        return this.promise_
    }

    get resolve() {
        return this.resolve_
    }

    get reject() {
        return this.reject_
    }
}

// Copyright 2020 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
class LoadTimeResolver {
    constructor(url) {
        this.resolver_ = new PromiseResolver;
        this.eventTracker_ = new EventTracker;
        this.eventTracker_.add(window, "message", (({data: data}) => {
            if (data.frameType === "background-image" && data.messageType === "loaded" && url === data.url) {
                this.resolve_(data.time)
            }
        }))
    }

    get promise() {
        return this.resolver_.promise
    }

    reject() {
        this.resolver_.reject();
        this.eventTracker_.removeAll()
    }

    resolve_(loadTime) {
        this.resolver_.resolve(loadTime);
        this.eventTracker_.removeAll()
    }
}

let instance = null;

class BackgroundManager {
    constructor() {
        this.loadTimeResolver_ = null;
        this.backgroundImage_ = strictQuery(document.body, "#backgroundImage", HTMLIFrameElement);
        this.url_ = this.backgroundImage_.src
    }

    static getInstance() {
        return instance || (instance = new BackgroundManager)
    }

    static setInstance(newInstance) {
        instance = newInstance
    }

    setShowBackgroundImage(show) {
        document.body.toggleAttribute("show-background-image", show)
    }

    setBackgroundColor(color) {
        document.body.style.backgroundColor = skColorToRgba(color)
    }

    setBackgroundImage(image) {
        const url = new URL("chrome-untrusted://new-tab-page/custom_background_image");
        url.searchParams.append("url", image.url.url);
        if (image.url2x) {
            url.searchParams.append("url2x", image.url2x.url)
        }
        if (image.size) {
            url.searchParams.append("size", image.size)
        }
        if (image.repeatX) {
            url.searchParams.append("repeatX", image.repeatX)
        }
        if (image.repeatY) {
            url.searchParams.append("repeatY", image.repeatY)
        }
        if (image.positionX) {
            url.searchParams.append("positionX", image.positionX)
        }
        if (image.positionY) {
            url.searchParams.append("positionY", image.positionY)
        }
        if (url.href === this.url_) {
            return
        }
        if (this.loadTimeResolver_) {
            this.loadTimeResolver_.reject();
            this.loadTimeResolver_ = null
        }
        this.backgroundImage_.contentWindow.location.replace(url.href);
        this.url_ = url.href
    }

    getBackgroundImageLoadTime() {
        if (!this.loadTimeResolver_) {
            this.loadTimeResolver_ = new LoadTimeResolver(this.backgroundImage_.src);
            WindowProxy.getInstance().postMessage(this.backgroundImage_, "sendLoadTime", "chrome-untrusted://new-tab-page")
        }
        return this.loadTimeResolver_.promise
    }
}

// Copyright 2019 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var NtpElement;
(function (NtpElement) {
    NtpElement[NtpElement["OTHER"] = 0] = "OTHER";
    NtpElement[NtpElement["BACKGROUND"] = 1] = "BACKGROUND";
    NtpElement[NtpElement["ONE_GOOGLE_BAR"] = 2] = "ONE_GOOGLE_BAR";
    NtpElement[NtpElement["LOGO"] = 3] = "LOGO";
    NtpElement[NtpElement["REALBOX"] = 4] = "REALBOX";
    NtpElement[NtpElement["MOST_VISITED"] = 5] = "MOST_VISITED";
    NtpElement[NtpElement["MIDDLE_SLOT_PROMO"] = 6] = "MIDDLE_SLOT_PROMO";
    NtpElement[NtpElement["MODULE"] = 7] = "MODULE";
    NtpElement[NtpElement["CUSTOMIZE"] = 8] = "CUSTOMIZE";
    NtpElement[NtpElement["CUSTOMIZE_BUTTON"] = 9] = "CUSTOMIZE_BUTTON";
    NtpElement[NtpElement["CUSTOMIZE_DIALOG"] = 10] = "CUSTOMIZE_DIALOG"
})(NtpElement || (NtpElement = {}));
var NtpCustomizeChromeEntryPoint;
(function (NtpCustomizeChromeEntryPoint) {
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["CUSTOMIZE_BUTTON"] = 0] = "CUSTOMIZE_BUTTON";
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["MODULE"] = 1] = "MODULE";
    NtpCustomizeChromeEntryPoint[NtpCustomizeChromeEntryPoint["URL"] = 2] = "URL"
})(NtpCustomizeChromeEntryPoint || (NtpCustomizeChromeEntryPoint = {}));
const CUSTOMIZE_URL_PARAM = "customize";
const OGB_IFRAME_ORIGIN = "chrome-untrusted://new-tab-page";
const CUSTOMIZE_CHROME_BUTTON_ELEMENT_ID = "NewTabPageUI::kCustomizeChromeButtonElementId";

function recordClick(element) {
    chrome.metricsPrivate.recordEnumerationValue("NewTabPage.Click", element, Object.keys(NtpElement).length)
}

function recordCustomizeChromeOpen(element) {
    chrome.metricsPrivate.recordEnumerationValue("NewTabPage.CustomizeChromeOpened", element, Object.keys(NtpCustomizeChromeEntryPoint).length)
}

function ensureLazyLoaded() {
    const script = document.createElement("script");
    script.type = "module";
    script.src = getTrustedScriptURL`./lazy_load.js`;
    document.body.appendChild(script)
}

const AppElementBase = HelpBubbleMixin(PolymerElement);

class AppElement extends AppElementBase {
    constructor() {
        performance.mark("app-creation-start");
        super();
        this.showLensUploadDialog_ = false;
        this.setThemeListenerId_ = null;
        this.setCustomizeChromeSidePanelVisibilityListener_ = null;
        this.eventTracker_ = new EventTracker;
        this.backgroundImageLoadStart_ = 0;
        this.showWebstoreToastListenerId_ = null;
        this.callbackRouter_ = NewTabPageProxy.getInstance().callbackRouter;
        this.pageHandler_ = NewTabPageProxy.getInstance().handler;
        this.backgroundManager_ = BackgroundManager.getInstance();
        this.shouldPrintPerformance_ = new URLSearchParams(location.search).has("print_perf");
        this.backgroundImageLoadStartEpoch_ = performance.timeOrigin;
        chrome.metricsPrivate.recordValue({
            metricName: "NewTabPage.Height",
            type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LINEAR,
            min: 1,
            max: 1e3,
            buckets: 200
        }, Math.floor(window.innerHeight));
        chrome.metricsPrivate.recordValue({
            metricName: "NewTabPage.Width",
            type: chrome.metricsPrivate.MetricTypeType.HISTOGRAM_LINEAR,
            min: 1,
            max: 1920,
            buckets: 384
        }, Math.floor(window.innerWidth));
        ColorChangeUpdater.forDocument().start()
    }

    static get is() {
        return "ntp-app"
    }

    static get template() {
        return getTemplate()
    }

    static get properties() {
        return {
            oneGoogleBarIframeOrigin_: {type: String, value: OGB_IFRAME_ORIGIN},
            oneGoogleBarIframePath_: {
                type: String, value: () => {
                    const params = new URLSearchParams;
                    params.set("paramsencoded", btoa(window.location.search.replace(/^[?]/, "&")));
                    return `${OGB_IFRAME_ORIGIN}/one-google-bar?${params}`
                }
            },
            theme_: {observer: "onThemeChange_", type: Object},
            showCustomize_: {
                type: Boolean,
                value: () => WindowProxy.getInstance().url.searchParams.has(CUSTOMIZE_URL_PARAM)
            },
            showCustomizeDialog_: {
                type: Boolean,
                computed: "computeShowCustomizeDialog_(customizeChromeEnabled_, showCustomize_)"
            },
            selectedCustomizeDialogPage_: {
                type: String,
                value: () => WindowProxy.getInstance().url.searchParams.get(CUSTOMIZE_URL_PARAM)
            },
            showVoiceSearchOverlay_: Boolean,
            showBackgroundImage_: {
                computed: "computeShowBackgroundImage_(theme_)",
                observer: "onShowBackgroundImageChange_",
                reflectToAttribute: true,
                type: Boolean
            },
            backgroundImageAttribution1_: {type: String, computed: `computeBackgroundImageAttribution1_(theme_)`},
            backgroundImageAttribution2_: {type: String, computed: `computeBackgroundImageAttribution2_(theme_)`},
            backgroundImageAttributionUrl_: {type: String, computed: `computeBackgroundImageAttributionUrl_(theme_)`},
            backgroundColor_: {computed: "computeBackgroundColor_(showBackgroundImage_, theme_)", type: Object},
            customizeChromeEnabled_: {type: Boolean, value: () => loadTimeData.getBoolean("customizeChromeEnabled")},
            logoColor_: {type: String, computed: "computeLogoColor_(theme_)"},
            singleColoredLogo_: {computed: "computeSingleColoredLogo_(theme_)", type: Boolean},
            realboxLensSearchEnabled_: {type: Boolean, value: () => loadTimeData.getBoolean("realboxLensSearch")},
            realboxShown_: {type: Boolean, computed: "computeRealboxShown_(theme_, showLensUploadDialog_)"},
            logoEnabled_: {type: Boolean, value: () => loadTimeData.getBoolean("logoEnabled")},
            oneGoogleBarEnabled_: {type: Boolean, value: () => loadTimeData.getBoolean("oneGoogleBarEnabled")},
            shortcutsEnabled_: {type: Boolean, value: () => loadTimeData.getBoolean("shortcutsEnabled")},
            singleRowShortcutsEnabled_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("singleRowShortcutsEnabled")
            },
            modulesFreShown: {type: Boolean, reflectToAttribute: true},
            middleSlotPromoEnabled_: {type: Boolean, value: () => loadTimeData.getBoolean("middleSlotPromoEnabled")},
            modulesEnabled_: {type: Boolean, value: () => loadTimeData.getBoolean("modulesEnabled")},
            modulesRedesignedEnabled_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("modulesRedesignedEnabled"),
                reflectToAttribute: true
            },
            mostVisitedReflowOnOverflowEnabled_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("mostVisitedReflowOnOverflowEnabled"),
                reflectToAttribute: true
            },
            wideModulesEnabled_: {
                type: Boolean,
                value: () => loadTimeData.getBoolean("wideModulesEnabled"),
                reflectToAttribute: true
            },
            middleSlotPromoLoaded_: {type: Boolean, value: false},
            modulesLoaded_: {type: Boolean, value: false},
            modulesShownToUser: {type: Boolean, reflectToAttribute: true},
            promoAndModulesLoaded_: {
                type: Boolean,
                computed: `computePromoAndModulesLoaded_(middleSlotPromoLoaded_,\n            modulesLoaded_)`,
                observer: "onPromoAndModulesLoadedChange_"
            },
            showLensUploadDialog_: Boolean,
            lazyRender_: Boolean,
            scrolledToTop_: {type: Boolean, value: document.documentElement.scrollTop <= 0}
        }
    }

    static get observers() {
        return ["updateOneGoogleBarAppearance_(oneGoogleBarLoaded_, theme_)"]
    }

    connectedCallback() {
        super.connectedCallback();
        this.setThemeListenerId_ = this.callbackRouter_.setTheme.addListener((theme => {
            if (!this.theme_) {
                this.onThemeLoaded_(theme)
            }
            performance.measure("theme-set");
            this.theme_ = theme
        }));
        this.setCustomizeChromeSidePanelVisibilityListener_ = this.callbackRouter_.setCustomizeChromeSidePanelVisibility.addListener((visible => {
            this.showCustomize_ = visible
        }));
        this.showWebstoreToastListenerId_ = NewTabPageProxy.getInstance().callbackRouter.showWebstoreToast.addListener((() => {
            if (this.showCustomize_) {
                const toast = $$(this, "#webstoreToast");
                if (toast) {
                    toast.hidden = false;
                    toast.show()
                }
            }
        }));
        if (this.showCustomize_) {
            this.setCustomizeChromeSidePanelVisible_(this.showCustomize_);
            recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.URL)
        }
        this.eventTracker_.add(window, "message", (event => {
            const data = event.data;
            if (typeof data !== "object") {
                return
            }
            if ("frameType" in data && data.frameType === "one-google-bar") {
                this.handleOneGoogleBarMessage_(event)
            }
        }));
        this.eventTracker_.add(window, "keydown", this.onWindowKeydown_.bind(this));
        this.eventTracker_.add(window, "click", this.onWindowClick_.bind(this), true);
        this.eventTracker_.add(document, "scroll", (() => {
            this.scrolledToTop_ = document.documentElement.scrollTop <= 0
        }));
        if (loadTimeData.getString("backgroundImageUrl")) {
            this.backgroundManager_.getBackgroundImageLoadTime().then((time => {
                const duration = time - this.backgroundImageLoadStartEpoch_;
                recordDuration("NewTabPage.Images.ShownTime.BackgroundImage", duration);
                if (this.shouldPrintPerformance_) {
                    this.printPerformanceDatum_("background-image-load", this.backgroundImageLoadStart_, duration);
                    this.printPerformanceDatum_("background-image-loaded", this.backgroundImageLoadStart_ + duration)
                }
            }), (() => {
            }))
        }
        FocusOutlineManager.forDocument(document)
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.callbackRouter_.removeListener(this.setThemeListenerId_);
        this.callbackRouter_.removeListener(this.setCustomizeChromeSidePanelVisibilityListener_);
        this.eventTracker_.removeAll()
    }

    ready() {
        super.ready();
        this.pageHandler_.onAppRendered(WindowProxy.getInstance().now());
        WindowProxy.getInstance().waitForLazyRender().then((() => {
            ensureLazyLoaded();
            this.lazyRender_ = true
        }));
        this.printPerformance_();
        performance.measure("app-creation", "app-creation-start")
    }

    updateOneGoogleBarAppearance_() {
        if (this.oneGoogleBarLoaded_) {
            const isNtpDarkTheme = this.theme_ && (!!this.theme_.backgroundImage || this.theme_.isDark);
            $$(this, "#oneGoogleBar").postMessage({type: "updateAppearance", applyLightTheme: isNtpDarkTheme})
        }
    }

    computeShowCustomizeDialog_() {
        return !this.customizeChromeEnabled_ && this.showCustomize_
    }

    computeBackgroundImageAttribution1_() {
        return this.theme_ && this.theme_.backgroundImageAttribution1 || ""
    }

    computeBackgroundImageAttribution2_() {
        return this.theme_ && this.theme_.backgroundImageAttribution2 || ""
    }

    computeBackgroundImageAttributionUrl_() {
        return this.theme_ && this.theme_.backgroundImageAttributionUrl ? this.theme_.backgroundImageAttributionUrl.url : ""
    }

    computeRealboxShown_(theme, showLensUploadDialog) {
        return theme && !showLensUploadDialog
    }

    computePromoAndModulesLoaded_() {
        return (!loadTimeData.getBoolean("middleSlotPromoEnabled") || this.middleSlotPromoLoaded_) && (!loadTimeData.getBoolean("modulesEnabled") || this.modulesLoaded_)
    }

    async onLazyRendered_() {
        document.documentElement.setAttribute("lazy-loaded", String(true));
        this.registerHelpBubble(CUSTOMIZE_CHROME_BUTTON_ELEMENT_ID, "#customizeButton", {fixed: true});
        this.pageHandler_.maybeShowFeaturePromo(IphFeature.kCustomizeChrome)
    }

    onOpenVoiceSearch_() {
        this.showVoiceSearchOverlay_ = true;
        recordVoiceAction(Action.ACTIVATE_SEARCH_BOX)
    }

    onOpenLensSearch_() {
        this.showLensUploadDialog_ = true
    }

    onCloseLensSearch_() {
        this.showLensUploadDialog_ = false
    }

    onCustomizeClick_() {
        this.selectedCustomizeDialogPage_ = null;
        if (this.customizeChromeEnabled_) {
            this.setCustomizeChromeSidePanelVisible_(!this.showCustomize_);
            if (!this.showCustomize_) {
                this.pageHandler_.incrementCustomizeChromeButtonOpenCount();
                recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.CUSTOMIZE_BUTTON)
            }
        } else {
            this.showCustomize_ = true;
            recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.CUSTOMIZE_BUTTON)
        }
    }

    onCustomizeDialogClose_() {
        this.showCustomize_ = false;
        this.selectedCustomizeDialogPage_ = null
    }

    onVoiceSearchOverlayClose_() {
        this.showVoiceSearchOverlay_ = false
    }

    onWindowKeydown_(e) {
        let ctrlKeyPressed = e.ctrlKey;
        if (ctrlKeyPressed && e.code === "Period" && e.shiftKey) {
            this.showVoiceSearchOverlay_ = true;
            recordVoiceAction(Action.ACTIVATE_KEYBOARD)
        }
    }

    rgbaOrInherit_(skColor) {
        return skColor ? skColorToRgba(skColor) : "inherit"
    }

    computeShowBackgroundImage_() {
        return !!this.theme_ && !!this.theme_.backgroundImage
    }

    onShowBackgroundImageChange_() {
        this.backgroundManager_.setShowBackgroundImage(this.showBackgroundImage_)
    }

    onThemeChange_() {
        if (this.theme_) {
            this.backgroundManager_.setBackgroundColor(this.theme_.backgroundColor)
        }
        this.updateBackgroundImagePath_()
    }

    onThemeLoaded_(theme) {
        chrome.metricsPrivate.recordEnumerationValue("NewTabPage.BackgroundImageSource", theme.backgroundImage ? theme.backgroundImage.imageSource : NtpBackgroundImageSource.kNoImage, NtpBackgroundImageSource.MAX_VALUE);
        chrome.metricsPrivate.recordSparseValueWithPersistentHash("NewTabPage.Collections.IdOnLoad", theme.backgroundImageCollectionId ?? "")
    }

    onPromoAndModulesLoadedChange_() {
        if (this.promoAndModulesLoaded_ && loadTimeData.getBoolean("modulesEnabled")) {
            recordLoadDuration("NewTabPage.Modules.ShownTime", WindowProxy.getInstance().now())
        }
    }

    updateBackgroundImagePath_() {
        const backgroundImage = this.theme_ && this.theme_.backgroundImage;
        if (backgroundImage) {
            this.backgroundManager_.setBackgroundImage(backgroundImage)
        }
    }

    computeBackgroundColor_() {
        if (this.showBackgroundImage_) {
            return null
        }
        return this.theme_ && this.theme_.backgroundColor
    }

    computeLogoColor_() {
        return this.theme_ && (this.theme_.logoColor || (this.theme_.isDark ? hexColorToSkColor("#ffffff") : null))
    }

    computeSingleColoredLogo_() {
        return this.theme_ && (!!this.theme_.logoColor || this.theme_.isDark)
    }

    canShowPromoWithBrowserCommand_(messageData, commandSource, commandOrigin) {
        const commandId = Object.values(Command).includes(messageData.commandId) ? messageData.commandId : Command.kUnknownCommand;
        BrowserCommandProxy.getInstance().handler.canExecuteCommand(commandId).then((({canExecute: canExecute}) => {
            const response = {messageType: messageData.messageType, [messageData.commandId]: canExecute};
            commandSource.postMessage(response, commandOrigin)
        }))
    }

    executePromoBrowserCommand_(commandData, commandSource, commandOrigin) {
        const commandId = Object.values(Command).includes(commandData.commandId) ? commandData.commandId : Command.kUnknownCommand;
        BrowserCommandProxy.getInstance().handler.executeCommand(commandId, commandData.clickInfo).then((({commandExecuted: commandExecuted}) => {
            commandSource.postMessage(commandExecuted, commandOrigin)
        }))
    }

    handleOneGoogleBarMessage_(event) {
        const data = event.data;
        if (data.messageType === "loaded") {
            const oneGoogleBar = $$(this, "#oneGoogleBar");
            oneGoogleBar.style.clipPath = "url(#oneGoogleBarClipPath)";
            oneGoogleBar.style.zIndex = "1000";
            this.oneGoogleBarLoaded_ = true;
            this.pageHandler_.onOneGoogleBarRendered(WindowProxy.getInstance().now())
        } else if (data.messageType === "overlaysUpdated") {
            this.$.oneGoogleBarClipPath.querySelectorAll("rect").forEach((el => {
                el.remove()
            }));
            const overlayRects = data.data;
            overlayRects.forEach((({x: x, y: y, width: width, height: height}) => {
                const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rectElement.setAttribute("x", `${x - 8}`);
                rectElement.setAttribute("y", `${y - 8}`);
                rectElement.setAttribute("width", `${width + 16}`);
                rectElement.setAttribute("height", `${height + 16}`);
                this.$.oneGoogleBarClipPath.appendChild(rectElement)
            }))
        } else if (data.messageType === "can-show-promo-with-browser-command") {
            this.canShowPromoWithBrowserCommand_(data, event.source, event.origin)
        } else if (data.messageType === "execute-browser-command") {
            this.executePromoBrowserCommand_(data.data, event.source, event.origin)
        } else if (data.messageType === "click") {
            recordClick(NtpElement.ONE_GOOGLE_BAR)
        }
    }

    onMiddleSlotPromoLoaded_() {
        this.middleSlotPromoLoaded_ = true
    }

    onModulesLoaded_() {
        this.modulesLoaded_ = true
    }

    onCustomizeModule_() {
        this.showCustomize_ = true;
        this.selectedCustomizeDialogPage_ = CustomizeDialogPage.MODULES;
        recordCustomizeChromeOpen(NtpCustomizeChromeEntryPoint.MODULE);
        this.setCustomizeChromeSidePanelVisible_(this.showCustomize_)
    }

    setCustomizeChromeSidePanelVisible_(visible) {
        if (!this.customizeChromeEnabled_) {
            return
        }
        let section = CustomizeChromeSection.kUnspecified;
        switch (this.selectedCustomizeDialogPage_) {
            case CustomizeDialogPage.BACKGROUNDS:
            case CustomizeDialogPage.THEMES:
                section = CustomizeChromeSection.kAppearance;
                break;
            case CustomizeDialogPage.SHORTCUTS:
                section = CustomizeChromeSection.kShortcuts;
                break;
            case CustomizeDialogPage.MODULES:
                section = CustomizeChromeSection.kModules;
                break
        }
        this.pageHandler_.setCustomizeChromeSidePanelVisible(visible, section)
    }

    printPerformanceDatum_(name, time, auxTime = 0) {
        if (!this.shouldPrintPerformance_) {
            return
        }
        console.info(!auxTime ? `${name}: ${time}` : `${name}: ${time} (${auxTime})`)
    }

    printPerformance_() {
        if (!this.shouldPrintPerformance_) {
            return
        }
        const entryTypes = ["paint", "measure"];
        const log = entry => {
            this.printPerformanceDatum_(entry.name, entry.duration ? entry.duration : entry.startTime, entry.duration && entry.startTime ? entry.startTime : 0)
        };
        const observer = new PerformanceObserver((list => {
            list.getEntries().forEach((entry => {
                log(entry)
            }))
        }));
        observer.observe({entryTypes: entryTypes});
        performance.getEntries().forEach((entry => {
            if (!entryTypes.includes(entry.entryType)) {
                return
            }
            log(entry)
        }))
    }

    onWebstoreToastButtonClick_() {
        window.location.assign(`https://chrome.google.com/webstore/category/collection/chrome_color_themes?hl=${window.navigator.language}`)
    }

    onWindowClick_(e) {
        if (e.composedPath() && e.composedPath()[0] === $$(this, "#content")) {
            recordClick(NtpElement.BACKGROUND);
            return
        }
        for (const target of e.composedPath()) {
            switch (target) {
                case $$(this, "ntp-logo"):
                    recordClick(NtpElement.LOGO);
                    return;
                case $$(this, "ntp-realbox"):
                    recordClick(NtpElement.REALBOX);
                    return;
                case $$(this, "cr-most-visited"):
                    recordClick(NtpElement.MOST_VISITED);
                    return;
                case $$(this, "ntp-middle-slot-promo"):
                    recordClick(NtpElement.MIDDLE_SLOT_PROMO);
                    return;
                case $$(this, "#modules"):
                    recordClick(NtpElement.MODULE);
                    return;
                case $$(this, "#customizeButton"):
                    recordClick(NtpElement.CUSTOMIZE_BUTTON);
                    return;
                case $$(this, "ntp-customize-dialog"):
                    recordClick(NtpElement.CUSTOMIZE_DIALOG);
                    return
            }
        }
        recordClick(NtpElement.OTHER)
    }
}

customElements.define(AppElement.is, AppElement);
export {
    $$,
    AppElement,
    BackgroundManager,
    BrowserCommandProxy,
    BrowserProxyImpl,
    CUSTOMIZE_CHROME_BUTTON_ELEMENT_ID,
    CustomizeDialogPage,
    DoodleShareDialogElement,
    LogoElement,
    MetricsReporterImpl,
    NewTabPageProxy,
    NtpCustomizeChromeEntryPoint,
    NtpElement,
    RealboxBrowserProxy,
    RealboxElement,
    RealboxIconElement,
    RealboxMatchElement,
    Action as VoiceAction,
    WindowProxy,
    decodeString16$1 as decodeString16,
    getTrustedHTML,
    mojoString16,
    recordDuration,
    recordLoadDuration
};