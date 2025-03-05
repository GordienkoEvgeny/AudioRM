<script setup lang="ts">
import { type ButtonHTMLAttributes } from 'vue';
import { type ButtonColor, type ButtonSize } from './type';
import NuxtLink, { type NuxtLinkProps } from '#app/components/nuxt-link';
import { type IconPathEnum } from '~/enums/IconPathEnum';

interface Props extends /* @vue-ignore */ ButtonHTMLAttributes {
    icon?: IconPathEnum;
    iconPosition?: 'left' | 'right';
    iconSize?: {
        width: string;
        height: string;
    };
    iconContainer?: string;
    color?: ButtonColor;
    isOutlined?: boolean;
    isDisabled?: boolean;
    isLoading?: boolean;
    isLink?: boolean;
    isRound?: boolean;
    isSquare?: boolean;
    size?: ButtonSize;
    linkProps?: NuxtLinkProps;
}

interface Emits {
    (event: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
    type: 'button',
    iconPosition: 'right',
    size: 'small',
    isLink: false,
    color: 'black',
    isName: true,
});

const emit = defineEmits<Emits>();

const isActive = computed(() => !(props.isDisabled || props.isLoading));

function onClick(e: Event) {
    if (!isActive.value) {
        e.preventDefault();
        return;
    }

    emit('click');
}
</script>

<template>
    <component
        :is="props.isLink ? NuxtLink : 'button'"
        class="ui-button"
        :class="{
            [`ui-button--${props.color}`]: props.color,
            [`ui-button--${props.size}`]: props.size,
            'ui-button--outlined': props.isOutlined,
            'ui-button--round': props.isRound,
            'ui-button--square': props.isSquare,
            'ui-button--as-link': props.isLink,
            'ui-button--with-icon-left': Boolean(props.icon && props.iconPosition === 'left'),
            'ui-button--with-icon-right': Boolean(props.icon && props.iconPosition === 'right'),
        }"
        :aria-disabled="!isActive"
        v-bind="props.linkProps"
        @click="onClick"
    >
        <slot />
        <span
            v-if="props.icon || $slots.icon"
            :style="{
                '--icon-path': `url(${props.icon})`,
                '--icon-width': props.iconSize?.width,
                '--icon-height': props.iconSize?.height,
                '--icon-container': props.iconContainer,
            }"
            :class="{
                'ui-button__icon--as-bg': props.icon,
                [`ui-button__icon--${props.iconPosition}`]: props.iconPosition,
            }"
            class="ui-button__icon"
        >
            <slot name="icon" />
        </span>
        <svg
            v-if="props.isLoading"
            class="ui-button__loader"
            fill="none"
            width="18"
            height="18"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 1.688v1.875M9 13.5v3M4.312 9H1.688m14.25 0h-1.124m-.97 4.843-.53-.53m.685-9.251-1.06 1.06M3.69 14.31l2.122-2.121M3.846 3.906l1.59 1.59"
            />
        </svg>
    </component>
</template>

<style lang="postcss">
/* default start */
.ui-button {
    --text-color: var(--white);
    --padding-x: var(--size--16);
    --padding-y: var(--size--12);

    font-family: inherit;
    font-size: var(--size--16);
    font-weight: 500;
    border-radius: 3rem;
    color: var(--text-color);
    padding: var(--padding-y) var(--padding-x);
    border: none;
    margin: 0;

    display: inline-flex;
    gap: var(--size--8);
    align-items: center;
    justify-content: center;

    cursor: pointer;
    transition: background-color .3s ease;
}

.ui-button--with-icon-left {
    padding-left: var(--size--10);
}

.ui-button--with-icon-right {
    padding-right: var(--size--10);
}

.ui-button[aria-disabled="true"] {
    --text-color: var(--normal);
    background-color: var(--ultra-light);
    cursor: not-allowed;
}

.ui-button__icon--as-disabled {
    background-color: var(--grey-light);
}

/* Color variants */
.ui-button--black {
    --text-color: var(--white);
    background-color: var(--black);
}

.ui-button--black:hover:not([aria-disabled="true"]) {
    background-color: var(--black-hover);
    --text-color: var(--white);
}

/* White variant */
.ui-button--white {
    --text-color: var(--black);
    background-color: var(--white);
}

.ui-button--white:hover:not([aria-disabled="true"]) {
    background-color: var(--super-light);
}

.ui-button--white[aria-disabled="true"] {
    --text-color: var(--grey-light);
    background-color: var(--white);
}

/* Yellow variants */
.ui-button--yellow {
    --text-color: var(--black);
    background-color: var(--yellow-normal);
}

.ui-button--yellow:hover:not([aria-disabled="true"]) {
    background-color: var(--yellow-light);
}

/* Orange variants */
.ui-button--orange {
    --text-color: var(--black);
    background-color: var(--orange-normal);
}

.ui-button--orange:hover:not([aria-disabled="true"]) {
    background-color: var(--orange-light);
}

.ui-button--orange-dark {
    --text-color: var(--black);
    background-color: var(--orange-dark);
}

.ui-button--orange-dark:hover:not([aria-disabled="true"]) {
    background-color: var(--orange-normal);
}

/* Blue variants */
.ui-button--blue {
    --text-color: var(--black);
    background-color: var(--blue-normal);
}

.ui-button--blue:hover:not([aria-disabled="true"]) {
    background-color: var(--blue-light);
}

.ui-button--blue-dark {
    --text-color: var(--black);
    background-color: var(--blue-dark);
}

.ui-button--blue-dark:hover:not([aria-disabled="true"]) {
    background-color: var(--blue-normal);
}

/* Pink variants */
.ui-button--pink {
    --text-color: var(--black);
    background-color: var(--pink-normal);
}

.ui-button--pink:hover:not([aria-disabled="true"]) {
    background-color: var(--pink-light);
}

/* Lemon variants */
.ui-button--lemon {
    --text-color: var(--black);
    background-color: var(--lemon-normal);
}

.ui-button--lemon:hover:not([aria-disabled="true"]) {
    background-color: var(--lemon-light);
}

.ui-button--grey {
    --text-color: var(--black);
    background-color: var(--ultra-light);
    border: 1px solid var(--light);
}

.ui-button--grey:hover:not([aria-disabled="true"]) {
    background-color: var(--super-light);
    border-color: var(--light);
}

/* Transparent variant */
.ui-button--transparent {
    --text-color: var(--black);
    background-color: transparent;
}

.ui-button--transparent:hover:not([aria-disabled="true"]) {
    background-color: var(--super-light);
}

.ui-button--transparent[aria-disabled="true"] {
    --text-color: var(--grey-light);
    background-color: transparent;
}

/* Outlined variant */
.ui-button--outlined {
    --text-color: var(--black);
    border: 1px solid var(--grey-light);
    background-color: transparent;
}

.ui-button--outlined:hover:not([aria-disabled="true"]) {
    background-color: var(--super-light);
}

.ui-button--outlined[aria-disabled="true"] {
    --text-color: var(--grey-normal);
    background-color: transparent;
}

/* Round variant */
.ui-button--round {
    --padding-x: var(--size--12);
    padding: var(--padding-x);
    border-radius: 50%;
}

/* Square variant */
.ui-button--square {
    border-radius: var(--size--8);
}

/* Link variant */
.ui-button--as-link {
    text-decoration: none;
}

/* Icon styles */
.ui-button__icon {
    display: inline-block;
    mask-size: var(--icon-width) var(--icon-height);
    width: var(--icon-container, var(--icon-width));
    height: var(--icon-container, var(--icon-height));
}

.ui-button__icon--left {
    order: -1;
}

.ui-button__icon--right {
    order: 0;
}

.ui-button__icon--as-bg {
    width: var(--icon-container, var(--icon-width));
    height: var(--icon-container, var(--icon-height));
    mask: var(--icon-path) no-repeat center;
    mask-size: contain;
    mask-size: var(--icon-width) var(--icon-height);
    background-color: var(--text-color);
}

/* Loader animation */
@keyframes btn-loader-rotate {
    0% {
        transform: rotate(0deg) scale(1);
    }
    50% {
        transform: rotate(180deg) scale(1.2);
    }
    100% {
        transform: rotate(360deg) scale(1);
    }
}

.ui-button__loader {
    display: inline-block;
    width: var(--size--16);
    height: var(--size--16);
    line-height: 0;
    color: var(--text-color);
    animation: btn-loader-rotate 2s linear infinite;
}

/* Size variants */
.ui-button--small {
    padding: var(--size--16) var(--size--40);
    font-size: var(--size--16);
    line-height: var(--size--24);
}

.ui-button--medium {
    padding: 1.125rem 3.333rem; /* 18px 60px */
    font-size: var(--size--20);
    line-height: var(--size--28);
}

.ui-button--big {
    padding: 1.875rem 7.5rem; /* 30px 120px */
    font-size: var(--size--20);
    line-height: var(--size--28);
}

.ui-button--secondary-small {
    padding: var(--size--8);
    font-size: var(--size--14);
    line-height: var(--size--20);
}

.ui-button--secondary-medium {
    padding: var(--size--12);
    font-size: var(--size--14);
    line-height: var(--size--20);
}

.ui-button--secondary-big {
    padding: var(--size--12);
    font-size: var(--size--16);
    line-height: var(--size--24);
}
</style>
